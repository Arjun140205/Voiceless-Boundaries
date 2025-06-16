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
    };
    return flagEmojis[code] || "🌐";
  };

  return (
    <select
      value={selected}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-4 py-2.5 text-base rounded-lg border appearance-none
        cursor-pointer bg-no-repeat bg-right
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
        transition-all duration-200 ease-in-out
        ${
          darkMode
            ? "bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
            : "bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
        }
        bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0iY3VycmVudENvbG9yIj48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik01LjIzIDcuMjFhLjc1Ljc1IDAgMDExLjA2LjAybDQuMjUgNC41YS43NS43NSAwIDAxMCAxLjA0bC00LjI1IDQuNWEuNzUuNzUgMCAwMS0xLjA4LTEuMDRMOC41NCAxMmwtMy4zMS0zLjUxYS43NS43NSAwIDAxLjAyLTEuMDZ6IiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIC8+PC9zdmc+')]
      `}
    >
      {languages.map((lang) => (
        <option
          key={lang.code}
          value={lang.code}
          className={`flex items-center gap-2 py-2 px-4 ${
            selected === lang.code ? "bg-blue-50 dark:bg-blue-900" : ""
          }`}
        >
          {getLanguageFlag(lang.code)} {lang.name}
        </option>
      ))}
    </select>
  );
};

export default LanguageSelector;