import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useProfiles } from '../hooks/useProfiles';
import { useRecommendations } from '../hooks/useRecommendations';
import { CATEGORIES, CATEGORY_EMOJIS, CATEGORY_GRADIENTS } from '../constants/categories';
import { Card } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export function RecommendationsHub() {
  const { data: profiles, isLoading } = useProfiles();
  const [selectedProfileId, setSelectedProfileId] = useState('');

  if (isLoading) {
    return <div className="flex items-center justify-center h-full"><LoadingSpinner size="lg" /></div>;
  }

  if (!profiles || profiles.length === 0) {
    return (
      <div className="p-4 lg:p-8 max-w-5xl mx-auto text-center py-16">
        <div className="text-4xl mb-4">👤</div>
        <h2 className="text-2xl font-display font-bold text-white mb-2">No profiles yet</h2>
        <p className="text-surface-400 mb-6">Create a profile first to get recommendations.</p>
        <Link to="/profiles/new" className="inline-flex px-6 py-3 gradient-bg text-white rounded-xl font-medium hover:opacity-90 transition-opacity">
          Create Profile
        </Link>
      </div>
    );
  }

  const firstProfileId = selectedProfileId || profiles[0]!.id;

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-display font-bold text-white">Recommendations</h1>
        <p className="text-surface-400 mt-1">View AI-powered recommendations by category</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <p className="text-sm text-surface-400 mb-3">Choose a profile:</p>
        <div className="flex flex-wrap gap-2">
          {profiles.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedProfileId(p.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                firstProfileId === p.id
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
        {CATEGORIES.map((cat, i) => (
          <CategoryRecCard key={cat.slug} category={cat} index={i} profileId={firstProfileId} />
        ))}
      </div>
    </div>
  );
}

function CategoryRecCard({ category, index, profileId }: { category: typeof CATEGORIES[number]; index: number; profileId: string }) {
  const { data: recs, isLoading } = useRecommendations(profileId, category.slug);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
    >
      <Link to={`/recommendations/${profileId}/${category.slug}`}>
        <Card hover padding="lg">
          <div className="flex flex-col items-center text-center">
            <div className="text-4xl mb-4">{CATEGORY_EMOJIS[category.slug]}</div>
            <h3 className="text-xl font-semibold text-white mb-2">{category.name}</h3>
            <p className="text-sm text-surface-400 mb-4">{category.description}</p>
            {isLoading ? (
              <div className="text-xs text-surface-500">Loading...</div>
            ) : recs && recs.length > 0 ? (
              <>
                <div className="flex items-center gap-1 text-sm text-emerald-400 mb-2">
                  <span>✓</span>
                  <span>{recs.length} recommendations ready</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-surface-700 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400" style={{ width: '100%' }} />
                </div>
              </>
            ) : (
              <>
                <p className="text-xs text-surface-500 mb-2">No recommendations yet</p>
                <span className="text-xs text-primary-400">Take questionnaire →</span>
              </>
            )}
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
