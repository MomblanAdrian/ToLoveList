import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useProfiles } from '../hooks/useProfiles';
import { useQuestionProgress } from '../hooks/useQuestions';
import { CATEGORIES, CATEGORY_EMOJIS, CATEGORY_GRADIENTS } from '../constants/categories';
import { Card } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export function QuestionnairesHub() {
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
        <p className="text-surface-400 mb-6">Create a profile first to start the questionnaires.</p>
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
        <h1 className="text-3xl font-display font-bold text-white">Questionnaires</h1>
        <p className="text-surface-400 mt-1">Answer questions to get personalized AI recommendations</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <p className="text-sm text-surface-400 mb-3">Answering as:</p>
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
          <CategoryCard key={cat.slug} category={cat} index={i} profileId={firstProfileId} />
        ))}
      </div>
    </div>
  );
}

function CategoryCard({ category, index, profileId }: { category: typeof CATEGORIES[number]; index: number; profileId: string }) {
  const { data: progress } = useQuestionProgress(profileId, category.slug);

  const answered = progress?.answeredQuestions ?? 0;
  const total = progress?.totalQuestions ?? 22;
  const pct = total > 0 ? (answered / total) * 100 : 0;
  const isComplete = progress?.isComplete ?? false;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
    >
      <Link to={`/questionnaire/${profileId}/${category.slug}`}>
        <Card hover padding="lg">
          <div className="flex flex-col items-center text-center">
            <div className="text-4xl mb-4">{CATEGORY_EMOJIS[category.slug]}</div>
            <h3 className="text-xl font-semibold text-white mb-2">{category.name}</h3>
            <p className="text-sm text-surface-400 mb-4">{category.description}</p>
            <div className="w-full h-1.5 rounded-full bg-surface-700 overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${CATEGORY_GRADIENTS[category.slug]}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="flex items-center justify-between w-full mt-2">
              <span className="text-xs text-surface-500">{total} questions</span>
              <span className={`text-xs font-medium ${isComplete ? 'text-emerald-400' : 'text-primary-400'}`}>
                {isComplete ? '✓ Completed' : `${answered}/${total}`}
              </span>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
