import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Search, 
  Share2, 
  Heart, 
  Copy, 
  Check,
  Loader2,
  Filter,
  History,
  BookOpen,
  X,
  ChevronDown,
  Volume2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import debounce from 'lodash/debounce';

interface Verse {
  id: string;
  reference: string;
  text: string;
  translation: string;
}

interface SearchResponse {
  status: string;
  verses: Verse[];
}

interface SearchHistoryItem {
  term: string;
  timestamp: number;
}

const popularSearches = [
  'Amor',
  'Fé',
  'União',
  'Casamento',
  'Namoro',
  'Paz',
  'Gratidão',
  'Família',
  'Esperança',
  'Perdão'
];

const translations = [
  { id: 'all', name: 'Todas' },
  { id: 'nvi', name: 'Nova Versão Internacional' },
  { id: 'ara', name: 'Almeida Revista e Atualizada' },
  { id: 'acf', name: 'Almeida Corrigida Fiel' },
  { id: 'ntlh', name: 'Nova Tradução na Linguagem de Hoje' }
];

const VerseCard = ({ verse }: { verse: Verse }) => {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`${verse.text} - ${verse.reference} (${verse.translation})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Versículo copiado!');
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: verse.reference,
        text: `${verse.text} - ${verse.reference} (${verse.translation})`,
      });
    } catch (error) {
      toast.error('Erro ao compartilhar. Tente copiar o versículo.');
    }
  };

  const handleLike = () => {
    setLiked(!liked);
    toast.success(liked ? 'Removido dos favoritos' : 'Adicionado aos favoritos');
  };

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
    // Implementar lógica de text-to-speech aqui
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-primary-500" />
          <div>
            <h3 className="text-lg font-serif font-semibold text-primary-600 dark:text-primary-400">
              {verse.reference}
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {verse.translation}
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePlay}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <Volume2 className={`w-5 h-5 ${isPlaying ? 'text-primary-500' : 'text-gray-600 dark:text-gray-400'}`} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleShare}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleLike}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <Heart 
              className={`w-5 h-5 ${liked ? 'text-red-500 fill-red-500' : 'text-gray-600 dark:text-gray-400'}`}
            />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleCopy}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            {copied ? (
              <Check className="w-5 h-5 text-green-500" />
            ) : (
              <Copy className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
          </motion.button>
        </div>
      </div>
      <div className="relative">
        <p className="text-gray-700 dark:text-gray-300 font-serif leading-relaxed text-lg">
          {verse.text}
        </p>
        <div className="absolute -left-4 top-0 w-1 h-full bg-primary-500/20 rounded-full" />
      </div>
    </motion.div>
  );
};

const SearchHistory = ({ 
  history, 
  onSelect, 
  onClear 
}: { 
  history: SearchHistoryItem[],
  onSelect: (term: string) => void,
  onClear: () => void
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg mb-6">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
        <History className="w-5 h-5 mr-2" />
        Buscas Recentes
      </h3>
      <button
        onClick={onClear}
        className="text-sm text-gray-500 hover:text-red-500 transition-colors"
      >
        Limpar histórico
      </button>
    </div>
    <div className="flex flex-wrap gap-2">
      {history.map((item, index) => (
        <button
          key={index}
          onClick={() => onSelect(item.term)}
          className="flex items-center space-x-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <span>{item.term}</span>
          <X className="w-4 h-4" />
        </button>
      ))}
    </div>
  </div>
);

const FilterDropdown = ({
  selectedTranslation,
  onSelect
}: {
  selectedTranslation: string,
  onSelect: (id: string) => void
}) => (
  <div className="relative inline-block text-left">
    <button
      className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
    >
      <Filter className="w-4 h-4" />
      <span>{translations.find(t => t.id === selectedTranslation)?.name || 'Todas'}</span>
      <ChevronDown className="w-4 h-4" />
    </button>
  </div>
);

export function SearchPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedTranslation, setSelectedTranslation] = useState('all');
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
    
    // Carregar histórico do localStorage
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  const saveToHistory = (term: string) => {
    const newHistory = [
      { term, timestamp: Date.now() },
      ...searchHistory.filter(item => item.term !== term).slice(0, 9)
    ];
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  // Debounce search suggestions
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      // Implementar sugestões de busca aqui
    }, 300),
    []
  );

  const handleSearch = async (term: string) => {
    if (!term.trim()) return;
    
    setSearchTerm(term);
    setLoading(true);
    setError(null);
    setVerses([]);
    saveToHistory(term);

    try {
      console.log('Iniciando busca por:', term);
      
      const response = await fetch('https://n8n-n8n.r7kz3f.easypanel.host/webhook/versiculo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text: term,
          translation: selectedTranslation === 'all' ? undefined : selectedTranslation
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar versículos: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response data:', data);

      let versesData: Verse[] = [];
      
      if (data && data.verses && Array.isArray(data.verses)) {
        versesData = data.verses;
      } 
      else if (Array.isArray(data) && data[0]?.output?.verses) {
        versesData = data[0].output.verses;
      }
      else if (Array.isArray(data) && Array.isArray(data[0]?.verses)) {
        versesData = data[0].verses;
      }
      else {
        throw new Error('Formato de resposta não reconhecido');
      }
      
      if (versesData.length === 0) {
        setError('Nenhum versículo encontrado para esta busca');
        return;
      }

      setVerses(versesData);
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'Erro ao buscar versículos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900"
    >
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/')}
              className="p-2 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </motion.button>
            <h1 className="text-2xl font-serif font-bold ml-2 text-gray-900 dark:text-white">
              Buscar Versículo
            </h1>
          </div>
          <FilterDropdown
            selectedTranslation={selectedTranslation}
            onSelect={setSelectedTranslation}
          />
        </div>

        {searchHistory.length > 0 && (
          <SearchHistory
            history={searchHistory}
            onSelect={handleSearch}
            onClear={clearHistory}
          />
        )}

        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              debouncedSearch(e.target.value);
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchTerm)}
            placeholder="Digite um tema para buscar versículos..."
            className="w-full pl-10 pr-24 py-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSearch(searchTerm)}
              disabled={loading || !searchTerm.trim()}
              className="px-4 py-1.5 bg-primary-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-700 transition-colors"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Buscar'
              )}
            </motion.button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {popularSearches.map((term) => (
            <motion.button
              key={term}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSearch(term)}
              className="px-4 py-2 bg-white dark:bg-gray-800 rounded-full text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-gray-700 transition-colors shadow-sm hover:shadow"
            >
              {term}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Buscando versículos...
              </p>
            </motion.div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <p className="text-gray-600 dark:text-gray-400">{error}</p>
            </motion.div>
          ) : verses.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {verses.map((verse) => (
                <VerseCard key={verse.id} verse={verse} />
              ))}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}