import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useProfiles } from '../hooks/useProfiles';
import { useRecommendations } from '../hooks/useRecommendations';
import { useCategoriesProgress } from '../hooks/useQuestions';
import { CategoryProgressCard } from '../components/dashboard/CategoryProgressCard';
import { RecentRecommendations } from '../components/dashboard/RecentRecommendations';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const { data: profiles, isLoading: profilesLoading } = useProfiles();
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);

  const activeProfileId = selectedProfileId || profiles?.[0]?.id || null;

  const { data: categoriesProgress, isLoading: progressLoading } = useCategoriesProgress(activeProfileId || '');
  const { data: recommendations, isLoading: recsLoading } = useRecommendations(activeProfileId || '');

  const stats = useMemo(() => {
    if (!categoriesProgress) return { totalAnswered: 0, totalQuestions: 0, recCount: 0 };
    const totalAnswered = categoriesProgress.reduce((s, c) => s + c.answeredCount, 0);
    const totalQuestions = categoriesProgress.reduce((s, c) => s + c.questionCount, 0);
    return { totalAnswered, totalQuestions, recCount: recommendations?.length || 0 };
  }, [categoriesProgress, recommendations]);

  const recsByCategory = useMemo(() => {
    if (!recommendations) return new Map<string, number>();
    const map = new Map<string, number>();
    for (const r of recommendations) {
      map.set(r.categorySlug, (map.get(r.categorySlug) || 0) + 1);
    }
    return map;
  }, [recommendations]);

  if (profilesLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!profiles || profiles.length === 0) {
    return (
      <div className="p-4 lg:p-8 max-w-5xl mx-auto text-center py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-5xl mb-4">👤</div>
          <h2 className="text-2xl font-display font-bold text-white mb-2">Create your first profile</h2>
          <p className="text-surface-400 mb-6 max-w-md mx-auto">
            Set up a profile to start answering questionnaires and get AI-powered recommendations.
          </p>
          <Link
            to="/profiles/new"
            className="inline-flex px-6 py-3 gradient-bg text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
          >
            Create Profile
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-white">
              Welcome back, {user?.username}
            </h1>
            <p className="text-surface-400 mt-1">
              {stats.totalAnswered}/{stats.totalQuestions} questions answered
              {stats.recCount > 0 && ` · ${stats.recCount} recommendations ready`}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-surface-500 font-medium mr-1">Profile:</span>
          {profiles.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedProfileId(p.id)}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                activeProfileId === p.id
                  ? 'gradient-bg text-white shadow-lg shadow-primary-500/25'
                  : 'bg-surface-800 text-surface-400 hover:text-white hover:bg-surface-700'
              }`}
            >
              {p.name}
            </button>
          ))}
          <Link
            to="/profiles/new"
            className="px-3 py-1.5 rounded-xl text-sm font-medium text-primary-400 hover:text-primary-300 hover:bg-primary-500/10 transition-all"
          >
            + New
          </Link>
        </div>
      </motion.div>

      <div className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-display font-semibold text-white">Categories</h2>
          <Link
            to="/questionnaires"
            className="text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors"
          >
            View all →
          </Link>
        </div>

        {progressLoading ? (
          <div className="flex justify-center py-8"><LoadingSpinner size="md" /></div>
        ) : categoriesProgress && categoriesProgress.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoriesProgress.map((cat, i) => (
              <CategoryProgressCard
                key={cat.slug}
                category={cat}
                profileId={activeProfileId!}
                recommendationCount={recsByCategory.get(cat.slug) || 0}
                index={i}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-surface-500 text-sm">
            No categories available
          </div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-display font-semibold text-white">Latest Recommendations</h2>
          {recommendations && recommendations.length > 0 && (
            <Link
              to={`/recommendations`}
              className="text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors"
            >
              View all →
            </Link>
          )}
        </div>

        {recsLoading ? (
          <div className="flex justify-center py-8"><LoadingSpinner size="md" /></div>
        ) : (
          <RecentRecommendations
            recommendations={recommendations || []}
            profileId={activeProfileId!}
          />
        )}
      </motion.div>
    </div>
  );
}
