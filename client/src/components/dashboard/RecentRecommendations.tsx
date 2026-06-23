import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { Recommendation } from '@tolovelist/shared';
import { CATEGORY_EMOJIS } from '../../constants/categories';

interface RecentRecommendationsProps {
  recommendations: Recommendation[];
  profileId: string;
}

export function RecentRecommendations({ recommendations, profileId }: RecentRecommendationsProps) {
  if (recommendations.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-3xl mb-3 opacity-50">💡</div>
        <p className="text-surface-400 text-sm">No recommendations yet</p>
        <p className="text-surface-500 text-xs mt-1">Complete a questionnaire to get started</p>
      </div>
    );
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
      {recommendations.slice(0, 6).map((rec, i) => {
        const emoji = CATEGORY_EMOJIS[rec.categorySlug] || '💡';
        const scoreColor =
          rec.compatibilityScore >= 80
            ? 'text-emerald-400'
            : rec.compatibilityScore >= 60
            ? 'text-yellow-400'
            : 'text-orange-400';

        return (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06, duration: 0.3 }}
            className="shrink-0 w-56"
          >
            <Link
              to={`/recommendations/${profileId}/${rec.categorySlug}`}
              className="block group"
            >
              <div className="rounded-xl bg-surface-900 border border-surface-800 p-4 group-hover:border-primary-500/30 transition-all duration-200 h-full">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{emoji}</span>
                  <span className="text-xs font-medium text-surface-500 uppercase tracking-wider">
                    {rec.categorySlug}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-white group-hover:text-primary-400 transition-colors leading-snug mb-2 line-clamp-2">
                  {rec.title}
                </h4>
                <p className="text-xs text-surface-500 line-clamp-2 mb-3">
                  {rec.whyMatch}
                </p>
                <div className={`text-sm font-bold ${scoreColor}`}>
                  ★ {Math.round(rec.compatibilityScore)}%
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
