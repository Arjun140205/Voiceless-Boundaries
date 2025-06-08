// utils/languageDetect.ts

export async function detectLanguage(text: string): Promise<string | null> {
  const url = "https://libretranslate.de/detect";

  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ q: text }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (data && Array.isArray(data) && data.length > 0) {
      return data[0].language;
    }
    return null;
  } catch (error) {
    console.error("Language detection failed:", error);
    return null;
  }
}
