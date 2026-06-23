import { motion } from 'framer-motion';
import type { Recommendation } from '@tolovelist/shared';
import { CATEGORY_EMOJIS } from '../../constants/categories';

interface RecommendationCardProps {
  recommendation: Recommendation;
  index: number;
}

export function RecommendationCard({ recommendation, index }: RecommendationCardProps) {
  const scoreColor =
    recommendation.compatibilityScore >= 80
      ? 'from-emerald-500 to-emerald-400'
      : recommendation.compatibilityScore >= 60
      ? 'from-yellow-500 to-yellow-400'
      : 'from-orange-500 to-orange-400';

  const metadata = recommendation.metadata as Record<string, unknown>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="card-gradient rounded-2xl overflow-hidden hover:border-primary-500/30 transition-all duration-300 group"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl">
              {CATEGORY_EMOJIS[recommendation.categorySlug] || '💡'}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white group-hover:text-primary-400 transition-colors">
                {recommendation.title}
              </h3>
              <p className="text-xs text-surface-500">AI Generated</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <div
              className={`h-2 w-2 rounded-full bg-gradient-to-r ${scoreColor}`}
            />
            <span className="text-sm font-semibold text-white">
              {Math.round(recommendation.compatibilityScore)}%
            </span>
          </div>
        </div>

        <p className="text-sm text-surface-300 leading-relaxed mb-4">
          {recommendation.description}
        </p>

        <div className="p-3 rounded-xl bg-surface-800/50 border border-surface-700/50 mb-4">
          <p className="text-xs text-surface-500 mb-1">Why this match</p>
          <p className="text-sm text-surface-300">{recommendation.whyMatch}</p>
        </div>

        {Object.keys(metadata).length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(metadata).slice(0, 4).map(([key, value]) => {
              if (!value) return null;
              const strValue = String(value);
              if (strValue.length > 30) return null;
              return (
                <span
                  key={key}
                  className="px-2 py-0.5 rounded-full bg-surface-800 text-xs text-surface-400 capitalize"
                >
                  {key.replace(/([A-Z])/g, ' $1').trim()}: {strValue}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
