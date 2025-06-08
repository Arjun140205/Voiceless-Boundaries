"use client";

import React, { useState, useEffect } from "react";
import LanguageSelector from "../components/LanguageSelector";
import { translateText } from "../utils/translateApi";
import { detectLanguage } from "../utils/languageDetect";
import LiveTranslation from "../components/LiveTranslation";
import { generatePDF } from "../utils/pdfGenerator"; // ⬅️ NEW

const languages = [
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
];

export default function HomePage() {
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("hi");
  const [text, setText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode === "true") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    const detect = async () => {
      if (text.trim().length < 3) return;
      setDetecting(true);
      const detected = await detectLanguage(text);
      if (detected && detected !== sourceLang) {
        setSourceLang(detected);
      }
      setDetecting(false);
    };
    detect();
  }, [text]);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("darkMode", (!darkMode).toString());
    setDarkMode(!darkMode);
  };

  const handleSwapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setTranslatedText("");
    setCopied(false);
  };

  const copyToClipboard = () => {
    if (!translatedText.trim()) return;
    navigator.clipboard.writeText(translatedText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const speakText = (textToSpeak: string, lang: string) => {
    if (!window.speechSynthesis) {
      alert("Speech Synthesis not supported in your browser.");
      return;
    }

    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find((voice) => voice.lang.startsWith(lang));
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = lang;

    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  return (
    <main className="p-6 max-w-3xl mx-auto min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Voiceless Boundaries</h1>
        <button
          onClick={toggleDarkMode}
          className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <LanguageSelector
          selected={sourceLang}
          onChange={setSourceLang}
          languages={languages}
          darkMode={darkMode}
        />
        <button
          onClick={handleSwapLanguages}
          aria-label="Swap languages"
          title="Swap languages"
          className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          ⇄
        </button>
        <LanguageSelector
          selected={targetLang}
          onChange={setTargetLang}
          languages={languages}
          darkMode={darkMode}
        />
      </div>

      <textarea
        className="w-full border rounded p-3 mb-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors"
        rows={5}
        placeholder="Enter text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      {detecting && (
        <div className="text-sm text-gray-500 mb-2">Detecting language...</div>
      )}

      <LiveTranslation
        text={text}
        sourceLang={sourceLang}
        targetLang={targetLang}
        onTranslate={setTranslatedText}
      />

      <button
        onClick={() => speakText(text, sourceLang)}
        disabled={!text.trim()}
        className="mb-4 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
      >
         Speak Original
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-200 text-red-800 rounded">{error}</div>
      )}

      {translatedText && (
        <div className="mt-6 p-4 border rounded bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors">
          <h2 className="font-semibold mb-2">Translation</h2>
          <p className="whitespace-pre-wrap">{translatedText}</p>

          <div className="flex flex-wrap gap-3 mt-4">
            <button
              onClick={copyToClipboard}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              {copied ? "Copied!" : "Copy to Clipboard"}
            </button>

            <button
              onClick={() => speakText(translatedText, targetLang)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
               Speak Translation
            </button>

            <button
              onClick={() => generatePDF(text, translatedText)}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
            >
              Download PDF
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
