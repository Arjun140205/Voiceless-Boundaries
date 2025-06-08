"use client";

import React, { useState } from "react";
import Tesseract from "tesseract.js";

interface Props {
  onTextExtracted: (text: string) => void;
  darkMode: boolean;
}

export default function ImageUploader({ onTextExtracted, darkMode }: Props) {
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setProgress(0);

    Tesseract.recognize(file, "eng", {
      logger: (m) => {
        if (m.status === "recognizing text") {
          setProgress(Math.round(m.progress * 100));
        }
      },
    })
      .then(({ data: { text } }) => {
        onTextExtracted(text);
      })
      .catch((err) => {
        alert("OCR failed. Try a clearer image.");
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
        setProgress(0);
      });
  };

  return (
    <div className="mb-4">
      <label
        className={`block mb-2 font-medium ${
          darkMode ? "text-gray-300" : "text-gray-700"
        }`}
      >
        Upload Image for OCR
      </label>
      <input
        type="file"
        accept="image/png, image/jpeg"
        onChange={handleImageUpload}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200"
      />
      {loading && (
        <div className="mt-2 text-sm">
          OCR Progress: {progress}% — Recognizing text...
        </div>
      )}
    </div>
  );
}
