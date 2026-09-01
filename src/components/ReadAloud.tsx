"use client";

import { Volume2, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * Strip LaTeX delimiters and markdown so the reader does not say
 * "dollar backslash frac open brace" out loud. Exported for testing.
 */
export function sanitizeForSpeech(text: string): string {
  return text
    .replace(/\$\$?([^$]*)\$\$?/g, "$1")
    .replace(/\\[a-zA-Z]+/g, " ")
    .replace(/[*_`#>{}]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

interface ReadAloudProps {
  text: string;
  /** Shown to screen readers so the control says what it will read. */
  label?: string;
  className?: string;
}

/**
 * Reads text aloud using the browser's built-in speech synthesis.
 *
 * Free for everyone, deliberately: this is an accessibility feature, and
 * paywalling access for visually impaired or dyslexic students would be
 * indefensible. It also costs nothing to run — no API, no server round trip.
 *
 * Renders nothing when the browser has no speech support, rather than showing
 * a button that does nothing.
 */
export function ReadAloud({ text, label, className = "" }: ReadAloudProps) {
  const [supported, setSupported] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
  }, []);

  // Speech continues after navigation unless it is explicitly cancelled.
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!supported || !text.trim()) return null;

  const stop = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  const speak = () => {
    if (speaking) {
      stop();
      return;
    }

    // Cancel anything already queued so two questions cannot overlap.
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(sanitizeForSpeech(text));
    utterance.rate = 0.95;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    utteranceRef.current = utterance;
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      type="button"
      onClick={speak}
      aria-label={speaking ? "Stop reading aloud" : `Read aloud${label ? `: ${label}` : ""}`}
      aria-pressed={speaking}
      title={speaking ? "Stop" : "Read aloud"}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-1 ${
        speaking
          ? "bg-primary-50 border-primary-300 text-primary-700"
          : "bg-white border-zinc-200 text-zinc-600 hover:border-primary-300 hover:text-primary-700"
      } ${className}`}
    >
      {speaking ? <Square className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
      <span className="sr-only sm:not-sr-only">{speaking ? "Stop" : "Listen"}</span>
    </button>
  );
}

export default ReadAloud;
