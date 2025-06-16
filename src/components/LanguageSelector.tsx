"use client";

import React from "react";

type LanguageSelectorProps = {
  selected: string;
  onChange: (lang: string) => void;
  languages: { code: string; name: string }[];
  darkMode?: boolean;
};

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selected,
  onChange,
  languages,
  darkMode = false,
}) => {
  // Function to get flag emoji for language
  const getLanguageFlag = (code: string) => {
    const flagEmojis: { [key: string]: string } = {
      en: "🇬🇧",
      hi: "🇮🇳",
      fr: "🇫🇷",
      es: "🇪🇸",
      de: "🇩🇪",
      ar: "🇸🇦",
      ja: "🇯🇵",
      ko: "🇰🇷",
      zh: "🇨🇳",
      ru: "🇷🇺",
      it: "🇮🇹",
      pt: "🇵🇹",
      tr: "🇹🇷",
      vi: "🇻🇳",
      th: "🇹🇭",
    };
    return flagEmojis[code] || "🌐";
  };

  return (
    <div className="relative">
      <select
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-3 text-base rounded-xl border appearance-none
          cursor-pointer bg-no-repeat bg-[center_right_1rem]
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          transition-all duration-200 ease-in-out
          ${
            darkMode
              ? "bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
              : "bg-gray-50 text-gray-900 border-gray-200 hover:bg-gray-100"
          }
          bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNCA2TDggMTBMMTIgNiIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+')]
          pr-12
        `}
      >
        {languages.map((lang) => (
          <option
            key={lang.code}
            value={lang.code}
            className={`flex items-center gap-2 py-2 px-4 ${
              selected === lang.code
                ? "bg-blue-50 dark:bg-blue-900"
                : ""
            }`}
          >
            {`${getLanguageFlag(lang.code)} ${lang.name}`}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <div className="text-xl">{getLanguageFlag(selected)}</div>
      </div>
    </div>
  );
};

export default LanguageSelector;