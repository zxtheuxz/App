import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Book, MessageSquare, Calendar, Share2, Search, Bookmark, PenTool, Heart, Bell, Volume2, ChevronRight, ChevronLeft, Plus, Home, BookOpen, Sunrise, Users, Clock, Star, Dribbble as Bible } from 'lucide-react';
import { Header } from '../components/Header';

const BottomNavItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <motion.button
    onClick={onClick}
    className={`flex flex-col items-center space-y-1 relative ${active ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
  >
    <motion.div
      initial={false}
      animate={active ? {
        scale: [1, 1.2, 1],
        rotate: [0, 10, 0],
      } : {}}
      className="relative"
    >
      <Icon className="w-6 h-6" />
      {active && (
        <motion.div
          className="absolute inset-0 bg-primary-100 dark:bg-primary-900/20 rounded-full -z-10"
          initial={{ scale: 0 }}
          animate={{ scale: 1.5 }}
          exit={{ scale: 0 }}
        />
      )}
    </motion.div>
    <span className="text-xs font-medium">{label}</span>
    {active && (
      <motion.div
        className="absolute -bottom-2 w-1 h-1 bg-primary-600 dark:bg-primary-400 rounded-full"
        layoutId="activeIndicator"
      />
    )}
  </motion.button>
);

const FloatingCard = ({ children, className = '', elevation = 'md' }: { children: React.ReactNode, className?: string, elevation?: 'sm' | 'md' | 'lg' }) => {
  const y = useMotionValue(0);
  const shadowOpacity = useTransform(y, [-5, 0], [0.3, 0.1]);

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      style={{ y }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={`
        bg-white dark:bg-gray-800 rounded-2xl p-6
        ${elevation === 'sm' ? 'shadow-lg' : elevation === 'lg' ? 'shadow-2xl' : 'shadow-xl'}
        backdrop-blur-lg backdrop-filter
        border border-gray-100 dark:border-gray-700
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};

const ParticleEffect = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(30)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-gradient-to-r from-primary-200 to-primary-300 rounded-full"
        initial={{ 
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          scale: 0,
          opacity: 0 
        }}
        animate={{
          y: [null, -20],
          scale: [0, 1, 0],
          opacity: [0, 0.8, 0],
        }}
        transition={{
          duration: 3 + Math.random() * 2,
          repeat: Infinity,
          repeatType: "reverse",
          delay: Math.random() * 2,
          ease: "easeInOut"
        }}
      />
    ))}
  </div>
);

const VerseCard = ({ verse, onPrevious, onNext }: any) => (
  <motion.div
    className="relative overflow-hidden"
    whileHover={{ scale: 1.02 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-100/30 to-primary-200/30 dark:from-primary-900/20 dark:to-primary-800/20 rounded-full -translate-y-32 translate-x-32 blur-3xl" />
    <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-gold-100/30 to-gold-200/30 dark:from-gold-900/20 dark:to-gold-800/20 rounded-full translate-y-16 -translate-x-16 blur-2xl" />
    
    <div className="relative">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-serif font-semibold text-gray-900 dark:text-white mb-2">
            Versículo do Dia
          </h2>
          <div className="flex items-center space-x-2 bg-primary-50 dark:bg-primary-900/30 px-3 py-1 rounded-full">
            <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
              {verse.translation}
            </span>
            <ChevronRight className="w-4 h-4 text-primary-400" />
          </div>
        </div>
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-full transition-colors"
          >
            <Volume2 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-full transition-colors"
          >
            <Share2 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </motion.button>
        </div>
      </div>

      <blockquote className="text-lg text-gray-700 dark:text-gray-300 font-serif mb-6 leading-relaxed relative">
        <span className="absolute -left-4 -top-4 text-4xl text-primary-200 dark:text-primary-800">"</span>
        {verse.text}
        <span className="absolute -right-4 bottom-0 text-4xl text-primary-200 dark:text-primary-800">"</span>
      </blockquote>

      <div className="flex justify-between items-center">
        <motion.button
          whileHover={{ x: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={onPrevious}
          className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>
        
        <p className="text-right font-serif text-lg text-primary-600 dark:text-primary-400">
          {verse.reference}
        </p>

        <motion.button
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
          className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  </motion.div>
);

const StudyCard = ({ study }: { study: any }) => {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - study.progress / 100);

  return (
    <motion.div
      className="flex items-center space-x-4 p-4 hover:bg-gradient-to-r hover:from-primary-50/50 hover:to-transparent dark:hover:from-primary-900/20 dark:hover:to-transparent rounded-xl cursor-pointer group transition-colors"
      whileHover={{ x: 10 }}
    >
      <div className="relative w-12 h-12">
        <svg className="w-12 h-12 transform -rotate-90">
          <circle
            className="text-gray-200 dark:text-gray-700"
            strokeWidth="3"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="24"
            cy="24"
          />
          <motion.circle
            className="text-primary-600 drop-shadow-lg"
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="24"
            cy="24"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
          {study.progress}%
        </span>
      </div>
      <div className="flex-1">
        <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {study.title}
        </h4>
        <p className="text-sm text-gray-500">Continuar lendo</p>
      </div>
      <motion.div
        whileHover={{ x: 5 }}
        className="text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </motion.div>
    </motion.div>
  );
};

const PrayerCard = ({ reminder }: { reminder: any }) => {
  const priorityColors = {
    high: 'bg-red-500',
    medium: 'bg-yellow-500',
    normal: 'bg-green-500'
  };

  const priorityIcons = {
    high: Sunrise,
    medium: Clock,
    normal: Star
  };

  const Icon = priorityIcons[reminder.priority as keyof typeof priorityIcons];

  return (
    <motion.div
      className="flex items-center space-x-4 p-4 hover:bg-gradient-to-r hover:from-primary-50/50 hover:to-transparent dark:hover:from-primary-900/20 dark:hover:to-transparent rounded-xl cursor-pointer group transition-colors"
      whileHover={{ x: 10 }}
    >
      <div className={`w-2 h-10 rounded-full ${priorityColors[reminder.priority as keyof typeof priorityColors]} opacity-50 group-hover:opacity-100 transition-opacity`} />
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <Icon className="w-4 h-4 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
          <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {reminder.title}
          </h4>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {reminder.time} • {reminder.category}
        </p>
      </div>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="p-2 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-full transition-colors"
      >
        <Bell className="w-5 h-5 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
      </motion.button>
    </motion.div>
  );
};

export function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [verse] = useState({
    text: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.",
    reference: "João 3:16",
    translation: "NVI"
  });

  const recentStudies = [
    { title: 'O Sermão do Monte', progress: 65 },
    { title: 'Parábolas de Jesus', progress: 30 },
    { title: 'Salmos de Adoração', progress: 85 }
  ];

  const prayerReminders = [
    { title: 'Oração Matinal', time: '06:00', category: 'Pessoal', priority: 'high' },
    { title: 'Intercessão Família', time: '12:00', category: 'Família', priority: 'medium' },
    { title: 'Gratidão', time: '21:00', category: 'Pessoal', priority: 'normal' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 pb-20"
    >
      <ParticleEffect />

      <Header />

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <FloatingCard elevation="lg">
          <VerseCard
            verse={verse}
            onPrevious={() => {}}
            onNext={() => {}}
          />
        </FloatingCard>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: MessageSquare, label: 'Chat IA', color: 'text-green-500', bgColor: 'bg-green-50 dark:bg-green-900/20', onClick: () => {} },
            { icon: Search, label: 'Buscar Versículo', color: 'text-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-900/20', onClick: () => navigate('/search') },
            { icon: Book, label: 'Estudos', color: 'text-purple-500', bgColor: 'bg-purple-50 dark:bg-purple-900/20', onClick: () => {} },
            { icon: Calendar, label: 'Lembretes', color: 'text-red-500', bgColor: 'bg-red-50 dark:bg-red-900/20', onClick: () => {} },
          ].map((action, index) => (
            <FloatingCard key={action.label} className="!p-4" elevation="sm">
              <motion.button
                className={`w-full flex flex-col items-center justify-center gap-2 p-4 rounded-xl ${action.bgColor} transition-colors`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={action.onClick}
              >
                <action.icon className={`w-6 h-6 ${action.color}`} />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {action.label}
                </span>
              </motion.button>
            </FloatingCard>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <FloatingCard>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Estudos Recentes
              </h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-full transition-colors"
              >
                <Plus className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </motion.button>
            </div>
            <div className="space-y-2">
              {recentStudies.map((study, index) => (
                <StudyCard key={index} study={study} />
              ))}
            </div>
          </FloatingCard>

          <FloatingCard>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Lembretes de Oração
              </h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-full transition-colors"
              >
                <Plus className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </motion.button>
            </div>
            <div className="space-y-2">
              {prayerReminders.map((reminder, index) => (
                <PrayerCard key={index} reminder={reminder} />
              ))}
            </div>
          </FloatingCard>
        </div>
      </div>

      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-t border-gray-100 dark:border-gray-700 px-6 py-3 flex justify-around items-center"
      >
        <BottomNavItem
          icon={Home}
          label="Início"
          active={activeTab === 'home'}
          onClick={() => setActiveTab('home')}
        />
        <BottomNavItem
          icon={Bible}
          label="Bíblia"
          active={activeTab === 'bible'}
          onClick={() => navigate('/bible')}
        />
        <BottomNavItem
          icon={MessageSquare}
          label="Chat"
          active={activeTab === 'chat'}
          onClick={() => setActiveTab('chat')}
        />
        <BottomNavItem
          icon={Search}
          label="Buscar"
          active={activeTab === 'search'}
          onClick={() => navigate('/search')}
        />
      </motion.div>
    </motion.div>
  );
}