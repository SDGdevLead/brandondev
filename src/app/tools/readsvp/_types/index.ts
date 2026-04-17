export interface Chapter {
  id: string;
  title: string;
  text: string;
  wordCount: number;
}

export interface ParsedDocument {
  title: string;
  text: string;
  chapters?: Chapter[];
}

export interface WordParts {
  before: string;
  pivot: string;
  after: string;
}
