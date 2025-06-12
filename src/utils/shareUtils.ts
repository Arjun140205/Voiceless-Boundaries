export function generateShareableLink(text: string, sourceLang: string, targetLang: string): string {
  const baseUrl = window.location.origin;
  const params = new URLSearchParams({
    text: text,
    from: sourceLang,
    to: targetLang
  });
  return `${baseUrl}/?${params.toString()}`;
}

export function getTranslationParamsFromURL(): { text: string | null; from: string | null; to: string | null } {
  if (typeof window === 'undefined') return { text: null, from: null, to: null };
  
  const params = new URLSearchParams(window.location.search);
  return {
    text: params.get('text'),
    from: params.get('from'),
    to: params.get('to')
  };
}
