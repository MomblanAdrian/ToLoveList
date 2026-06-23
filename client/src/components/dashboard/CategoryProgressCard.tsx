import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CATEGORY_EMOJIS, CATEGORY_GRADIENTS } from '../../constants/categories';
import type { CategoryWithProgress } from '@tolovelist/shared';

interface CategoryProgressCardProps {
  category: CategoryWithProgress;
  profileId: string;
  recommendationCount: number;
  index: number;
}

function ProgressRing({ percent, color }: { percent: number; color: string }) {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <svg width="80" height="80" viewBox="0 0 80 80" className="shrink-0">
      <circle cx="40" cy="40" r={radius} fill="none" stroke="currentColor" strokeWidth="4" className="text-white/10" />
      <motion.circle
        cx="40" cy="40" r={radius}
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
        transform="rotate(-90 40 40)"
      />
      <text x="40" y="40" textAnchor="middle" dominantBaseline="central" className="fill-white text-sm font-semibold" fontSize="14">
        {Math.round(percent)}%
      </text>
    </svg>
  );
}

export function CategoryProgressCard({ category, profileId, recommendationCount, index }: CategoryProgressCardProps) {
  const percent = category.questionCount > 0 ? (category.answeredCount / category.questionCount) * 100 : 0;
  const isComplete = category.answeredCount >= category.questionCount;
  const gradient = CATEGORY_GRADIENTS[category.slug] || 'from-primary-500 to-primary-400';
  const emoji = CATEGORY_EMOJIS[category.slug] || '💡';
  const linkTo = !isComplete
    ? `/questionnaire/${profileId}/${category.slug}`
    : `/recommendations/${profileId}/${category.slug}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
    >
      <Link to={linkTo} className="block group">
        <div className="relative rounded-2xl overflow-hidden bg-surface-900 border border-surface-800 group-hover:border-primary-500/30 transition-all duration-300">
          <div className={`absolute inset-0 opacity-[0.08] bg-gradient-to-br ${gradient}`} />
          <div className="relative p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-3xl mb-1">{emoji}</div>
                <h3 className="text-lg font-semibold text-white group-hover:text-primary-400 transition-colors">
                  {category.name}
                </h3>
              </div>
              <ProgressRing percent={percent} color={category.color} />
            </div>

            <div className="space-y-1 mb-4">
              <p className="text-sm text-surface-400">
                {category.answeredCount}/{category.questionCount} answered
              </p>
              <div className="h-1.5 rounded-full bg-surface-800 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full bg-gradient-to-r ${gradient}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: 0.8, delay: 0.2 + index * 0.08 }}
                />
              </div>
            </div>

            {isComplete ? (
              <div className="flex items-center justify-between">
                <span className="text-sm text-emerald-400 font-medium">
                  {recommendationCount > 0 ? `${recommendationCount} recommendations` : 'No recs yet'}
                </span>
                <span className="text-sm font-medium text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 transition-all duration-200">
                  View →
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-sm text-surface-500">
                  {category.answeredCount === 0 ? 'Not started' : `${category.questionCount - category.answeredCount} remaining`}
                </span>
                <span className="text-sm font-medium text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 transition-all duration-200">
                  {category.answeredCount === 0 ? 'Start →' : 'Continue →'}
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
