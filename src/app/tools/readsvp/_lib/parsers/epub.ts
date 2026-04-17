import JSZip from 'jszip';
import type { Chapter } from '../../_types';

export interface EpubResult {
  title: string;
  chapters: Chapter[];
  text: string;
}

export async function parseEpub(input: File | ArrayBuffer): Promise<EpubResult> {
  const zip = await JSZip.loadAsync(input);

  const containerXml = await zip.file('META-INF/container.xml')?.async('text');
  if (!containerXml) {
    throw new Error('Invalid EPUB: Missing container.xml');
  }

  const opfPath = extractOpfPath(containerXml);
  if (!opfPath) {
    throw new Error('Invalid EPUB: Could not find OPF path');
  }

  const opfContent = await zip.file(opfPath)?.async('text');
  if (!opfContent) {
    throw new Error('Invalid EPUB: Missing OPF file');
  }

  const opfDir = opfPath.includes('/') ? opfPath.substring(0, opfPath.lastIndexOf('/') + 1) : '';
  const { title, spineItems, tocHref } = parseOpf(opfContent);

  const tocTitles = await extractTocTitles(zip, opfDir, tocHref);

  const chapters: Chapter[] = [];
  let chapterIndex = 0;

  for (const itemHref of spineItems) {
    const itemPath = opfDir + itemHref;
    const content = await zip.file(itemPath)?.async('text');
    if (content) {
      const text = extractTextFromXhtml(content);
      if (text.trim()) {
        const chapterTitle =
          tocTitles.get(itemHref) ||
          extractTitleFromXhtml(content) ||
          `Chapter ${chapterIndex + 1}`;
        const wordCount = text.split(/\s+/).filter(Boolean).length;
        chapters.push({ id: itemHref, title: chapterTitle, text, wordCount });
        chapterIndex++;
      }
    }
  }

  const fullText = chapters.map(ch => ch.text).join('\n\n');
  return { title: title || 'Untitled', chapters, text: fullText };
}

function extractOpfPath(containerXml: string): string | null {
  const match = containerXml.match(/full-path="([^"]+)"/);
  return match ? match[1] : null;
}

function parseOpf(opfContent: string): {
  title: string | null;
  spineItems: string[];
  tocHref: string | null;
} {
  const titleMatch = opfContent.match(/<dc:title[^>]*>([^<]+)<\/dc:title>/i);
  const title = titleMatch ? decodeHtmlEntities(titleMatch[1].trim()) : null;

  const manifestMap = new Map<string, string>();
  const manifestRegex = /<item\s+([^>]+)>/gi;
  let match: RegExpExecArray | null;

  while ((match = manifestRegex.exec(opfContent)) !== null) {
    const attrs = match[1];
    const idMatch = attrs.match(/id="([^"]+)"/);
    const hrefMatch = attrs.match(/href="([^"]+)"/);
    if (idMatch && hrefMatch) {
      manifestMap.set(idMatch[1], hrefMatch[1]);
    }
  }

  let tocHref: string | null = null;
  const ncxMatch = opfContent.match(
    /<item[^>]*href="([^"]+)"[^>]*media-type="application\/x-dtbncx\+xml"[^>]*>/i
  );
  if (ncxMatch) tocHref = ncxMatch[1];
  const spineTocMatch = opfContent.match(/<spine[^>]*toc="([^"]+)"/i);
  if (spineTocMatch && !tocHref) {
    tocHref = manifestMap.get(spineTocMatch[1]) || null;
  }

  const spineItems: string[] = [];
  const spineRegex = /<itemref\s+[^>]*idref="([^"]+)"[^>]*>/gi;
  while ((match = spineRegex.exec(opfContent)) !== null) {
    const href = manifestMap.get(match[1]);
    if (href) spineItems.push(href);
  }

  return { title, spineItems, tocHref };
}

async function extractTocTitles(
  zip: JSZip,
  opfDir: string,
  tocHref: string | null
): Promise<Map<string, string>> {
  const titles = new Map<string, string>();

  if (!tocHref) {
    for (const path of ['toc.ncx', 'OEBPS/toc.ncx', 'OPS/toc.ncx']) {
      if (zip.file(path)) {
        tocHref = path.startsWith(opfDir) ? path.slice(opfDir.length) : path;
        break;
      }
    }
  }

  if (!tocHref) return titles;

  const tocPath = tocHref.startsWith('/') ? tocHref.slice(1) : opfDir + tocHref;
  const tocContent = await zip.file(tocPath)?.async('text');
  if (!tocContent) return titles;

  if (tocHref.endsWith('.ncx')) {
    const navPointRegex =
      /<navPoint[^>]*>[\s\S]*?<navLabel>[\s\S]*?<text>([^<]+)<\/text>[\s\S]*?<content\s+src="([^"#]+)/gi;
    let match: RegExpExecArray | null;
    while ((match = navPointRegex.exec(tocContent)) !== null) {
      titles.set(match[2], decodeHtmlEntities(match[1].trim()));
    }
  } else if (tocHref.endsWith('.xhtml') || tocHref.endsWith('.html')) {
    const linkRegex = /<a[^>]*href="([^"#]+)[^"]*"[^>]*>([^<]+)<\/a>/gi;
    let match: RegExpExecArray | null;
    while ((match = linkRegex.exec(tocContent)) !== null) {
      titles.set(match[1], decodeHtmlEntities(match[2].trim()));
    }
  }

  return titles;
}

function extractTitleFromXhtml(xhtml: string): string | null {
  const headingMatch = xhtml.match(/<h[123][^>]*>([^<]+)<\/h[123]>/i);
  if (headingMatch) return decodeHtmlEntities(headingMatch[1].trim());
  const titleMatch = xhtml.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) {
    const t = decodeHtmlEntities(titleMatch[1].trim());
    if (t && !t.toLowerCase().includes('untitled')) return t;
  }
  return null;
}

function extractTextFromXhtml(xhtml: string): string {
  let text = xhtml.replace(/<script[\s\S]*?<\/script>/gi, '');
  text = text.replace(/<style[\s\S]*?<\/style>/gi, '');
  text = text.replace(/<\/(p|div|h[1-6]|li|br|tr)>/gi, '\n');
  text = text.replace(/<br\s*\/?>/gi, '\n');
  text = text.replace(/<[^>]+>/g, ' ');
  text = decodeHtmlEntities(text);
  text = text.replace(/[ \t]+/g, ' ');
  text = text.replace(/\n\s*\n/g, '\n\n');
  return text.trim();
}

function decodeHtmlEntities(text: string): string {
  const entities: Record<string, string> = {
    '&nbsp;': ' ',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
    '&mdash;': '\u2014',
    '&ndash;': '\u2013',
    '&hellip;': '\u2026',
    '&rsquo;': '\u2019',
    '&lsquo;': '\u2018',
    '&rdquo;': '\u201D',
    '&ldquo;': '\u201C',
  };

  let result = text;
  for (const [entity, char] of Object.entries(entities)) {
    result = result.split(entity).join(char);
  }
  result = result.replace(/&#(\d+);/g, (_, code) =>
    String.fromCharCode(parseInt(code, 10))
  );
  result = result.replace(/&#x([0-9a-f]+);/gi, (_, code) =>
    String.fromCharCode(parseInt(code, 16))
  );
  return result;
}
