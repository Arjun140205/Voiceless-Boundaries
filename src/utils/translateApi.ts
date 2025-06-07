export async function translateText(text: string, sourceLang: string, targetLang: string) {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    return data?.responseData?.translatedText || "Translation failed.";
  } catch (error) {
    console.error("Translation API error:", error);
    return "Error while translating.";
  }
}
