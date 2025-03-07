export interface BibleTranslation {
  id: string;
  name: string;
  language: string;
  abbreviation: string;
}

export interface BibleBook {
  id: string;
  name: string;
  abbreviation: string;
  chapters: number;
  testament: 'old' | 'new';
}

export interface BibleChapter {
  book: string;
  chapter: number;
  verses: BibleVerse[];
}

export interface BibleVerse {
  id: string;
  reference: string;
  text: string;
  book: string;
  chapter: number;
  verse: number;
  translation: string;
}

export interface BibleSearchResult {
  verses: BibleVerse[];
  total: number;
  page: number;
  hasMore: boolean;
}

export interface BibleTheme {
  id: string;
  name: string;
  verses: string[]; // Array of verse references
}

export interface BibleBookmark {
  id: string;
  userId: string;
  verseId: string;
  reference: string;
  note?: string;
  tags: string[];
  createdAt: Date;
}

export interface BibleReaderProps {
  translation: string;
  book: string;
  chapter: number;
  onNavigate: (book: string, chapter: number) => void;
}

export interface VerseDisplayProps {
  verse: BibleVerse;
  showReference?: boolean;
  showTranslation?: boolean;
  onBookmark?: (verse: BibleVerse) => void;
  onShare?: (verse: BibleVerse) => void;
}