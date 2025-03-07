import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Share2 } from 'lucide-react';
import { BibleVerse } from '../types/bible';

interface VerseDisplayProps {
  verse: BibleVerse;
  showReference?: boolean;
  showTranslation?: boolean;
}

export function VerseDisplay({ verse, showReference = true, showTranslation = false }: VerseDisplayProps) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${verse.book} ${verse.chapter}:${verse.verse}`,
        text: `"${verse.text}" - ${verse.book} ${verse.chapter}:${verse.verse}`
      }).catch(error => {
        console.error('Error sharing:', error);
      });
    } else {
      // Fallback para navegadores que não suportam a API Share
      alert(`"${verse.text}" - ${verse.book} ${verse.chapter}:${verse.verse}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-3 px-4 border-b border-gray-100 dark:border-gray-700 relative group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
    >
      <div className="flex">
        <span className="mr-3 text-primary-500 font-semibold text-sm md:text-base min-w-[20px] text-right">
          {verse.verse}
        </span>
        <p className="text-gray-800 dark:text-gray-200 font-serif text-base md:text-lg leading-relaxed tracking-wide">
          {verse.text}
        </p>
      </div>
      
      {showReference && (
        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium">
          {verse.book} {verse.chapter}:{verse.verse}
          {showTranslation && <span className="ml-1">- {verse.translation}</span>}
        </div>
      )}
      
      <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-1 rounded-full shadow-sm">
        <button 
          onClick={handleShare}
          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          aria-label="Compartilhar versículo"
        >
          <Share2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </button>
        <button 
          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          aria-label="Favoritar versículo"
        >
          <Heart className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </button>
      </div>
    </motion.div>
  );
}