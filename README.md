# AURA-3: AI Mental Wellness Companion 🌿

Aura is a compassionate AI-powered mental health companion designed to support your internal narrative through empathetic conversation, mood tracking, and wellness tools.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18 or higher
- **npm**: v9 or higher
- **API Keys**:
  - [Google Gemini API Key](https://aistudio.google.com/)
  - [Hugging Face Access Token](https://huggingface.co/settings/tokens) (Read access)

---

### 2. Backend Setup

1. **Navigate to backend**:
   ```bash
   cd backend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment**:
   - Create a `.env` file in the `backend/` directory.
   - Use the `.env.example` as a template:
     ```env
     PORT=5000
     GEMINI_API_KEY=your_key_here
     HF_TOKEN=your_token_here
     ```

4. **Start Backend**:
   ```bash
   npm run dev
   ```
   *The server will run on [http://localhost:5000](http://localhost:5000)*

---

### 3. Frontend Setup

1. **Navigate to Root**:
   ```bash
   cd ..
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start Frontend**:
   ```bash
   npm run dev
   ```
   *The application will open on [http://localhost:5173](http://localhost:5173)*

---

## 🛠 Features

- **Compassionate Chat**: Powered by **Qwen-2.5** (via Hugging Face) and **Gemini-1.5** (as fallback).
- **Mood Analytics**: Track your emotional journey over time.
- **Wellness Hub**: Interactive tools like breathing exercises.
- **Rich Aesthetics**: Premium, calming UI with glassmorphism and smooth animations.
- **Local Persistence**: Your profile and history are saved locally in your browser and backend.

## 📁 Project Structure

- `/src`: Frontend React components and pages.
- `/backend`: Express.js server and AI service integrations.
- `/backend/db`: Local JSON database (lowdb).

---

## 🤝 Contribution
This project is built with privacy and empathy at its core. Feel free to explore the code and add your own wellness modules!
