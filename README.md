# Empathetic AI Voice Recruiter for Multilingual Interview Evaluation

An AI-powered recruitment system that conducts voice-based interviews, evaluates candidate responses using natural language processing and emotion detection, and generates explainable feedback for fair and transparent hiring.

This project was developed as a **Computer Engineering Capstone Project** and selected for the **State-Level OpenAI Academy × NxtWave Buildathon (2026)**.

---

## Overview

Traditional hiring processes often suffer from bias, inconsistency, and lack of structured feedback. Recruiters must manually evaluate interviews, which can lead to subjective decisions and inefficient screening.

This project introduces an **AI-driven voice recruiter system** that evaluates candidates using:

- Multilingual speech recognition
- Emotion detection from voice signals
- Semantic analysis of responses
- Transparent rubric-based scoring
- AI-generated personalized feedback

The system aims to make recruitment **more fair, scalable, and data-driven**.

---

## Key Features

### Multilingual Voice Interviews
Candidates respond to interview questions through voice input. Speech recognition converts responses into text for analysis.

### Emotion-Aware Analysis
A deep learning model trained on datasets such as **RAVDESS** detects vocal cues including:

- Confidence
- Nervousness
- Hesitation
- Emotional tone

### Semantic Response Evaluation
Transformer-based NLP models like **BERT / RoBERTa** analyze candidate responses for:

- Clarity
- Completeness
- Grammar
- Relevance to the question

### Transparent Rubric-Based Scoring
Semantic understanding and emotional delivery are combined using a **weighted evaluation rubric**, producing explainable scores.

### Personalized AI Feedback
The system generates **actionable feedback** to help candidates improve communication and interview performance.

---

## System Architecture
Candidate Voice Input
│
▼
Speech-to-Text (Multilingual ASR)
│
▼
Emotion Detection Model
(CNN/RNN trained on RAVDESS / CREMA-D)
│
▼
Semantic Analysis
(BERT / RoBERTa NLP models)
│
▼
Rubric-Based Scoring Engine
│
▼
AI Feedback Generation (LLM)
│
▼
Recruiter Dashboard & Candidate Report


---

## Tech Stack

### Frontend
- Next.js
- Tailwind CSS
- React

### Backend
- Node.js
- Express.js

### AI / Machine Learning
- BERT / RoBERTa (semantic analysis)
- Deep learning emotion detection models
- Multilingual speech-to-text models

### Data & Infrastructure
- Firebase Authentication
- Firebase Realtime Database
- Cloud storage for audio artifacts

### Datasets
- RAVDESS (emotion recognition)
- CREMA-D (speech emotion dataset)

---

## Implementation Pipeline

1. Candidate records interview responses through voice interface
2. Audio is processed and transcribed using speech recognition
3. Emotion detection model extracts vocal features (MFCC, pitch, energy)
4. NLP models evaluate response semantics
5. Scores are generated using a transparent evaluation rubric
6. AI system produces personalized feedback for candidates
7. Recruiters view analytics and insights through a dashboard

---

## Evaluation Results

The system was evaluated across multiple dimensions:

- Emotion detection performance on speech datasets
- Semantic alignment with expert evaluation rubrics
- Human evaluation of feedback quality

Key results:

- **93% alignment with expert evaluation rubrics**
- **4.6 / 5 relevance score for AI-generated feedback**
- Improved transparency compared to existing AI interview tools

---

## Impact

This system demonstrates how **empathetic AI** can improve hiring processes by:

- Reducing evaluation bias
- Supporting multilingual candidates
- Providing structured feedback
- Scaling interview evaluation

It sets a foundation for **human-aware AI recruitment platforms**.

---

## Future Improvements

- Cross-cultural emotion modeling
- Integration with enterprise ATS platforms
- Enhanced explainability of model decisions
- Multi-turn conversational AI interviews
- Improved support for low-resource languages

---

## Contributors

**Sanjna Deva**  
Computer Engineering – MPSTME, Mumbai

**Soumik Sahu**

Project Guide:  
Dr. Prashasti Kanikar

---

## License

This project is for academic and research purposes.
