import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  useGroupRecommendations,
  useGenerateRecommendations,
} from '../hooks/useRecommendations';
import { useGroups } from '../hooks/useGroups';
import { useLocation } from '../hooks/useLocation';
import { RecommendationCard } from '../components/recommendations/RecommendationCard';
import { RecommendationSkeleton } from '../components/recommendations/RecommendationSkeleton';
import { CategoryIcon } from '../components/recommendations/CategoryIcon';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { CATEGORIES } from '../constants/categories';

export function RecommendationDetail() {
  const { groupId, categorySlug } = useParams<{ groupId: string; categorySlug: string }>();
  const { data: recommendations, isLoading } = useGroupRecommendations(
    groupId || '',
    categorySlug,
  );
  const generateRecs = useGenerateRecommendations();
  const { data: groups } = useGroups();
  const location = useLocation();

  const [removedRecIds, setRemovedRecIds] = useState<Set<string>>(new Set());
  const [generateError, setGenerateError] = useState<string | null>(null);

  const category = CATEGORIES.find((c) => c.slug === categorySlug);
  const group = groups?.find((g) => g.id === groupId);

  const handleGenerate = async () => {
    if (!categorySlug || !groupId || !group) return;
    setGenerateError(null);

    try {
      await generateRecs.mutateAsync({
        categorySlug,
        profileIds: group.profiles.map((gp) => gp.profileId),
        groupId,
        location: location.city
          ? { city: location.city, lat: location.lat, lng: location.lng }
          : undefined,
      });
    } catch (err) {
      setGenerateError(err instanceof Error ? err.message : 'Failed to generate recommendations');
    }
  };

  const handleStatusUpdate = (id: string) => {
    setRemovedRecIds((prev) => new Set(prev).add(id));
  };

  const visibleRecs = recommendations?.filter((r) => !removedRecIds.has(r.id));

  if (isLoading) {
    return (
      <div className="p-4 lg:p-8 max-w-3xl mx-auto">
        <RecommendationSkeleton />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <CategoryIcon slug={categorySlug || ''} size="lg" />
          <div>
            <h1 className="text-3xl font-display font-bold text-white">
              {category?.name || 'Recommendations'}
            </h1>
            <p className="text-surface-400">
              {group ? `For ${group.name}` : 'Group recommendations'}
            </p>
          </div>
        </div>

        {group && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {group.profiles.map((gp) => (
              <span
                key={gp.profileId}
                className="px-2 py-0.5 rounded-full bg-surface-800 text-xs text-surface-400"
              >
                {gp.profile.name}
              </span>
            ))}
          </div>
        )}
      </motion.div>

      <div className="mb-6">
        <Card padding="sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-surface-400 text-sm">📍</span>
              {location.loading ? (
                <span className="text-sm text-surface-500">Detecting location...</span>
              ) : location.city ? (
                <span className="text-sm text-surface-300">{location.city}</span>
              ) : (
                <span className="text-sm text-surface-500">Location not set</span>
              )}
            </div>
            <Button
              size="sm"
              onClick={handleGenerate}
              loading={generateRecs.isPending}
            >
              {recommendations?.length ? 'Regenerate' : 'Generate'}
            </Button>
          </div>
        </Card>
      </div>

      {generateError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400"
        >
          {generateError}
        </motion.div>
      )}

      {generateRecs.isPending ? (
        <RecommendationSkeleton />
      ) : visibleRecs && visibleRecs.length > 0 ? (
        <div className="space-y-4">
          {visibleRecs.map((rec, i) => (
            <RecommendationCard key={rec.id} recommendation={rec} index={i} onStatusUpdate={handleStatusUpdate} />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="text-5xl mb-4">{'👥'}</div>
          <h3 className="text-xl font-semibold text-white mb-2">No group recommendations yet</h3>
          <p className="text-surface-400 mb-6">
            Click generate to get AI-powered recommendations based on all group members' preferences.
          </p>
          <Button onClick={handleGenerate} loading={generateRecs.isPending}>
            Generate Group Recommendations
          </Button>
        </motion.div>
      )}
    </div>
  );
}
