"use client";

import React, { useEffect, useState } from "react";
import { translateText } from "../utils/translateApi";

interface LiveTranslationProps {
  text: string;
  sourceLang: string;
  targetLang: string;
  onTranslate: (translated: string) => void;
}

const LiveTranslation: React.FC<LiveTranslationProps> = ({
  text,
  sourceLang,
  targetLang,
  onTranslate,
}) => {
  const [debouncedText, setDebouncedText] = useState(text);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedText(text);
    }, 500); // Debounce to reduce API calls

    return () => clearTimeout(handler);
  }, [text]);

  useEffect(() => {
    const autoTranslate = async () => {
      if (debouncedText.trim().length < 1) return;
      try {
        const translated = await translateText(debouncedText, sourceLang, targetLang);
        onTranslate(translated);
      } catch (err) {
        onTranslate("Live translation failed.");
      }
    };

    autoTranslate();
  }, [debouncedText, sourceLang, targetLang, onTranslate]);

  return null;
};

export default LiveTranslation;
