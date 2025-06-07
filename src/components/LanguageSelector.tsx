"use client";

import React from "react";

type Props = {
  selected: string;
  onChange: (value: string) => void;
  languages: { code: string; name: string }[];
  darkMode?: boolean; // add this line
};

export default function LanguageSelector({
  selected,
  onChange,
  languages,
  darkMode = false,
}: Props) {
  return (
    <select
      value={selected}
      onChange={(e) => onChange(e.target.value)}
      className={`border rounded p-2 ${
        darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      {languages.map(({ code, name }) => (
        <option key={code} value={code}>
          {name}
        </option>
      ))}
    </select>
  );
}
