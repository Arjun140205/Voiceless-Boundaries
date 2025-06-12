"use client";

import React, { useEffect } from "react";
import { getDocument, GlobalWorkerOptions, version } from 'pdfjs-dist';

interface Props {
  onTextExtracted: (text: string) => void;
  darkMode: boolean;
}

export default function FileUploader({ onTextExtracted, darkMode }: Props) {
  useEffect(() => {
    // Configure PDF.js worker
    GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.js`;
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const extension = file.name.split(".").pop()?.toLowerCase();
    if (extension === "txt") {
      const reader = new FileReader();
      reader.onload = () => {
        onTextExtracted(reader.result as string);
      };
      reader.readAsText(file);
    } else if (extension === "pdf") {
      try {
        const typedFile = new Uint8Array(await file.arrayBuffer());
        const pdf = await getDocument({ data: typedFile }).promise;
        let fullText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const strings = content.items.map((item: any) => item.str);
          fullText += strings.join(" ") + "\n";
        }

        onTextExtracted(fullText.trim());
      } catch (error) {
        console.error('Error processing PDF:', error);
        alert('Error processing PDF file. Please try again.');
      }
    } else {
      alert("Only .txt and .pdf files are supported.");
    }
  };

  return (
    <div className="mb-4">
      <label
        className={`block mb-2 font-medium ${
          darkMode ? "text-gray-300" : "text-gray-700"
        }`}
      >
        Upload Text or PDF File
      </label>
      <input
        type="file"
        accept=".txt,.pdf"
        onChange={handleFileUpload}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
      />
    </div>
  );
}
