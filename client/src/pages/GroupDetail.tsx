import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGroups } from '../hooks/useGroups';
import { Card } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { CATEGORIES, CATEGORY_EMOJIS, CATEGORY_GRADIENTS } from '../constants/categories';

export function GroupDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: groups, isLoading } = useGroups();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const group = groups?.find((g) => g.id === id);
  if (!group) {
    return (
      <div className="p-8 text-center">
        <p className="text-surface-400">Group not found</p>
        <Link to="/groups" className="text-primary-400 mt-2 inline-block">Back to groups</Link>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-full gradient-bg flex items-center justify-center text-xl font-bold text-white">
            {group.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-white">{group.name}</h1>
            <p className="text-surface-400">{group.profiles.length} members</p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-3">Members</h2>
          <div className="flex flex-wrap gap-2">
            {group.profiles.map((gp) => (
              <span
                key={gp.profileId}
                className="px-3 py-1.5 rounded-xl bg-surface-800 text-sm text-surface-300"
              >
                {gp.profile.name}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Get Recommendations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={`/recommendations/group/${group.id}/${cat.slug}`}>
                  <Card hover>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{CATEGORY_EMOJIS[cat.slug]}</span>
                      <div>
                        <p className="text-sm font-medium text-white">{cat.name}</p>
                        <p className="text-xs text-surface-500">{cat.description}</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
