import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuestions, useSubmitAnswer } from '../hooks/useQuestions';
import { Button } from '../components/ui/Button';
import { Slider } from '../components/ui/Slider';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { CATEGORIES, CATEGORY_EMOJIS } from '../constants/categories';

export function Questionnaire() {
  const { profileId, categorySlug } = useParams<{ profileId: string; categorySlug: string }>();
  const navigate = useNavigate();
  const { data: questions, isLoading } = useQuestions(categorySlug || '');
  const submitAnswer = useSubmitAnswer();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const category = CATEGORIES.find((c) => c.slug === categorySlug);

  const currentQuestion = questions?.[currentIndex];
  const progress = questions ? ((Object.keys(answers).length) / questions.length) * 100 : 0;
  const isComplete = questions && Object.keys(answers).length >= questions.length;

  const handleValueChange = useCallback((value: number) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  }, [currentQuestion]);

  const handleNext = async () => {
    if (!currentQuestion) return;

    const value = answers[currentQuestion.id];
    if (value !== undefined) {
      try {
        await submitAnswer.mutateAsync({
          profileId: profileId!,
          questionId: currentQuestion.id,
          value,
        });
      } catch {}
    }

    if (questions && currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    if (currentQuestion && answers[currentQuestion.id] !== undefined) {
      try {
        await submitAnswer.mutateAsync({
          profileId: profileId!,
          questionId: currentQuestion.id,
          value: answers[currentQuestion.id]!,
        });
      } catch {}
    }
    setIsSubmitting(false);
    navigate(`/recommendations/${profileId}/${categorySlug}`);
  };

  const handleSkip = () => {
    if (questions && currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!category || !questions) {
    return (
      <div className="p-8 text-center text-surface-400">
        Category not found
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">{CATEGORY_EMOJIS[category.slug]}</span>
          <div>
            <h1 className="text-2xl font-display font-bold text-white">{category.name} Questionnaire</h1>
            <p className="text-sm text-surface-400">{category.description}</p>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-surface-400 mb-2">
            <span>Question {currentIndex + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <div className="h-2 bg-surface-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="card-gradient rounded-2xl p-8"
        >
          {currentQuestion && (
            <div className="space-y-8">
              <div>
                <span className="text-xs text-primary-400 font-medium">#{currentIndex + 1}</span>
                <h2 className="text-xl font-semibold text-white mt-1">
                  {currentQuestion.text}
                </h2>
              </div>

              <Slider
                value={answers[currentQuestion.id] ?? 50}
                onChange={handleValueChange}
                label="Your preference"
              />

              <div className="flex gap-3 pt-4">
                {currentIndex < questions.length - 1 ? (
                  <>
                    <Button
                      onClick={handleNext}
                      fullWidth
                      disabled={answers[currentQuestion.id] === undefined}
                    >
                      Next Question
                    </Button>
                    <Button variant="ghost" onClick={handleSkip}>
                      Skip
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={handleComplete}
                    fullWidth
                    loading={isSubmitting}
                  >
                    Complete & Get Recommendations
                  </Button>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
