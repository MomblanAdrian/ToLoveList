import { useState, useEffect } from 'react';
import { apiRequest } from '../services/api';
import { Button } from '../components/ui/Button';
import { CATEGORIES, CATEGORY_EMOJIS } from '../constants/categories';
import { useAuthStore } from '../store/authStore';
import { useProfiles } from '../hooks/useProfiles';

export function AIDebug() {
  const [selectedCategory, setSelectedCategory] = useState('food');
  const [selectedProfileId, setSelectedProfileId] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [userPrompt, setUserPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingPrompts, setLoadingPrompts] = useState(false);

  const { data: profiles } = useProfiles();

  useEffect(() => {
    if (!profiles || selectedProfileId) return;
    const first = profiles[0];
    if (first) setSelectedProfileId(first.id);
  }, [profiles, selectedProfileId]);

  const loadPrompts = async () => {
    setLoadingPrompts(true);
    setError('');
    try {
      const params = selectedProfileId ? `?profileId=${selectedProfileId}` : '';
      const data = await apiRequest<{
        category: string;
        systemPrompt: string;
        userPrompt: string;
        profiles: Array<{ name: string; answers: Array<{ questionText: string; value: number }> }>;
      }>(`/debug/prompt/${selectedCategory}${params}`);
      setSystemPrompt(data.systemPrompt);
      setUserPrompt(data.userPrompt);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load prompts');
    } finally {
      setLoadingPrompts(false);
    }
  };

  const runAi = async () => {
    setLoading(true);
    setError('');
    setResponse('');
    try {
      const data = await apiRequest<{ response: string }>('/debug/ai-test', {
        method: 'POST',
        body: JSON.stringify({ systemPrompt, userPrompt }),
      });
      setResponse(data.response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-white">AI Prompt Debug</h1>
        <p className="text-surface-400 mt-1">Test prompts and see AI responses</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm text-surface-400 mb-2">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-surface-800 border border-surface-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary-500"
          >
            {CATEGORIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {CATEGORY_EMOJIS[c.slug]} {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-surface-400 mb-2">Profile</label>
          <select
            value={selectedProfileId}
            onChange={(e) => setSelectedProfileId(e.target.value)}
            className="w-full bg-surface-800 border border-surface-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary-500"
          >
            <option value="">Sample data (no profile)</option>
            {profiles?.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      <Button onClick={loadPrompts} variant="secondary" loading={loadingPrompts} className="mb-6">
        Load Prompts
      </Button>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm text-surface-400 mb-2">System Prompt</label>
          <textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            rows={8}
            className="w-full bg-surface-800 border border-surface-700 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-primary-500 resize-y"
            placeholder="Load prompts to see the system prompt..."
          />
        </div>

        <div>
          <label className="block text-sm text-surface-400 mb-2">User Prompt</label>
          <textarea
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            rows={10}
            className="w-full bg-surface-800 border border-surface-700 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-primary-500 resize-y"
            placeholder="Load prompts to see the user prompt..."
          />
        </div>
      </div>

      <Button onClick={runAi} loading={loading} className="mb-8">
        Send to AI
      </Button>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 mb-4">
          {error}
        </div>
      )}

      {response && (
        <div>
          <label className="block text-sm text-surface-400 mb-2">AI Response</label>
          <div className="bg-surface-800 border border-surface-700 rounded-xl p-4 text-white font-mono text-sm whitespace-pre-wrap">
            {response}
          </div>
        </div>
      )}
    </div>
  );
}
