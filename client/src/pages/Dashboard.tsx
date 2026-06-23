import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useProfiles } from '../hooks/useProfiles';
import { useGroups } from '../hooks/useGroups';
import { useAuthStore } from '../store/authStore';
import { Card } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { CATEGORIES, CATEGORY_EMOJIS } from '../constants/categories';

export function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const { data: profiles, isLoading: profilesLoading } = useProfiles();
  const { data: groups, isLoading: groupsLoading } = useGroups();

  if (profilesLoading || groupsLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-display font-bold text-white">
          Welcome, {user?.username}
        </h1>
        <p className="text-surface-400 mt-1">Here's your recommendation overview</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-surface-400">Profiles</p>
            <span className="text-2xl">{profiles?.length || 0}</span>
          </div>
          <p className="text-xs text-surface-500">
            {!profiles?.length ? 'Create your first profile to get started' : 'Manage your profiles'}
          </p>
          <Link
            to="/profiles"
            className="mt-4 inline-block text-sm text-primary-400 hover:text-primary-300 transition-colors"
          >
            Manage Profiles →
          </Link>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-surface-400">Groups</p>
            <span className="text-2xl">{groups?.length || 0}</span>
          </div>
          <p className="text-xs text-surface-500">
            {!groups?.length ? 'Create a group to combine profiles' : 'View and manage groups'}
          </p>
          <Link
            to="/groups"
            className="mt-4 inline-block text-sm text-primary-400 hover:text-primary-300 transition-colors"
          >
            Manage Groups →
          </Link>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-surface-400">Categories</p>
            <span className="text-2xl">{CATEGORIES.length}</span>
          </div>
          <p className="text-xs text-surface-500">Explore recommendations across all categories</p>
          <Link
            to="/categories"
            className="mt-4 inline-block text-sm text-primary-400 hover:text-primary-300 transition-colors"
          >
            Explore →
          </Link>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-display font-semibold text-white mb-4">Quick Access</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link to={`/categories`}>
                <Card hover padding="sm" className="text-center">
                  <div className="text-2xl mb-1">{CATEGORY_EMOJIS[cat.slug]}</div>
                  <p className="text-xs font-medium text-white">{cat.name}</p>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {profiles && profiles.length > 0 && (
        <div>
          <h2 className="text-xl font-display font-semibold text-white mb-4">Your Profiles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {profiles.map((profile, i) => (
              <motion.div
                key={profile.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={`/profiles/${profile.id}`}>
                  <Card hover>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center text-sm font-medium text-primary-400">
                        {profile.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{profile.name}</p>
                        <p className="text-xs text-surface-500 capitalize">{profile.relationshipType}</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {(!profiles || profiles.length === 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="text-4xl mb-4">👤</div>
          <h3 className="text-xl font-semibold text-white mb-2">Create your first profile</h3>
          <p className="text-surface-400 mb-6">Set up a profile to start the questionnaire and get personalized recommendations.</p>
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
