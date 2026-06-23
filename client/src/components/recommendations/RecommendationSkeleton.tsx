import { motion } from 'framer-motion';

export function RecommendationSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="card-gradient rounded-2xl p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-surface-700 animate-pulse" />
              <div className="space-y-2">
                <div className="w-40 h-4 bg-surface-700 rounded animate-pulse" />
                <div className="w-20 h-3 bg-surface-700 rounded animate-pulse" />
              </div>
            </div>
            <div className="w-12 h-5 bg-surface-700 rounded animate-pulse" />
          </div>
          <div className="space-y-2 mb-4">
            <div className="w-full h-3 bg-surface-700 rounded animate-pulse" />
            <div className="w-3/4 h-3 bg-surface-700 rounded animate-pulse" />
          </div>
          <div className="w-full h-16 bg-surface-700/50 rounded-xl animate-pulse" />
        </motion.div>
      ))}
    </div>
  );
}
