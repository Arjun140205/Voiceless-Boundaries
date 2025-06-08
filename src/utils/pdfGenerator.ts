import jsPDF from "jspdf";

export const generatePDF = (originalText: string, translatedText: string) => {
  const doc = new jsPDF();

  doc.setFontSize(14);
  doc.text("Voiceless Boundaries - Translation Report", 20, 20);

  doc.setFontSize(12);
  doc.text("Original Text:", 20, 40);
  doc.setFont("courier", "normal");
  doc.text(originalText || "None", 20, 50, { maxWidth: 170 });

  doc.setFont("helvetica", "normal");
  doc.text("Translated Text:", 20, 80);
  doc.setFont("courier", "normal");
  doc.text(translatedText || "None", 20, 90, { maxWidth: 170 });

  doc.save("translation.pdf");
};
