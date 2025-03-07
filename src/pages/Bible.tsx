import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Book, ChevronDown, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BibleReader } from '../components/BibleReader';
import { Header } from '../components/Header';
import { useBible } from '../hooks/useBible';
import { BibleBook } from '../types/bible';

const translations = [
  { id: 'acf', name: 'Almeida Corrigida Fiel' },
  { id: 'aa', name: 'Almeida Atualizada' },
  { id: 'nvi', name: 'Nova Versão Internacional' },
];

export function Bible() {
  const navigate = useNavigate();
  const { getBooks, loading, setCurrentTranslation } = useBible();
  const [books, setBooks] = useState<BibleBook[]>([]);
  const [selectedBook, setSelectedBook] = useState<BibleBook | null>(null);
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [selectedTranslation, setSelectedTranslation] = useState(translations[0]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBooks, setFilteredBooks] = useState<BibleBook[]>([]);

  useEffect(() => {
    // Carregar os livros da Bíblia
    const bibleBooks = getBooks();
    setBooks(bibleBooks);
    setFilteredBooks(bibleBooks);
    
    if (bibleBooks.length > 0 && !selectedBook) {
      setSelectedBook(bibleBooks[0]);
    }
  }, [getBooks, selectedBook]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredBooks(books);
    } else {
      const filtered = books.filter(book => 
        book.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBooks(filtered);
    }
  }, [searchTerm, books]);

  const handleNavigate = (book: string, chapter: number) => {
    const bookObj = books.find(b => b.id === book) || books[0];
    setSelectedBook(bookObj);
    setSelectedChapter(Math.max(1, Math.min(chapter, bookObj.chapters)));
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  // Atualizar a tradução atual quando o usuário selecionar uma nova
  const handleTranslationChange = (translationId: string) => {
    console.log('Mudando tradução para:', translationId);
    
    const newTranslation = translations.find(t => t.id === translationId) || translations[0];
    setSelectedTranslation(newTranslation);
    setCurrentTranslation(translationId);
    
    // Recarregar os livros para a nova tradução
    const bibleBooks = getBooks();
    console.log('Livros carregados:', bibleBooks.length);
    
    setBooks(bibleBooks);
    setFilteredBooks(bibleBooks);
    
    // Manter o livro e capítulo atual se possível
    if (selectedBook) {
      const sameBook = bibleBooks.find(b => 
        b.abbreviation === selectedBook.abbreviation || 
        b.id === selectedBook.id
      );
      
      console.log('Livro correspondente encontrado:', sameBook?.name);
      
      if (sameBook) {
        setSelectedBook(sameBook);
        // Ajustar o capítulo se necessário
        if (selectedChapter > sameBook.chapters) {
          console.log('Ajustando capítulo de', selectedChapter, 'para', 1);
          setSelectedChapter(1);
        }
      } else {
        // Fallback para o primeiro livro
        console.log('Livro não encontrado, usando o primeiro livro:', bibleBooks[0]?.name);
        setSelectedBook(bibleBooks[0]);
        setSelectedChapter(1);
      }
    }
  };

  if (loading || !selectedBook) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full"
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900"
    >
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/')}
              className="p-2 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded-full transition-colors"
              aria-label="Voltar"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </motion.button>
            <h1 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">
              Bíblia
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <select
                value={selectedTranslation.id}
                onChange={(e) => handleTranslationChange(e.target.value)}
                className="appearance-none bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl py-2 pl-4 pr-10 text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {translations.map(translation => (
                  <option key={translation.id} value={translation.id}>
                    {translation.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <button 
              onClick={toggleSidebar}
              className="md:hidden p-2 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded-full transition-colors"
              aria-label="Mostrar/esconder lista de livros"
            >
              <Book className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className={`${showSidebar ? 'block' : 'hidden'} md:block bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg`}>
            <div className="flex items-center space-x-2 mb-4">
              <Book className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Livros
              </h2>
            </div>

            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Buscar livro..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder-gray-400 dark:placeholder-gray-500"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>

            <div className="space-y-1 max-h-[60vh] md:max-h-[500px] overflow-y-auto pr-1">
              {filteredBooks.length === 0 ? (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                  Nenhum livro encontrado
                </div>
              ) : (
                <>
                  {/* Antigo Testamento */}
                  <div className="mb-2">
                    <h3 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold mb-1 px-3">
                      Antigo Testamento
                    </h3>
                    {filteredBooks
                      .filter(book => book.testament === 'old')
                      .map(book => (
                        <button
                          key={book.id}
                          onClick={() => {
                            setSelectedBook(book);
                            setSelectedChapter(1);
                            setShowSidebar(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                            selectedBook?.id === book.id
                              ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-medium'
                              : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {book.name}
                        </button>
                      ))}
                  </div>
                  
                  {/* Novo Testamento */}
                  <div>
                    <h3 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold mb-1 px-3">
                      Novo Testamento
                    </h3>
                    {filteredBooks
                      .filter(book => book.testament === 'new')
                      .map(book => (
                        <button
                          key={book.id}
                          onClick={() => {
                            setSelectedBook(book);
                            setSelectedChapter(1);
                            setShowSidebar(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                            selectedBook?.id === book.id
                              ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-medium'
                              : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {book.name}
                        </button>
                      ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  {selectedBook.name}
                </h2>
                <select
                  value={selectedChapter}
                  onChange={(e) => setSelectedChapter(Number(e.target.value))}
                  className="appearance-none bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg py-1 px-3 text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map(chapter => (
                    <option key={chapter} value={chapter}>
                      Capítulo {chapter}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <BibleReader
              translation={selectedTranslation.id}
              book={selectedBook.id}
              chapter={selectedChapter}
              onNavigate={handleNavigate}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}