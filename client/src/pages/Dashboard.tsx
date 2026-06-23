import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useProfiles } from '../hooks/useProfiles';
import { useAuthStore } from '../store/authStore';
import { Card } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { CATEGORIES, CATEGORY_EMOJIS } from '../constants/categories';

export function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const { data: profiles, isLoading } = useProfiles();

  if (isLoading) {
    return <div className="flex items-center justify-center h-full"><LoadingSpinner size="lg" /></div>;
  }

  const hasProfiles = profiles && profiles.length > 0;
  const profile = hasProfiles ? profiles[0] : null;

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-bold text-white">
          Welcome, {user?.username}
        </h1>
        <p className="text-surface-400 mt-1">Discover personalized recommendations</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/questionnaires">
          <Card hover>
            <div className="flex items-center gap-4">
              <div className="text-3xl">📋</div>
              <div>
                <p className="text-sm font-medium text-white">Questionnaires</p>
                <p className="text-xs text-surface-400">Answer questions to train your AI</p>
              </div>
            </div>
          </Card>
        </Link>
        <Link to="/recommendations">
          <Card hover>
            <div className="flex items-center gap-4">
              <div className="text-3xl">💡</div>
              <div>
                <p className="text-sm font-medium text-white">Recommendations</p>
                <p className="text-xs text-surface-400">View AI-powered suggestions</p>
              </div>
            </div>
          </Card>
        </Link>
        <Link to="/profiles">
          <Card hover>
            <div className="flex items-center gap-4">
              <div className="text-3xl">👤</div>
              <div>
                <p className="text-sm font-medium text-white">Profiles</p>
                <p className="text-xs text-surface-400">{hasProfiles ? `${profiles.length} profile(s)` : 'Create a profile'}</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      <div>
        <h2 className="text-lg font-display font-semibold text-white mb-4">Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link to={hasProfiles ? `/questionnaire/${profile!.id}/${cat.slug}` : '/profiles/new'}>
                <Card hover padding="sm" className="text-center">
                  <div className="text-2xl mb-1">{CATEGORY_EMOJIS[cat.slug]}</div>
                  <p className="text-xs font-medium text-white">{cat.name}</p>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {!hasProfiles && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="text-4xl mb-4">👤</div>
          <h3 className="text-xl font-semibold text-white mb-2">Create your first profile</h3>
          <p className="text-surface-400 mb-6">Set up a profile to start questionnaires and get personalized recommendations.</p>
          <Link
            to="/profiles/new"
            className="inline-flex px-6 py-3 gradient-bg text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
          >
            Create Profile
          </Link>
        </motion.div>
      )}
    </div>
  );
}
