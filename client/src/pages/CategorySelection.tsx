import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useProfiles } from '../hooks/useProfiles';
import { CATEGORIES, CATEGORY_EMOJIS, CATEGORY_GRADIENTS } from '../constants/categories';
import { Card } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export function CategorySelection() {
  const { data: profiles, isLoading } = useProfiles();
  const [selectedProfileId, setSelectedProfileId] = useState<string>('');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!profiles || profiles.length === 0) {
    return (
      <div className="p-4 lg:p-8 max-w-5xl mx-auto text-center py-16">
        <div className="text-4xl mb-4">👤</div>
        <h2 className="text-2xl font-display font-bold text-white mb-2">No profiles yet</h2>
        <p className="text-surface-400 mb-6">Create a profile first to start the questionnaire.</p>
        <Link
          to="/profiles/new"
          className="inline-flex px-6 py-3 gradient-bg text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
        >
          Create Profile
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-display font-bold text-white">Categories</h1>
        <p className="text-surface-400 mt-1">
          Select a profile and a category to start the questionnaire
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <p className="text-sm text-surface-400 mb-3">Choose a profile:</p>
        <div className="flex flex-wrap gap-2">
          {profiles.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedProfileId(p.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedProfileId === p.id
                  ? 'gradient-bg text-white shadow-lg shadow-primary-500/25'
                  : 'bg-surface-800 text-surface-400 hover:text-white hover:bg-surface-700'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATEGORIES.map((cat, i) => {
          const isDisabled = !selectedProfileId;
          return (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              {isDisabled ? (
                <Card padding="lg" className="opacity-50 cursor-not-allowed">
                  <div className="flex flex-col items-center text-center">
                    <div className="text-4xl mb-4">{CATEGORY_EMOJIS[cat.slug]}</div>
                    <h3 className="text-xl font-semibold text-white mb-2">{cat.name}</h3>
                    <p className="text-sm text-surface-400">{cat.description}</p>
                    <p className="text-xs text-surface-500 mt-4">Select a profile above first</p>
                  </div>
                </Card>
              ) : (
                <Link to={`/questionnaire/${selectedProfileId}/${cat.slug}`}>
                  <Card hover padding="lg">
                    <div className="flex flex-col items-center text-center">
                      <div className="text-4xl mb-4">{CATEGORY_EMOJIS[cat.slug]}</div>
                      <h3 className="text-xl font-semibold text-white mb-2">{cat.name}</h3>
                      <p className="text-sm text-surface-400">{cat.description}</p>
                      <div className="mt-4 w-full h-1.5 rounded-full bg-surface-700 overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${CATEGORY_GRADIENTS[cat.slug]}`}
                          style={{ width: '0%' }}
                        />
                      </div>
                      <p className="text-xs text-surface-500 mt-2">22 questions • Start questionnaire</p>
                    </div>
                  </Card>
                </Link>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
