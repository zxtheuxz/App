import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, User } from 'lucide-react';
import { useAuthStore } from '../store/auth';
import { supabase } from '../lib/supabase';

interface Profile {
  id: string;
  name: string;
  phone: string | null;
  avatar_url: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export function Header() {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    async function loadProfile() {
      if (user?.id) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (!error && data) {
          setProfile(data);
        }
      }
    }

    loadProfile();
  }, [user]);

  return (
    <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-100 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <h1 className="text-2xl font-serif font-bold bg-gradient-to-r from-[#3498db] to-primary-400 bg-clip-text text-transparent">
            BíbliaAI
          </h1>

          {/* Greeting - Hidden on mobile */}
          <div className="hidden md:block text-center">
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-gray-700 dark:text-gray-300 font-medium"
            >
              Olá, <span className="text-[#3498db] font-semibold">{profile?.name || 'Visitante'}</span>!
            </motion.p>
          </div>

          {/* Profile and Settings */}
          <div className="flex items-center space-x-4">
            {/* Profile Picture */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[#3498db] shadow-md"
            >
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#3498db] to-primary-400 flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
              )}
            </motion.div>

            {/* Settings Button */}
            <motion.button
              whileHover={{ rotate: 90 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="p-2 rounded-full bg-white dark:bg-gray-700 shadow-neo dark:shadow-neo-dark hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <Settings className="w-6 h-6 text-[#3498db] dark:text-primary-400" />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}