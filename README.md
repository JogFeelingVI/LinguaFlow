# LinguaFlow - AI-Powered Translation Tool

LinguaFlow is a minimalist, high-performance translation application built with React and powered by Google's Gemini AI. It offers a professional-grade translation experience with built-in history, voice capabilities, and smart text refinement.

## ✨ Features

-   **Multi-Language Translation**: Support for Auto-detect and a wide array of global languages.
-   **Voice Input (STT)**: Dictate your text naturally with integrated speech recognition.
-   **Voice Output (TTS)**: Listen to translations to check pronunciation and flow.
-   **AI Smart Refine**: A "Sparkle" feature that uses AI to automatically fix punctuation, capitalization, and grammar in your input.
-   **Local History**: Your translations are saved locally on your device for quick reference.
-   **Persistence**: History is preserved across browser sessions using `localStorage`.
-   **Markdown Export**: Export your entire translation history into a clean, formatted Markdown file.
-   **Quick Copy**: One-click clipboard functionality for both live results and history items.
-   **Responsive Design**: A sleek, bento-style interface that works beautifully on desktop and mobile.

## 🛠️ Tech Stack

-   **Frontend**: [React 19](https://react.dev/), [Vite](https://vitejs.dev/)
-   **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
-   **AI Engine**: [Google Gemini API](https://ai.google.dev/)
-   **Animations**: [Motion](https://motion.dev/)
-   **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

### Environment Variables

To use the AI features, you need a Gemini API Key. Define it in your `.env` file:

```env
GEMINI_API_KEY="your_api_key_here"
```

### Installation

1.  Clone the repository or download the source.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

## 📖 Usage Tips

-   **Smart Refine**: Use the ✨ icon next to the microphone to let AI polish your dictated text before translating.
-   **History Navigation**: Click on any item in the history sidebar to bring that translation back into the main editor.
-   **Keyboard Friendly**: Paste text and hit "Translate" for instant results.

## 📜 License

Apache-2.0
