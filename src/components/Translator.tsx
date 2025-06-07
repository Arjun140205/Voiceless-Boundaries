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

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      setOutputText("Please enter text to translate.");
      return;
    }

    const translated = await translateText(inputText, sourceLang, targetLang);
    console.log("🔠 Translated text received:", translated);
    setOutputText(translated || "No translation found.");
  };

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-4">
      {/* Language selectors */}
      <div className="flex gap-4">
        <LanguageSelector
          selected={sourceLang}
          onChange={setSourceLang}
          languages={languages}
        />
        <LanguageSelector
          selected={targetLang}
          onChange={setTargetLang}
          languages={languages}
        />
      </div>

      {/* Input text area */}
      <textarea
        className="w-full border p-2 rounded"
        rows={4}
        placeholder="Enter text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />

      {/* Translate button */}
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        onClick={handleTranslate}
      >
        Translate
      </button>

      {/* Output display (as <div> for better visibility) */}
      <div className="w-full border p-4 rounded bg-gray-100 min-h-[100px] whitespace-pre-wrap">
        {outputText || "Translation will appear here..."}
      </div>
    </div>
  );
}