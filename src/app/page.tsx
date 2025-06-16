"use client";

import React, { useState, useEffect } from "react";
import LanguageSelector from "../components/LanguageSelector";
import { translateText } from "../utils/translateApi";
import { detectLanguage } from "../utils/languageDetect";
import LiveTranslation from "../components/LiveTranslation";
import { generatePDF } from "../utils/pdfGenerator";
import AnimatedBackground from "../components/AnimatedBackground";
import ImageUploader from "../components/ImageUploader";
import FileUploader from "../components/FileUploader";
import { generateShareableLink, getTranslationParamsFromURL } from "../utils/shareUtils";

const languages = [
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "zh", name: "Chinese (Simplified)" },
  { code: "pt", name: "Portuguese" },
  { code: "it", name: "Italian" },
  { code: "ar", name: "Arabic" },
  { code: "ru", name: "Russian" },
  { code: "nl", name: "Dutch" },
  { code: "sv", name: "Swedish" },
  { code: "he", name: "Hebrew" },
  { code: "pl", name: "Polish" },
  { code: "tr", name: "Turkish" },
  { code: "vi", name: "Vietnamese" },
  { code: "th", name: "Thai" },
  { code: "id", name: "Indonesian" },
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
  const [shareUrl, setShareUrl] = useState<string>("");
  const [showShareToast, setShowShareToast] = useState(false);

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

  useEffect(() => {
    // Check for translation parameters in URL
    const params = getTranslationParamsFromURL();
    if (params.text) {
      setText(params.text);
      if (params.from) setSourceLang(params.from);
      if (params.to) setTargetLang(params.to);
    }
  }, []);

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

  const handleShare = () => {
    if (!text || !translatedText) return;
    
    const link = generateShareableLink(text, sourceLang, targetLang);
    setShareUrl(link);
    
    // Copy to clipboard
    navigator.clipboard.writeText(link).then(() => {
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 3000);
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
    <AnimatedBackground darkMode={darkMode}>
      <div className="relative min-h-screen">
        {/* Header Section */}
        <div className={`sticky top-0 z-50 w-full backdrop-blur-sm bg-white/30 dark:bg-gray-900/30 shadow-lg`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent hover:from-purple-400 hover:to-blue-600 transition-all duration-500">
                  Voiceless Boundaries
                </h1>
              </div>
              <button
                onClick={toggleDarkMode}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-purple-500/30 hover:to-blue-500/30 text-gray-800 dark:text-gray-200 transition-all duration-300 shadow-sm hover:shadow-md border border-gray-200/20 backdrop-blur-sm"
              >
                {darkMode ? "Light Mode" : "Dark Mode"}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Section */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {/* Language Selection Bar */}
          <div className="p-4 rounded-xl shadow-lg backdrop-blur-sm bg-white/30 dark:bg-gray-900/30 transition-all duration-300">
            <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
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
                className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 text-white transition-all duration-300 transform hover:scale-110 shadow-md hover:shadow-xl"
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
          </div>

          {/* Upload Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl backdrop-blur-sm bg-white/30 dark:bg-gray-900/30 transition-all duration-300 hover:shadow-xl">
              <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Image Upload
              </h3>
              <ImageUploader onTextExtracted={setText} darkMode={darkMode} />
            </div>
            <div className="p-6 rounded-xl backdrop-blur-sm bg-white/30 dark:bg-gray-900/30 transition-all duration-300 hover:shadow-xl">
              <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                Document Upload
              </h3>
              <FileUploader onTextExtracted={setText} darkMode={darkMode} />
            </div>
          </div>

          {/* Translation Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <textarea
                className={`w-full border rounded-xl p-4 ${
                  darkMode ? 'glass-dark' : 'glass'
                } text-gray-900 dark:text-gray-100 enhanced-input h-64`}
                placeholder="Enter text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              {detecting && (
                <div className="text-sm text-gray-500 animate-pulse">
                  Detecting language...
                </div>
              )}
              <button
                onClick={() => speakText(text, sourceLang)}
                disabled={!text.trim()}
                className={`w-full enhanced-button ${
                  !text.trim()
                    ? 'opacity-50 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-emerald-500 hover:to-green-500'
                } text-white px-4 py-3 rounded-lg`}
              >
                🔊 Speak Original
              </button>
            </div>

            <div className="space-y-4">
              <LiveTranslation
                text={text}
                sourceLang={sourceLang}
                targetLang={targetLang}
                onTranslate={setTranslatedText}
              />

              {error && (
                <div className="p-4 bg-red-100/80 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-xl backdrop-blur-sm">
                  {error}
                </div>
              )}

              {translatedText && (
                <div className={`p-6 rounded-xl ${darkMode ? 'glass-dark' : 'glass'} transition-all duration-300`}>
                  <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Translation
                  </h2>
                  <p className="whitespace-pre-wrap mb-6">{translatedText}</p>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={copyToClipboard}
                      className="flex-1 enhanced-button bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white px-4 py-3 rounded-lg"
                    >
                      {copied ? "✓ Copied!" : "📋 Copy to Clipboard"}
                    </button>

                    <button
                      onClick={() => speakText(translatedText, targetLang)}
                      className="flex-1 enhanced-button bg-gradient-to-r from-green-500 to-emerald-500 hover:from-emerald-500 hover:to-green-500 text-white px-4 py-3 rounded-lg"
                    >
                      🔊 Speak Translation
                    </button>

                    <button
                      onClick={() => generatePDF(text, translatedText)}
                      className="flex-1 enhanced-button bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white px-4 py-3 rounded-lg"
                    >
                      📥 Download PDF
                    </button>

                    <button
                      onClick={handleShare}
                      className="flex-1 enhanced-button bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white px-4 py-3 rounded-lg"
                    >
                      🔗 Share Translation
                    </button>
                  </div>

                  {/* Share Toast Notification */}
                  {showShareToast && (
                    <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in-up">
                      ✓ Share link copied to clipboard!
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AnimatedBackground>
  );
}
