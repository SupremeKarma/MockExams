/**
 * MockExams: Flashcard Repository
 * Database persistence layer for FSRS algorithm
 * Integrates with Supabase PostgreSQL
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { FlashcardState, ReviewRating } from "./spaced-repetition";

export interface FlashcardRecord {
  id: string;
  student_id: string;
  node_id: string;
  front_prompt: string;
  back_solution: string;
  ease_factor: number;
  interval_days: number;
  repetitions: number;
  next_review: string;
  last_reviewed: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReviewLog {
  id: string;
  student_id: string;
  flashcard_id: string;
  rating: ReviewRating;
  review_time_ms: number;
  created_at: string;
}

export class FlashcardRepository {
  private supabase: SupabaseClient;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Get all cards due for review today (sorted by urgency)
   */
  async getTodaysReviews(studentId: string, limit: number = 20): Promise<FlashcardState[]> {
    const now = new Date().toISOString();

    const { data, error } = await this.supabase
      .from("flashcards")
      .select("*")
      .eq("student_id", studentId)
      .lte("next_review", now)
      .order("next_review", { ascending: true })
      .limit(limit);

    if (error) {
      console.error("Error fetching todays reviews:", error);
      throw error;
    }

    return (data || []).map(this.recordToState);
  }

  /**
   * Get cards by topic/node for targeted review
   */
  async getReviewsByTopic(
    studentId: string,
    nodeId: string,
    limit: number = 20
  ): Promise<FlashcardState[]> {
    const now = new Date().toISOString();

    const { data, error } = await this.supabase
      .from("flashcards")
      .select("*")
      .eq("student_id", studentId)
      .eq("node_id", nodeId)
      .lte("next_review", now)
      .order("next_review", { ascending: true })
      .limit(limit);

    if (error) throw error;
    return (data || []).map(this.recordToState);
  }

  /**
   * Get a single card by ID
   */
  async getCard(cardId: string): Promise<FlashcardState | null> {
    const { data, error } = await this.supabase
      .from("flashcards")
      .select("*")
      .eq("id", cardId)
      .single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    return data ? this.recordToState(data) : null;
  }

  /**
   * Update a single card after review
   */
  async updateCard(card: FlashcardState): Promise<void> {
    const { error } = await this.supabase
      .from("flashcards")
      .update({
        ease_factor: card.easeFactor,
        interval_days: card.intervalDays,
        repetitions: card.repetitions,
        next_review: card.nextReview.toISOString(),
        last_reviewed: card.lastReviewed?.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", card.id);

    if (error) throw error;
  }

  /**
   * Batch update multiple cards after a review session
   */
  async batchUpdateCards(cards: FlashcardState[]): Promise<void> {
    const updates = cards.map((card) => ({
      id: card.id,
      ease_factor: card.easeFactor,
      interval_days: card.intervalDays,
      repetitions: card.repetitions,
      next_review: card.nextReview.toISOString(),
      last_reviewed: card.lastReviewed?.toISOString(),
      updated_at: new Date().toISOString(),
    }));

    const { error } = await this.supabase
      .from("flashcards")
      .upsert(updates, { onConflict: "id" });

    if (error) throw error;
  }

  /**
   * Create a new flashcard
   */
  async createCard(
    studentId: string,
    nodeId: string,
    frontPrompt: string,
    backSolution: string
  ): Promise<FlashcardState> {
    const now = new Date();

    const { data, error } = await this.supabase
      .from("flashcards")
      .insert([
        {
          student_id: studentId,
          node_id: nodeId,
          front_prompt: frontPrompt,
          back_solution: backSolution,
          ease_factor: 2.5,
          interval_days: 1,
          repetitions: 0,
          next_review: now.toISOString(),
          last_reviewed: null,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return this.recordToState(data);
  }

  /**
   * Log a review for analytics
   */
  async logReview(
    studentId: string,
    cardId: string,
    rating: ReviewRating,
    reviewTimeMs: number
  ): Promise<void> {
    const { error } = await this.supabase.from("flashcard_reviews").insert([
      {
        student_id: studentId,
        flashcard_id: cardId,
        rating,
        review_time_ms: reviewTimeMs,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) throw error;
  }

  /**
   * Get review statistics for a student
   */
  async getReviewStats(studentId: string, days: number = 7): Promise<{
    totalReviews: number;
    avgRating: number;
    avgTimeMs: number;
    completionRate: number;
  }> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await this.supabase
      .from("flashcard_reviews")
      .select("rating, review_time_ms")
      .eq("student_id", studentId)
      .gte("created_at", startDate.toISOString());

    if (error) throw error;

    if (!data || data.length === 0) {
      return {
        totalReviews: 0,
        avgRating: 0,
        avgTimeMs: 0,
        completionRate: 0,
      };
    }

    const avgRating =
      data.reduce((sum, r) => sum + r.rating, 0) / data.length;
    const avgTimeMs =
      data.reduce((sum, r) => sum + r.review_time_ms, 0) / data.length;

    return {
      totalReviews: data.length,
      avgRating,
      avgTimeMs,
      completionRate: (data.filter((r) => r.rating >= 3).length / data.length) * 100,
    };
  }

  /**
   * Get mastery progress for a topic
   */
  async getTopicMastery(studentId: string, nodeId: string): Promise<{
    masteredCards: number;
    totalCards: number;
    masteryPercentage: number;
    averageEaseFactor: number;
  }> {
    const { data, error } = await this.supabase
      .from("flashcards")
      .select("ease_factor, repetitions")
      .eq("student_id", studentId)
      .eq("node_id", nodeId);

    if (error) throw error;

    if (!data || data.length === 0) {
      return {
        masteredCards: 0,
        totalCards: 0,
        masteryPercentage: 0,
        averageEaseFactor: 2.5,
      };
    }

    // A card is "mastered" if it has 10+ repetitions and ease factor >= 2.0
    const masteredCards = data.filter((card) => card.repetitions >= 10 && card.ease_factor >= 2.0).length;
    const avgEaseFactor =
      data.reduce((sum, card) => sum + card.ease_factor, 0) / data.length;

    return {
      masteredCards,
      totalCards: data.length,
      masteryPercentage: (masteredCards / data.length) * 100,
      averageEaseFactor: Math.round(avgEaseFactor * 100) / 100,
    };
  }

  /**
   * Delete a card
   */
  async deleteCard(cardId: string): Promise<void> {
    const { error } = await this.supabase
      .from("flashcards")
      .delete()
      .eq("id", cardId);

    if (error) throw error;
  }

  /**
   * Convert database record to FlashcardState
   */
  private recordToState(record: FlashcardRecord): FlashcardState {
    return {
      id: record.id,
      easeFactor: record.ease_factor,
      intervalDays: record.interval_days,
      repetitions: record.repetitions,
      nextReview: new Date(record.next_review),
      lastReviewed: record.last_reviewed ? new Date(record.last_reviewed) : null,
    };
  }
}

/**
 * Initialize repository with environment variables
 */
export function initializeRepository(): FlashcardRepository {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables");
  }

  return new FlashcardRepository(supabaseUrl, supabaseKey);
}
