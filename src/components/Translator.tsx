"use client";

import React, { useState } from "react";
import LanguageSelector from "../components/LanguageSelector";
import FileUploader from "../components/FileUploader";
import ImageUploader from "../components/ImageUploader";
import AnimatedBackground from "../components/AnimatedBackground";
import { Button } from "../components/ui/button";
import { translateText } from "../utils/translateApi";

const languages = [
	{ code: "en", name: "English" },
	{ code: "hi", name: "Hindi" },
	{ code: "fr", name: "French" },
	{ code: "es", name: "Spanish" },
	{ code: "de", name: "German" },
	{ code: "ar", name: "Arabic" },
	{ code: "ja", name: "Japanese" },
	{ code: "ko", name: "Korean" },
	{ code: "zh", name: "Chinese" },
	{ code: "ru", name: "Russian" },
	{ code: "it", name: "Italian" },
	{ code: "pt", name: "Portuguese" },
	{ code: "tr", name: "Turkish" },
	{ code: "vi", name: "Vietnamese" },
	{ code: "th", name: "Thai" },
];

export default function Translator() {
	const [inputText, setInputText] = useState("");
	const [outputText, setOutputText] = useState("");
	const [sourceLang, setSourceLang] = useState("en");
	const [targetLang, setTargetLang] = useState("hi");
	const [isLoading, setIsLoading] = useState(false);
	const [charCount, setCharCount] = useState(0);

	const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const text = e.target.value;
		setInputText(text);
		setCharCount(text.length);
	};

	const handleFileText = (text: string) => {
		setInputText(text);
		setCharCount(text.length);
	};

	const handleTranslate = async () => {
		if (!inputText.trim()) {
			setOutputText("Please enter text to translate.");
			return;
		}

		setIsLoading(true);
		try {
			const translated = await translateText(inputText, sourceLang, targetLang);
			setOutputText(translated || "No translation found.");
		} catch (error) {
			setOutputText("An error occurred during translation.");
		} finally {
			setIsLoading(false);
		}
	};

	const swapLanguages = () => {
		const temp = sourceLang;
		setSourceLang(targetLang);
		setTargetLang(temp);
		if (inputText && outputText) {
			setInputText(outputText);
			setOutputText(inputText);
		}
	};

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text);
	};

	const clearText = () => {
		setInputText("");
		setOutputText("");
		setCharCount(0);
	};

	return (
		<AnimatedBackground>
			<div className="min-h-screen relative backdrop-blur-sm bg-black/5 p-6">
				<div className="max-w-7xl mx-auto">
					{/* Logo placeholder - add your logo image here */}
					<div className="flex justify-center mb-8">
						<div className="w-48 h-16 relative">
							{/* Replace this with your actual logo */}
							<div className="absolute inset-0 bg-gradient-to-r from-[#37ffd3] to-[#acff7] opacity-20 blur-xl rounded-full" />
							<div className="relative h-full flex items-center justify-center">
								{/* Add your logo here using next/image */}
								{/* <Image src="/logo.png" alt="Voiceless Boundaries" fill style={{objectFit: 'contain'}} /> */}
							</div>
						</div>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
						{/* Source Section */}
						<div className="backdrop-blur-md bg-white/20 dark:bg-black/20 rounded-xl shadow-lg p-6 
              transform transition-all duration-300 hover:shadow-xl border border-[#37ffd3]/20
              hover:bg-white/30 dark:hover:bg-black/30">
							<div className="mb-4">
								<LanguageSelector
									selected={sourceLang}
									onChange={setSourceLang}
									languages={languages}
								/>
							</div>

							{/* File and Image Uploaders */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
								<div className="w-full">
									<FileUploader
										onTextExtracted={handleFileText}
										darkMode={false}
									/>
								</div>
								<div className="w-full">
									<ImageUploader
										onTextExtracted={handleFileText}
										darkMode={false}
									/>
								</div>
							</div>

							<div className="relative group">
								<textarea
									className="w-full h-48 p-4 rounded-lg
                    bg-white/30 dark:bg-black/30 text-gray-900 dark:text-white
                    placeholder-gray-500 dark:placeholder-gray-400 resize-none
                    backdrop-blur-sm border border-[#37ffd3]/20
                    focus:ring-2 focus:ring-[#37ffd3] focus:border-transparent
                    transition-all duration-200 ease-in-out
                    group-hover:bg-white/40 dark:group-hover:bg-black/40"
									placeholder="Enter text to translate, upload a file, or upload an image..."
									value={inputText}
									onChange={handleInputChange}
								/>
								<div className="absolute bottom-2 right-2 flex items-center gap-2">
									<span className="text-sm text-gray-600 dark:text-gray-300">
										{charCount} characters
									</span>
									<Button
										variant="ghost"
										size="icon"
										onClick={() => copyToClipboard(inputText)}
										className="text-gray-600 hover:text-[#37ffd3] dark:text-gray-300"
										title="Copy to clipboard"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
											/>
										</svg>
									</Button>
									<Button
										variant="ghost"
										size="icon"
										onClick={clearText}
										className="text-gray-600 hover:text-red-500 dark:text-gray-300"
										title="Clear text"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
											/>
										</svg>
									</Button>
								</div>
							</div>
						</div>

						{/* Target Section */}
						<div className="backdrop-blur-md bg-white/20 dark:bg-black/20 rounded-xl shadow-lg p-6 
              transform transition-all duration-300 hover:shadow-xl border border-[#37ffd3]/20
              hover:bg-white/30 dark:hover:bg-black/30">
							<div className="mb-4 flex items-center gap-4">
								<Button
									onClick={swapLanguages}
									variant="outline"
									size="icon"
									className="rounded-full hover:scale-110 transition-transform duration-200
                    border-[#37ffd3]/20 hover:border-[#37ffd3]/40 hover:bg-[#37ffd3]/10"
									aria-label="Swap languages"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-6 w-6"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
										/>
									</svg>
								</Button>
								<div className="flex-1">
									<LanguageSelector
										selected={targetLang}
										onChange={setTargetLang}
										languages={languages}
									/>
								</div>
							</div>
							<div className="relative h-[calc(100%-3.5rem)]">
								<div className="w-full h-full p-4 rounded-lg
                  bg-white/30 dark:bg-black/30 text-gray-900 dark:text-white
                  backdrop-blur-sm border border-[#37ffd3]/20
                  transition-all duration-200 ease-in-out
                  hover:bg-white/40 dark:hover:bg-black/40
                  overflow-auto">
									{isLoading ? (
										<div className="flex items-center justify-center h-full">
											<div className="relative w-16 h-16">
												<div className="absolute inset-0 rounded-full border-t-2 border-b-2 border-[#37ffd3] animate-spin"></div>
												<div className="absolute inset-2 rounded-full border-r-2 border-l-2 border-[#acff7] animate-spin animation-delay-150"></div>
												<div className="absolute inset-4 rounded-full border-t-2 border-b-2 border-[#37ffd3] animate-spin animation-delay-300"></div>
											</div>
										</div>
									) : (
										<div className="h-full relative">
											{outputText || "Translation will appear here..."}
											{outputText && (
												<Button
													variant="ghost"
													size="icon"
													onClick={() => copyToClipboard(outputText)}
													className="absolute bottom-2 right-2 text-gray-600 hover:text-[#37ffd3] dark:text-gray-300"
													title="Copy translation"
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="h-5 w-5"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
														/>
													</svg>
												</Button>
											)}
										</div>
									)}
								</div>
							</div>
						</div>
					</div>

					{/* Translate Button */}
					<div className="flex justify-center mt-8">
						<Button
							onClick={handleTranslate}
							disabled={isLoading || !inputText.trim()}
							className="px-8 py-6 text-lg font-semibold hover:scale-105
                bg-gradient-to-r from-[#37ffd3] to-[#acff7]
                text-black hover:text-black/80
                shadow-[0_0_20px_rgba(55,255,211,0.3)]
                hover:shadow-[0_0_30px_rgba(55,255,211,0.5)]
                backdrop-blur-sm transition-all duration-300"
						>
							{isLoading ? "Translating..." : "Translate"}
						</Button>
					</div>
				</div>
			</div>
		</AnimatedBackground>
	);
}