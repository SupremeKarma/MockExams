# Natural Language Processing (Track A) (BIT471CO)
**Program**: Purbanchal University B.I.T. | **Semester**: 8 | **Credits**: 3

---

## 1. Teaching Schedule & Examination Scheme (ESE)

| Component | Lecture (L) | Tutorial (T) | Practical (P) | Total Hours/Week | Internal Assessment | End Semester Exam (Final) | Total Marks |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Hours / Marks** | 3 Hrs | 1 Hrs | 2 Hrs | **6 Hrs** | Theory: 20, Lab: 50 | Theory: 80, Lab: 0 | **150** |

### Evaluation Breakdown:
- **Continuous Internal Assessment**: 70 Marks (20 Theory + 50 Practical/Lab)
- **End Semester Final Examination (ESE)**: 80 Marks (80 Theory + 0 Practical/Defense)
- **Total Marks for Course**: **150 Marks**

---

## 2. Course Description & Objectives

Speech and language processing, morphological parsing with FSTs, N-grams, HMM POS tagging, feature unification, WordNet lexical semantics, and discourse pragmatics.

---

## 3. Detailed Syllabus Chapters & Teaching Units

### Unit 1: Introduction to NLP [6 Hours]
- **Topic 1.1**: Definition, issues, and strategies in speech and language processing
- **Topic 1.2**: Application domains and software tools for NLP
- **Topic 1.3**: Linguistic organization of NLP, Natural Language Processing vs Programming Language Processing
- **Topic 1.4**: Word classes, review of Regular Expressions, Context-Free Grammars (CFG), and parsing techniques

### Unit 2: Morphology and Phonology [7 Hours]
- **Topic 2.1**: Inflectional and derivational morphology
- **Topic 2.2**: Morphological parsing with Finite State Transducers (FSTs) and combinational rules
- **Topic 2.3**: Phonology: Speech sounds, phonetic transcription (IPA), phoneme definitions and phonological rules
- **Topic 2.4**: Optimality theory and machine learning of phonological rules
- **Topic 2.5**: Phonological aspects of prosody and speech synthesis (TTS)

### Unit 3: Pronunciation, Spelling and N-grams [7 Hours]
- **Topic 3.1**: Spelling error detection and correction using probabilistic noisy channel models
- **Topic 3.2**: Pronunciation variation: lexical, allophonic, and dialectal variations
- **Topic 3.3**: Decision tree models for pronunciation
- **Topic 3.4**: Counting words in corpora and simple N-gram language models
- **Topic 3.5**: Smoothing techniques: Add-One (Laplace), Witten-Bell, Good-Turing discounting
- **Topic 3.6**: N-grams for spelling correction and pronunciation modeling

### Unit 4: Syntax and Part-of-Speech Tagging [6 Hours]
- **Topic 4.1**: Penn Treebank tagsets and word categories
- **Topic 4.2**: Concept of Hidden Markov Model (HMM) taggers
- **Topic 4.3**: Rule-based vs stochastic POS tagging
- **Topic 4.4**: Viterbi algorithm for HMM decoding and tagging
- **Topic 4.5**: Transformation-Based Learning (Brill) tagger

### Unit 5: Sentence Level Construction & Unification Semantics [7 Hours]
- **Topic 5.1**: Noun phrase structures, co-ordination, and sub-categorization
- **Topic 5.2**: Concept of feature structures and unification
- **Topic 5.3**: Representing Meaning: Unambiguous representation, canonical form, expressiveness, meaning structure of language
- **Topic 5.4**: Basics of First-Order Predicate Calculus (FOPC) in semantic interpretation
- **Topic 5.5**: Syntax-driven semantic analysis, attachment, integration, and robustness

### Unit 6: Lexical Semantics [6 Hours]
- **Topic 6.1**: Lexemes and semantic relationships: homonymy, polysemy, synonymy, hyponymy
- **Topic 6.2**: WordNet taxonomy and relational database structure
- **Topic 6.3**: Internal structure of words, metaphors, and metonymy with computational approaches
- **Topic 6.4**: Word Sense Disambiguation (WSD): Selectional restriction-based, machine learning-based, and dictionary-based (Lesk algorithm) approaches

### Unit 7: Pragmatics and Discourse Structure [6 Hours]
- **Topic 7.1**: Discourse reference resolution and referential phenomena
- **Topic 7.2**: Syntactic and semantic constraints on co-reference
- **Topic 7.3**: Pronoun resolution algorithms (Hobbs algorithm, centering theory)
- **Topic 7.4**: Text coherence and discourse rhetorical structure
- **Topic 7.5**: Dialogues: Turns and utterances, grounding, dialogue acts and conversational structures
- **Topic 7.6**: Natural Language Generation (NLG): introduction to language generation architecture and discourse planning

---

## 4. Laboratory & Practical Guidelines

1. Text processing using Python NLTK and spaCy (tokenization, stopword removal, lemmatization)
2. Building a morphological analyzer using Finite State Transducers (FST)
3. Implementing an N-gram language model with Laplace and Good-Turing smoothing
4. Implementing the Viterbi algorithm for Hidden Markov Model (HMM) POS tagging
5. Rule-based and stochastic chunking and Named Entity Recognition (NER)
6. Synset extraction, semantic similarity calculation, and sense disambiguation using WordNet
7. Building a rule-based or probabilistic chatbot demonstrating dialogue state tracking

---

## 5. Reference Textbooks & Materials

1. Jurafsky, Daniel and James H. Martin, Speech and Language Processing: An Introduction to Natural Language Processing, Computational Linguistics, and Speech Recognition, Pearson Education.
2. Allen, James, Natural Language Understanding, Benjamin/Cummings.
3. Bharati, Akshar, Vineet Chaitanya, and Rajeev Sangal, Natural Language Processing: A Paninian Perspective, Prentice Hall of India.
4. Charniak, Eugene, Statistical Language Learning, MIT Press.
5. Manning, Christopher D. and Hinrich Schutze, Foundations of Statistical Natural Language Processing, MIT Press.
