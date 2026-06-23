import { motion } from 'framer-motion';
import type { Recommendation } from '@tolovelist/shared';
import { CATEGORY_EMOJIS } from '../../constants/categories';

interface RecommendationCardProps {
  recommendation: Recommendation;
  index: number;
}

const META_LABELS: Record<string, string> = {
  address: '📍 Address',
  website: '🔗 Website',
  rating: '⭐ Rating',
  cuisine: '🍽️ Cuisine',
  priceRange: '💰 Price',
  openingHours: '🕐 Hours',
  genre: '🎭 Genre',
  platform: '📺 Platform',
  author: '✍️ Author',
  duration: '⏱ Duration',
  cost: '💵 Cost',
  difficulty: '🎯 Difficulty',
};

export function RecommendationCard({ recommendation, index }: RecommendationCardProps) {
  const scoreColor =
    recommendation.compatibilityScore >= 80
      ? 'from-emerald-500 to-emerald-400'
      : recommendation.compatibilityScore >= 60
      ? 'from-yellow-500 to-yellow-400'
      : 'from-orange-500 to-orange-400';

  const metadata = recommendation.metadata as Record<string, unknown>;

  const address = metadata.address as string | undefined;
  const website = (metadata.website as string) || (metadata.url as string | undefined);

  const filteredEntries = Object.entries(metadata).filter(
    ([key, value]) => value && key !== 'address' && key !== 'website' && key !== 'url',
  );

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

        {address && (
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-800/50 border border-surface-700/50 mb-2 text-sm text-primary-400 hover:text-primary-300 hover:bg-surface-800 transition-colors"
          >
            <span className="text-base">📍</span>
            <span className="flex-1 truncate">{address}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        )}

        {website && (
          <a
            href={website.startsWith('http') ? website : `https://${website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-800/50 border border-surface-700/50 mb-2 text-sm text-primary-400 hover:text-primary-300 hover:bg-surface-800 transition-colors"
          >
            <span className="text-base">🔗</span>
            <span className="flex-1 truncate">{website.replace(/^https?:\/\//, '')}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        )}

        {filteredEntries.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {filteredEntries.slice(0, 6).map(([key, value]) => {
              const strValue = String(value);
              const label = META_LABELS[key] || key.replace(/([A-Z])/g, ' $1').trim();
              return (
                <span
                  key={key}
                  className="px-2 py-0.5 rounded-full bg-surface-800 text-xs text-surface-400"
                >
                  {label}: {strValue.length > 25 ? strValue.slice(0, 25) + '…' : strValue}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
