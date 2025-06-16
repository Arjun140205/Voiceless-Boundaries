"use client";

import React, { useState } from "react";
import LanguageSelector from "../components/LanguageSelector";
import { translateText } from "../utils/translateApi";

const languages = [
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi" },
  { code: "fr", name: "French" },
  { code: "es", name: "Spanish" },
  { code: "de", name: "German" },
];

export default function Translator() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("hi");
  const [isLoading, setIsLoading] = useState(false);

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      setOutputText("Please enter text to translate.");
      return;
    }

    setIsLoading(true);
    try {
      const translated = await translateText(inputText, sourceLang, targetLang);
      console.log("🔠 Translated text received:", translated);
      setOutputText(translated || "No translation found.");
    } catch (error) {
      setOutputText("An error occurred during translation.");
    } finally {
      setIsLoading(false);
    }
  };

  const swapLanguages = () => {
    const temp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(temp);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto space-y-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">
          Universal Translator
        </h1>

        {/* Language selectors with swap button */}
        <div className="flex items-center justify-center gap-4">
          <div className="flex-1">
            <LanguageSelector
              selected={sourceLang}
              onChange={setSourceLang}
              languages={languages}
            />
          </div>
          <button
            onClick={swapLanguages}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Swap languages"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-600 dark:text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
          </button>
          <div className="flex-1">
            <LanguageSelector
              selected={targetLang}
              onChange={setTargetLang}
              languages={languages}
            />
          </div>
        </div>

        {/* Translation areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Source Text
            </label>
            <textarea
              className="w-full h-40 p-4 border border-gray-300 dark:border-gray-600 rounded-lg
                focus:ring-2 focus:ring-blue-500 focus:border-transparent
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                placeholder-gray-400 dark:placeholder-gray-500
                transition duration-200 ease-in-out"
              placeholder="Enter text to translate..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Translation
            </label>
            <div className="relative h-40">
              <div
                className={`w-full h-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg
                bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                overflow-auto transition duration-200 ease-in-out`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  outputText || "Translation will appear here..."
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Translate button */}
        <div className="flex justify-center mt-6">
          <button
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg
              transform transition duration-200 ease-in-out hover:scale-105
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleTranslate}
            disabled={isLoading || !inputText.trim()}
          >
            {isLoading ? "Translating..." : "Translate"}
          </button>
        </div>
      </div>
    </div>
  );
}