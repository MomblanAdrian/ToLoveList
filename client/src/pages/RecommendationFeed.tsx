import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useRecommendations, useGenerateRecommendations } from '../hooks/useRecommendations';
import { useProfiles } from '../hooks/useProfiles';
import { useLocation } from '../hooks/useLocation';
import { RecommendationCard } from '../components/recommendations/RecommendationCard';
import { RecommendationSkeleton } from '../components/recommendations/RecommendationSkeleton';
import { CategoryIcon } from '../components/recommendations/CategoryIcon';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { CATEGORIES, CATEGORY_EMOJIS } from '../constants/categories';

export function RecommendationFeed() {
  const { profileId, categorySlug } = useParams<{ profileId: string; categorySlug: string }>();
  const { data: existingRecommendations, isLoading: recsLoading } = useRecommendations(
    profileId || '',
    categorySlug,
  );
  const generateRecs = useGenerateRecommendations();
  const { data: profiles } = useProfiles();
  const location = useLocation();

  const [showGenerate, setShowGenerate] = useState(false);
  const [selectedProfileIds, setSelectedProfileIds] = useState<string[]>([profileId || '']);

  const category = CATEGORIES.find((c) => c.slug === categorySlug);
  const profile = profiles?.find((p) => p.id === profileId);

  useEffect(() => {
    if (profileId) {
      setSelectedProfileIds([profileId]);
    }
  }, [profileId]);

  const handleGenerate = async () => {
    if (!categorySlug || selectedProfileIds.length === 0) return;

    try {
      await generateRecs.mutateAsync({
        categorySlug,
        profileIds: selectedProfileIds,
        location: location.city ? { city: location.city } : undefined,
      });
    } catch {}
  };

  if (recsLoading) {
    return (
      <div className="p-4 lg:p-8 max-w-3xl mx-auto">
        <LoadingSpinner size="lg" />
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
              {profile ? `For ${profile.name}` : 'Personalized for you'}
            </p>
          </div>
        </div>
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

            {!showGenerate ? (
              <Button
                size="sm"
                onClick={() => setShowGenerate(true)}
                loading={generateRecs.isPending}
              >
                {existingRecommendations?.length ? 'Regenerate' : 'Generate Recommendations'}
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleGenerate}
                loading={generateRecs.isPending}
              >
                Generate Now
              </Button>
            )}
          </div>
        </Card>
      </div>

      <AnimatePresence>
        {showGenerate && profiles && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <Card>
              <p className="text-sm text-surface-400 mb-3">
                Select profiles to include (combine preferences):
              </p>
              <div className="flex flex-wrap gap-2">
                {profiles.map((p) => (
                  <button
                    key={p.id}
                    onClick={() =>
                      setSelectedProfileIds((prev) =>
                        prev.includes(p.id)
                          ? prev.filter((id) => id !== p.id)
                          : [...prev, p.id],
                      )
                    }
                    className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                      selectedProfileIds.includes(p.id)
                        ? 'gradient-bg text-white'
                        : 'bg-surface-800 text-surface-400 hover:text-white'
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {generateRecs.isPending ? (
        <RecommendationSkeleton />
      ) : existingRecommendations && existingRecommendations.length > 0 ? (
        <div className="space-y-4">
          {existingRecommendations.map((rec, i) => (
            <RecommendationCard key={rec.id} recommendation={rec} index={i} />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="text-5xl mb-4">{CATEGORY_EMOJIS[categorySlug || ''] || '💡'}</div>
          <h3 className="text-xl font-semibold text-white mb-2">No recommendations yet</h3>
          <p className="text-surface-400 mb-6">
            Complete the questionnaire first, then generate AI-powered recommendations.
          </p>
          <div className="flex items-center justify-center gap-3">
            {profileId && categorySlug && (
              <Link to={`/questionnaire/${profileId}/${categorySlug}`}>
                <Button>Take Questionnaire</Button>
              </Link>
            )}
            <Button onClick={handleGenerate} variant="secondary" loading={generateRecs.isPending}>
              Generate Now
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
