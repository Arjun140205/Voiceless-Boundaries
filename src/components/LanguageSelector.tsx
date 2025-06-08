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
  return (
    <select
      value={selected}
      onChange={(e) => onChange(e.target.value)}
      className={`px-3 py-2 rounded border text-sm transition-colors
        ${darkMode ? "bg-gray-800 text-white border-gray-600" : "bg-white text-black border-gray-300"}
      `}
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.name}
        </option>
      ))}
    </select>
  );
};

export default LanguageSelector;