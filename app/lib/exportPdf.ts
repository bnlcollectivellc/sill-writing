import { jsPDF } from 'jspdf';
import { Category } from './prompts';

interface ExportData {
  category: Category;
  prompt: string;
  text: string;
}

export function exportToPdf({ category, prompt, text }: ExportData): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let yPosition = margin;

  // Set font
  doc.setFont('helvetica');

  // Category title
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(category, margin, yPosition);
  yPosition += 10;

  // Prompt (italic style using normal + gray color)
  doc.setFontSize(12);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 100, 100);
  const promptLines = doc.splitTextToSize(prompt, contentWidth);
  doc.text(promptLines, margin, yPosition);
  yPosition += promptLines.length * 6 + 10;

  // Divider line
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  // User's writing
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);

  const textLines = doc.splitTextToSize(text || '(No writing captured)', contentWidth);
  const lineHeight = 6;
  const pageHeight = doc.internal.pageSize.getHeight();
  const bottomMargin = 30;

  for (let i = 0; i < textLines.length; i++) {
    if (yPosition > pageHeight - bottomMargin) {
      doc.addPage();
      yPosition = margin;
    }
    doc.text(textLines[i], margin, yPosition);
    yPosition += lineHeight;
  }

  // Footer
  const now = new Date();
  const date = now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);

  // Date at bottom left
  doc.text(date, margin, pageHeight - 15);

  // SillWriting branding at bottom right
  const brandText = 'SillWriting';
  const brandWidth = doc.getTextWidth(brandText);
  doc.text(brandText, pageWidth - margin - brandWidth, pageHeight - 15);

  // Generate filename: sillwriting-category-dd.mm.yy-hh.mm.pdf
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = String(now.getFullYear()).slice(-2);
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  const filename = `sillwriting-${category.toLowerCase()}-${day}.${month}.${year}-${hours}.${minutes}.pdf`;
  doc.save(filename);
}
