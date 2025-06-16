"use client";

import React, { useState } from "react";
import LanguageSelector from "../components/LanguageSelector";
import FileUploader from "../components/FileUploader";
import ImageUploader from "../components/ImageUploader";
import { translateText } from "../utils/translateApi";

const languages = [
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi" },
  { code: "fr", name: "French" },
  { code: "es", name: "Spanish" },
  { code: "de", name: "German" },
  { code: "ar", name: "Arabic" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "zh", name: "Chinese" },
  { code: "ru", name: "Russian" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "tr", name: "Turkish" },
  { code: "vi", name: "Vietnamese" },
  { code: "th", name: "Thai" },
];

export default function Translator() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("hi");
  const [isLoading, setIsLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setInputText(text);
    setCharCount(text.length);
  };

  const handleFileText = (text: string) => {
    setInputText(text);
    setCharCount(text.length);
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      setOutputText("Please enter text to translate.");
      return;
    }

    setIsLoading(true);
    try {
      const translated = await translateText(inputText, sourceLang, targetLang);
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
    if (inputText && outputText) {
      setInputText(outputText);
      setOutputText(inputText);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const clearText = () => {
    setInputText("");
    setOutputText("");
    setCharCount(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-8">
          Universal Translator
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Source Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl">
            <div className="mb-4">
              <LanguageSelector
                selected={sourceLang}
                onChange={setSourceLang}
                languages={languages}
              />
            </div>

            {/* File and Image Uploaders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="w-full">
                <FileUploader
                  onTextExtracted={handleFileText}
                  darkMode={false}
                />
              </div>
              <div className="w-full">
                <ImageUploader
                  onTextExtracted={handleFileText}
                  darkMode={false}
                />
              </div>
            </div>

            <div className="relative">
              <textarea
                className="w-full h-48 p-4 border border-gray-200 dark:border-gray-600 rounded-lg
                  focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                  placeholder-gray-400 dark:placeholder-gray-500 resize-none
                  transition duration-200 ease-in-out"
                placeholder="Enter text to translate, upload a file, or upload an image..."
                value={inputText}
                onChange={handleInputChange}
              />
              <div className="absolute bottom-2 right-2 flex items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {charCount} characters
                </span>
                <button
                  onClick={() => copyToClipboard(inputText)}
                  className="p-2 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
                  title="Copy to clipboard"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
                <button
                  onClick={clearText}
                  className="p-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                  title="Clear text"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Target Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl">
            <div className="mb-4 flex items-center gap-4">
              <button
                onClick={swapLanguages}
                className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 
                  transition-colors duration-200"
                aria-label="Swap languages"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
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
            <div className="relative h-[calc(100%-3.5rem)]">
              <div className="w-full h-full p-4 border border-gray-200 dark:border-gray-600 rounded-lg
                bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                overflow-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <div className="h-full relative">
                    {outputText || "Translation will appear here..."}
                    {outputText && (
                      <button
                        onClick={() => copyToClipboard(outputText)}
                        className="absolute bottom-2 right-2 p-2 text-gray-500 hover:text-blue-500 
                          dark:text-gray-400 dark:hover:text-blue-400"
                        title="Copy translation"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Translate Button */}
        <div className="flex justify-center mt-8">
          <button
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700
              text-white font-medium rounded-lg shadow-lg
              transform transition duration-200 ease-in-out hover:scale-105 hover:shadow-xl
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleTranslate}
            disabled={isLoading || !inputText.trim()}
          >
            {isLoading ? 'Translating...' : 'Translate'}
          </button>
        </div>
      </div>
    </div>
  );
}