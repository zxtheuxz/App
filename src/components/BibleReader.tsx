import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { BibleReaderProps, BibleVerse } from '../types/bible';
import { useBible } from '../hooks/useBible';
import { VerseDisplay } from './VerseDisplay';

export function BibleReader({ translation, book, chapter, onNavigate }: BibleReaderProps) {
  const { getChapter, loading: bibleLoading } = useBible();
  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChapter = async () => {
      setLoading(true);
      try {
        const chapterVerses = await getChapter(book, chapter, translation);
        setVerses(chapterVerses);
      } catch (err) {
        console.error('Error loading chapter:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadChapter();
  }, [book, chapter, translation, getChapter]);

  const handlePreviousChapter = () => {
    onNavigate(book, chapter - 1);
  };

  const handleNextChapter = () => {
    onNavigate(book, chapter + 1);
  };

  if (loading || bibleLoading) {
    return (
      <div className="flex items-center justify-center h-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className="sticky top-0 z-10 p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-white dark:bg-gray-800 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          <div>
            <h2 className="text-lg font-serif font-semibold text-gray-900 dark:text-white">
              {book} {chapter}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {translation === 'acf' && 'Almeida Corrigida Fiel'}
              {translation === 'aa' && 'Almeida Atualizada'}
              {translation === 'nvi' && 'Nova Versão Internacional'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePreviousChapter}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            disabled={chapter <= 1}
            aria-label="Capítulo anterior"
          >
            <ChevronLeft className={`w-5 h-5 ${chapter <= 1 ? 'text-gray-400 dark:text-gray-600' : 'text-gray-600 dark:text-gray-400'}`} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNextChapter}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            aria-label="Próximo capítulo"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </motion.button>
        </div>
      </div>
      
      <div className="overflow-y-auto max-h-[70vh] md:max-h-[600px] scroll-smooth">
        {verses.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <p className="text-lg">Nenhum versículo encontrado para {book} {chapter}</p>
            <p className="text-sm mt-2">Tente selecionar outro capítulo ou livro</p>
          </div>
        ) : (
          verses.map(verse => (
            <VerseDisplay
              key={verse.verse}
              verse={verse}
              showReference={false}
              showTranslation={false}
            />
          ))
        )}
      </div>
    </div>
  );
}