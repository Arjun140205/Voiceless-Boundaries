"use client";

import React, { useState } from "react";
import dynamic from 'next/dynamic';

interface Props {
  onTextExtracted: (text: string) => void;
  darkMode: boolean;
}

// Initialize PDF.js in a way that works with Next.js
const initPdfJs = async () => {
  const pdfjs = await import('pdfjs-dist');
  // Use the minified worker from CDN
  const workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
  pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
  return pdfjs;
};

export default function FileUploader({ onTextExtracted, darkMode }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePdfFile = async (file: File) => {
    try {
      const pdfjs = await initPdfJs();
      
      // Convert file to array buffer
      const buffer = await file.arrayBuffer();
      // Load the PDF file
      const pdf = await pdfjs.getDocument(new Uint8Array(buffer)).promise;
      let fullText = "";

      // Extract text from each page
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(" ");
        fullText += pageText + "\n\n";
      }

      return fullText.trim();
    } catch (error) {
      console.error('Error processing PDF:', error);
      throw new Error('Failed to process PDF file');
    }
  };

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const extension = file.name.split(".").pop()?.toLowerCase();
      
      if (extension === "txt") {
        const text = await file.text();
        onTextExtracted(text);
      } else if (extension === "pdf") {
        const text = await handlePdfFile(file);
        onTextExtracted(text);
      } else if (extension === "docx") {
        const mammoth = (await import('mammoth')).default;
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        onTextExtracted(result.value);
      } else {
        throw new Error("Unsupported file type");
      }
    } catch (error) {
      console.error('Error processing file:', error);
      alert(error instanceof Error ? error.message : 'Error processing file. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <div 
      className={`mb-4 relative rounded-2xl overflow-hidden ${
        isDragging ? 'ring-2 ring-[var(--raspberry-rose)]' : ''
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div className={`
        ${darkMode ? 'glass-morphism-dark' : 'glass-morphism'}
        rounded-xl p-8 transition-all duration-300
        ${isDragging 
          ? 'border-[var(--raspberry-rose)] bg-[var(--raspberry-rose)]/5' 
          : darkMode 
            ? 'border-[var(--muted-mauve)]/20' 
            : 'border-[var(--dusty-rose)]/20'
        }
      `}>
        <label className={`block text-center ${
          darkMode ? 'text-[var(--pastel-pink)]' : 'text-[var(--soft-burgundy)]'
        }`}>
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <svg 
                className={`w-12 h-12 ${
                  darkMode ? 'text-[var(--muted-mauve)]' : 'text-[var(--dusty-rose)]'
                }`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="1.5" 
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                />
              </svg>
            </div>
            <div className="text-base font-medium">
              Drag & drop files here or{' '}
              <span className={`
                ${darkMode ? 'glass-button-dark' : 'glass-button'}
                inline-block px-3 py-1 rounded-full cursor-pointer
                text-[var(--raspberry-rose)] hover:text-[var(--soft-burgundy)]
              `}>
                browse
              </span>
            </div>
            <div className={`text-sm ${
              darkMode ? 'text-[var(--muted-mauve)]/70' : 'text-[var(--dusty-rose)]/70'
            }`}>
              Supports .txt, .pdf, and .docx files
            </div>
          </div>
          <input
            type="file"
            accept=".txt,.pdf,.docx"
            onChange={(e) => handleFile(e.target.files?.[0])}
            className="hidden"
          />
        </label>
      </div>
      
      {isProcessing && (
        <div className="absolute inset-0 backdrop-blur-sm bg-black/30 rounded-xl flex items-center justify-center">
          <div className={`
            ${darkMode ? 'glass-morphism-dark' : 'glass-morphism'}
            text-[var(--raspberry-rose)] px-6 py-4 rounded-lg flex items-center space-x-3
          `}>
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-current"></div>
            <span className="font-medium">Processing file...</span>
          </div>
        </div>
      )}
    </div>
  );
}
