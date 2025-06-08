"use client";

import React from "react";

interface TranslationItem {
  text: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
}

interface Props {
  items: TranslationItem[];
  onSelect: (item: TranslationItem) => void;
  darkMode: boolean;
}

export default function RecentTranslations({ items, onSelect, darkMode }: Props) {
  if (items.length === 0) return null;

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">Recent Translations</h3>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li
            key={index}
            onClick={() => onSelect(item)}
            className={`p-3 rounded border cursor-pointer transition ${
              darkMode
                ? "bg-gray-800 hover:bg-gray-700"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            <div className="text-sm text-gray-500">
              {item.sourceLang} → {item.targetLang}
            </div>
            <div className="font-medium">{item.text}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {item.translatedText}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
