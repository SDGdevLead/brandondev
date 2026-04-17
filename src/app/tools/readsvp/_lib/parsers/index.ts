import type { Chapter } from '../../_types';
import { parseEpub } from './epub';
import { parsePdf } from './pdf';

export { parseEpub } from './epub';
export { parsePdf } from './pdf';

export interface ParseResult {
  title: string;
  text: string;
  wordCount: number;
  chapters: Chapter[] | null;
}

export const SUPPORTED_TYPES = {
  EPUB: 'application/epub+zip',
  PDF: 'application/pdf',
  TEXT: 'text/plain',
} as const;

const EXTENSION_MAP: Record<string, string> = {
  '.epub': SUPPORTED_TYPES.EPUB,
  '.pdf': SUPPORTED_TYPES.PDF,
  '.txt': SUPPORTED_TYPES.TEXT,
};

export const FILE_ACCEPT =
  '.epub,.pdf,.txt,application/epub+zip,application/pdf,text/plain';

function detectFileType(file: File): string | null {
  if (file.type && Object.values(SUPPORTED_TYPES).includes(file.type as never)) {
    return file.type;
  }
  const name = file.name.toLowerCase();
  for (const [ext, type] of Object.entries(EXTENSION_MAP)) {
    if (name.endsWith(ext)) return type;
  }
  return null;
}

export async function parseFile(
  file: File,
  onProgress?: (progress: number) => void
): Promise<ParseResult> {
  const fileType = detectFileType(file);
  if (!fileType) {
    throw new Error(`Unsupported file type: ${file.name}`);
  }

  switch (fileType) {
    case SUPPORTED_TYPES.EPUB: {
      const epubResult = await parseEpub(file);
      const wordCount = epubResult.chapters.reduce(
        (sum, ch) => sum + ch.wordCount,
        0
      );
      return {
        title: epubResult.title,
        text: epubResult.text,
        wordCount,
        chapters: epubResult.chapters,
      };
    }

    case SUPPORTED_TYPES.PDF: {
      const pdfResult = await parsePdf(file, onProgress);
      const wordCount = pdfResult.text.split(/\s+/).filter(Boolean).length;
      return {
        title: pdfResult.title,
        text: pdfResult.text,
        wordCount,
        chapters: null,
      };
    }

    case SUPPORTED_TYPES.TEXT: {
      const text = await file.text();
      const wordCount = text.split(/\s+/).filter(Boolean).length;
      return {
        title: file.name.replace(/\.txt$/i, ''),
        text,
        wordCount,
        chapters: null,
      };
    }

    default:
      throw new Error(`Unsupported file type: ${fileType}`);
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatWordCount(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return count.toString();
}
