import { useState, useEffect, useCallback } from 'react';
import { openDB, IDBPDatabase } from 'idb';
import { BibleTranslation, BibleBook, BibleChapter, BibleVerse, BibleSearchResult } from '../types/bible';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/auth';

// Importação dos dados da Bíblia
import bibleDataACF from '../data/bible-data-acf.json';
import bibleDataAA from '../data/bible-data-aa.json';
import bibleDataNVI from '../data/bible-data-nvi.json';

// Mapeamento de traduções para seus respectivos dados
const bibleTranslations = {
  'acf': bibleDataACF,
  'aa': bibleDataAA,
  'nvi': bibleDataNVI,
};

// Mapeamento completo de abreviações para nomes de livros
const bookNames = {
  'gn': 'Gênesis',
  'ex': 'Êxodo',
  'lv': 'Levítico',
  'nm': 'Números',
  'dt': 'Deuteronômio',
  'js': 'Josué',
  'jz': 'Juízes',
  'rt': 'Rute',
  '1sm': '1 Samuel',
  '2sm': '2 Samuel',
  '1rs': '1 Reis',
  '2rs': '2 Reis',
  '1cr': '1 Crônicas',
  '2cr': '2 Crônicas',
  'ed': 'Esdras',
  'ne': 'Neemias',
  'et': 'Ester',
  'jó': 'Jó',
  'sl': 'Salmos',
  'pv': 'Provérbios',
  'ec': 'Eclesiastes',
  'ct': 'Cânticos',
  'is': 'Isaías',
  'jr': 'Jeremias',
  'lm': 'Lamentações',
  'ez': 'Ezequiel',
  'dn': 'Daniel',
  'os': 'Oséias',
  'jl': 'Joel',
  'am': 'Amós',
  'ob': 'Obadias',
  'jn': 'Jonas',
  'mq': 'Miquéias',
  'na': 'Naum',
  'hc': 'Habacuque',
  'sf': 'Sofonias',
  'ag': 'Ageu',
  'zc': 'Zacarias',
  'ml': 'Malaquias',
  'mt': 'Mateus',
  'mc': 'Marcos',
  'lc': 'Lucas',
  'jo': 'João',
  'at': 'Atos',
  'rm': 'Romanos',
  '1co': '1 Coríntios',
  '2co': '2 Coríntios',
  'gl': 'Gálatas',
  'ef': 'Efésios',
  'fp': 'Filipenses',
  'cl': 'Colossenses',
  '1ts': '1 Tessalonicenses',
  '2ts': '2 Tessalonicenses',
  '1tm': '1 Timóteo',
  '2tm': '2 Timóteo',
  'tt': 'Tito',
  'fm': 'Filemom',
  'hb': 'Hebreus',
  'tg': 'Tiago',
  '1pe': '1 Pedro',
  '2pe': '2 Pedro',
  '1jo': '1 João',
  '2jo': '2 João',
  '3jo': '3 João',
  'jd': 'Judas',
  'ap': 'Apocalipse'
};

// Mapeamento de livros para testamentos
const oldTestament = ['gn', 'ex', 'lv', 'nm', 'dt', 'js', 'jz', 'rt', '1sm', '2sm', '1rs', '2rs', 
                     '1cr', '2cr', 'ed', 'ne', 'et', 'jó', 'sl', 'pv', 'ec', 'ct', 'is', 'jr', 
                     'lm', 'ez', 'dn', 'os', 'jl', 'am', 'ob', 'jn', 'mq', 'na', 'hc', 'sf', 
                     'ag', 'zc', 'ml'];

// Função para normalizar os dados da Bíblia
function normalizeBibleData(data: any[], translation: string) {
  return data.map(book => {
    // Determinar o nome do livro
    const bookName = bookNames[book.abbrev] || book.abbrev.toUpperCase();
    
    // Determinar o testamento
    const testament = oldTestament.includes(book.abbrev) ? 'old' : 'new';
    
    return {
      id: book.abbrev,
      name: bookName,
      abbreviation: book.abbrev,
      chapters: book.chapters.length,
      capitulos: book.chapters, // Armazena os capítulos para uso posterior
      testament: testament
    };
  });
}

const DB_NAME = 'bibliaai-bible';
const DB_VERSION = 1;

interface BibleDB extends IDBPDatabase {
  translations: IDBPObjectStore;
  verses: IDBPObjectStore;
  bookmarks: IDBPObjectStore;
}

export function useBible() {
  const { user } = useAuthStore();
  const [db, setDb] = useState<BibleDB | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentTranslation, setCurrentTranslation] = useState<string>('acf');

  // Initialize IndexedDB
  useEffect(() => {
    const initDB = async () => {
      try {
        const database = await openDB(DB_NAME, DB_VERSION, {
          upgrade(db) {
            // Create stores if they don't exist
            if (!db.objectStoreNames.contains('translations')) {
              db.createObjectStore('translations', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('verses')) {
              db.createObjectStore('verses', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('bookmarks')) {
              const bookmarksStore = db.createObjectStore('bookmarks', { 
                keyPath: 'id',
                autoIncrement: true 
              });
              bookmarksStore.createIndex('userId', 'userId');
              bookmarksStore.createIndex('reference', 'reference');
            }
          },
        });

        setDb(database as BibleDB);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to initialize Bible database'));
        setLoading(false);
      }
    };

    initDB();

    return () => {
      if (db) {
        db.close();
      }
    };
  }, []);

  useEffect(() => {
    console.log('Estrutura ACF:', bibleDataACF[0]);
    console.log('Estrutura AA:', bibleDataAA[0]);
    console.log('Estrutura NVI:', bibleDataNVI[0]);
  }, []);

  // Obter dados normalizados para a tradução atual
  const getBibleData = useCallback(() => {
    const data = bibleTranslations[currentTranslation] || bibleDataACF;
    return normalizeBibleData(data, currentTranslation);
  }, [currentTranslation]);

  // Load verse from local data
  const getVerse = useCallback(async (
    reference: string,
    translation: string = currentTranslation
  ): Promise<BibleVerse | null> => {
    try {
      setLoading(true);
      
      // Parse the reference: "book chapter:verse"
      const match = reference.match(/^(.+)\s+(\d+):(\d+)$/);
      if (!match) {
        throw new Error('Formato de referência inválido. Use "Livro Capítulo:Versículo"');
      }

      const [, bookName, chapterStr, verseStr] = match;
      const chapter = parseInt(chapterStr, 10);
      const verse = parseInt(verseStr, 10);

      // Obter dados da tradução especificada
      const data = bibleTranslations[translation] || bibleDataACF;
      const normalizedData = normalizeBibleData(data, translation);
      
      // Find in local data
      const bookData = normalizedData.find(b => 
        b.name.toLowerCase() === bookName.toLowerCase() || 
        b.abbreviation.toLowerCase() === bookName.toLowerCase() ||
        b.id.toLowerCase() === bookName.toLowerCase()
      );

      if (!bookData) return null;

      // Ajuste para o formato do array (índices começam em 0)
      const chapterIndex = chapter - 1;
      const verseIndex = verse - 1;

      if (!bookData.capitulos[chapterIndex] || !bookData.capitulos[chapterIndex][verseIndex]) {
        return null;
      }

      return {
        id: `${translation}:${bookData.name} ${chapter}:${verse}`,
        reference: `${bookData.name} ${chapter}:${verse}`,
        text: bookData.capitulos[chapterIndex][verseIndex],
        book: bookData.name,
        chapter,
        verse,
        translation
      };
    } catch (err) {
      console.error('Erro ao buscar versículo:', err);
      setError(err instanceof Error ? err : new Error('Erro ao buscar versículo'));
      return null;
    } finally {
      setLoading(false);
    }
  }, [currentTranslation]);

  // Get chapter from local data
  const getChapter = useCallback(async (
    book: string,
    chapter: number,
    translation: string = currentTranslation
  ): Promise<BibleVerse[]> => {
    try {
      setLoading(true);
      console.log('Buscando capítulo:', book, chapter, 'tradução:', translation);
      
      // Obter dados da tradução especificada
      const data = bibleTranslations[translation] || bibleDataACF;
      const normalizedData = normalizeBibleData(data, translation);
      
      // Find in local data
      const bookData = normalizedData.find(b => 
        b.name.toLowerCase() === book.toLowerCase() || 
        b.abbreviation.toLowerCase() === book.toLowerCase() ||
        b.id.toLowerCase() === book.toLowerCase()
      );

      console.log('Livro encontrado:', bookData?.name);

      if (!bookData) return [];

      // Ajuste para o formato do array (índices começam em 0)
      const chapterIndex = chapter - 1;
      
      console.log('Capítulo encontrado:', bookData.capitulos[chapterIndex]?.length, 'versículos');
      
      if (!bookData.capitulos[chapterIndex]) return [];

      // Converte o array de strings em objetos BibleVerse
      const verses = bookData.capitulos[chapterIndex].map((text, idx) => ({
        id: `${translation}:${bookData.name} ${chapter}:${idx + 1}`,
        reference: `${bookData.name} ${chapter}:${idx + 1}`,
        text,
        book: bookData.name,
        chapter,
        verse: idx + 1,
        translation
      }));
      
      return verses;
    } catch (err) {
      console.error('Erro ao buscar capítulo:', err);
      setError(err instanceof Error ? err : new Error('Erro ao buscar capítulo'));
      return [];
    } finally {
      setLoading(false);
    }
  }, [currentTranslation]);

  // Search verses by text
  const searchByTerm = useCallback(async (
    term: string,
    translation: string = currentTranslation
  ): Promise<BibleVerse[]> => {
    try {
      setLoading(true);
      const results: BibleVerse[] = [];
      const searchTerm = term.toLowerCase();

      // Obter dados da tradução especificada
      const data = bibleTranslations[translation] || bibleDataACF;
      const normalizedData = normalizeBibleData(data, translation);

      // Search in all books, chapters and verses
      for (const book of normalizedData) {
        for (let chapterIdx = 0; chapterIdx < book.capitulos.length; chapterIdx++) {
          const chapter = book.capitulos[chapterIdx];
          for (let verseIdx = 0; verseIdx < chapter.length; verseIdx++) {
            const text = chapter[verseIdx];
            if (text.toLowerCase().includes(searchTerm)) {
              results.push({
                id: `${translation}:${book.name} ${chapterIdx + 1}:${verseIdx + 1}`,
                reference: `${book.name} ${chapterIdx + 1}:${verseIdx + 1}`,
                text,
                book: book.name,
                chapter: chapterIdx + 1,
                verse: verseIdx + 1,
                translation
              });
            }
          }
        }
      }

      return results;
    } catch (err) {
      console.error('Erro na busca:', err);
      setError(err instanceof Error ? err : new Error('Erro na busca'));
      return [];
    } finally {
      setLoading(false);
    }
  }, [currentTranslation]);

  // Get verse of the day
  const getVerseOfDay = useCallback(async (): Promise<BibleVerse | null> => {
    const today = new Date().toISOString().split('T')[0];
    const cachedVerse = localStorage.getItem(`verseOfDay:${today}`);

    if (cachedVerse) {
      return JSON.parse(cachedVerse);
    }

    try {
      // Selecionar um versículo aleatório dos dados locais
      const randomBookIndex = Math.floor(Math.random() * bibleDataACF.length);
      const book = bibleDataACF[randomBookIndex];
      
      const randomChapterIndex = Math.floor(Math.random() * book.capitulos.length);
      const chapter = book.capitulos[randomChapterIndex];
      
      const randomVerseIndex = Math.floor(Math.random() * chapter.length);
      const verseData = chapter[randomVerseIndex];

      const verse: BibleVerse = {
        id: `${currentTranslation}:${book.nome} ${randomChapterIndex + 1}:${randomVerseIndex + 1}`,
        reference: `${book.nome} ${randomChapterIndex + 1}:${randomVerseIndex + 1}`,
        text: verseData,
        book: book.nome,
        chapter: randomChapterIndex + 1,
        verse: randomVerseIndex + 1,
        translation: currentTranslation
      };

      localStorage.setItem(`verseOfDay:${today}`, JSON.stringify(verse));
      return verse;
    } catch (err) {
      console.error('Error fetching verse of the day:', err);
      return null;
    }
  }, [currentTranslation]);

  // Bookmark management
  const addBookmark = useCallback(async (
    verse: BibleVerse,
    note?: string,
    tags: string[] = []
  ): Promise<void> => {
    if (!db || !user) return;

    const bookmark = {
      id: `${user.id}:${verse.id}`,
      userId: user.id,
      verseId: verse.id,
      reference: verse.reference,
      note,
      tags,
      createdAt: new Date()
    };

    try {
      // Save locally
      await db.put('bookmarks', bookmark);

      // Sync with Supabase
      await supabase
        .from('bible_bookmarks')
        .upsert({
          id: bookmark.id,
          user_id: bookmark.userId,
          verse_id: bookmark.verseId,
          reference: bookmark.reference,
          note: bookmark.note,
          tags: bookmark.tags,
          created_at: bookmark.createdAt
        });
    } catch (err) {
      console.error('Error adding bookmark:', err);
    }
  }, [db, user]);

  const getBookmarks = useCallback(async () => {
    if (!db || !user) return [];

    try {
      return await db.getAllFromIndex('bookmarks', 'userId', user.id);
    } catch (err) {
      console.error('Error fetching bookmarks:', err);
      return [];
    }
  }, [db, user]);

  // Obter todos os livros disponíveis
  const getBooks = useCallback((): BibleBook[] => {
    return getBibleData();
  }, [getBibleData]);

  return {
    loading,
    error,
    currentTranslation,
    setCurrentTranslation,
    getVerse,
    getChapter,
    searchByTerm,
    getVerseOfDay,
    addBookmark,
    getBookmarks,
    getBooks
  };
}