// utils/getVoiceByLang.ts

export function getVoiceByLang(lang: string): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();

  // Try to match exact language first
  let voice = voices.find((v) => v.lang.toLowerCase() === lang.toLowerCase());

  // Fallback to any voice that includes the language code
  if (!voice) {
    voice = voices.find((v) => v.lang.toLowerCase().includes(lang.toLowerCase()));
  }

  // If Hindi not found, fallback to English
  if (!voice && lang === "hi") {
    voice = voices.find((v) => v.lang.toLowerCase().includes("en"));
  }

  return voice || null;
}
