import type { PDFDocumentProxy, TextContent } from 'pdfjs-dist/types/src/display/api';

type PdfjsLib = typeof import('pdfjs-dist');
let pdfjsLib: PdfjsLib | null = null;

async function getPdfJs(): Promise<PdfjsLib> {
  if (pdfjsLib) return pdfjsLib;
  pdfjsLib = await import('pdfjs-dist');
  const version = pdfjsLib.version;
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.js`;
  return pdfjsLib;
}

export async function parsePdf(
  input: File | ArrayBuffer,
  onProgress?: (progress: number) => void
): Promise<{ title: string; text: string }> {
  const pdfjs = await getPdfJs();
  const data = input instanceof File ? await input.arrayBuffer() : input;
  const loadingTask = pdfjs.getDocument({ data });
  const pdf: PDFDocumentProxy = await loadingTask.promise;

  let title = 'Untitled';
  try {
    const metadata = await pdf.getMetadata();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfTitle = (metadata?.info as any)?.Title;
    if (pdfTitle && typeof pdfTitle === 'string') {
      title = pdfTitle;
    }
  } catch {
    // Metadata extraction can fail on some PDFs
  }

  const totalPages = pdf.numPages;
  const textParts: string[] = [];

  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent: TextContent = await page.getTextContent();
    const pageText = extractPageText(textContent);
    if (pageText.trim()) textParts.push(pageText);
    if (onProgress) onProgress(Math.round((pageNum / totalPages) * 100));
  }

  return { title, text: textParts.join('\n\n') };
}

function extractPageText(textContent: TextContent): string {
  const items = textContent?.items;
  if (!items || !Array.isArray(items) || items.length === 0) return '';

  const lines: string[] = [];
  const currentLine: string[] = [];
  let lastY: number | null = null;
  let lastEndX: number | null = null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sortedItems = [...items].sort((a: any, b: any) => {
    const yDiff = b.transform[5] - a.transform[5];
    if (Math.abs(yDiff) > 5) return yDiff;
    return a.transform[4] - b.transform[4];
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const item of sortedItems as any[]) {
    if (!item.str) continue;
    const x: number = item.transform[4];
    const y: number = item.transform[5];

    if (lastY !== null && Math.abs(y - lastY) > 5) {
      if (currentLine.length > 0) {
        lines.push(currentLine.join(''));
        currentLine.length = 0;
      }
      lastEndX = null;
    }

    if (lastEndX !== null && x > lastEndX + 5) {
      currentLine.push(' ');
    }

    currentLine.push(item.str);
    lastY = y;
    lastEndX = x + (item.width || 0);
  }

  if (currentLine.length > 0) lines.push(currentLine.join(''));

  let text = lines.join('\n');
  text = text.replace(/([a-z])-\n([a-z])/gi, '$1$2');
  text = text.replace(/\n{3,}/g, '\n\n');
  text = text.replace(/[ \t]+/g, ' ');
  return text.trim();
}

export function isPdfSupported(): boolean {
  return typeof window !== 'undefined';
}
