import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCreateProfile } from '../hooks/useProfiles';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function CreateProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const createProfile = useCreateProfile();
  const [name, setName] = useState('');
  const [relationshipType, setRelationshipType] = useState<'single' | 'couple' | 'group'>('single');
  const [error, setError] = useState('');

  const isEditing = !!id;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await createProfile.mutateAsync({ name, relationshipType });
      navigate('/profiles');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create profile');
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-lg mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-bold text-white mb-2">
          {isEditing ? 'Edit Profile' : 'Create Profile'}
        </h1>
        <p className="text-surface-400 mb-8">
          {isEditing ? 'Update your profile details' : 'Set up a new profile for personalized recommendations'}
        </p>

        <form onSubmit={handleSubmit} className="card-gradient rounded-2xl p-8 space-y-6">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
              {error}
            </div>
          )}

          <Input
            label="Profile Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Me, Partner, Friend 1"
            required
          />

          <div>
            <label className="block text-sm font-medium text-surface-300 mb-2">
              Relationship Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['single', 'couple', 'group'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setRelationshipType(type)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium capitalize transition-all ${
                    relationshipType === type
                      ? 'gradient-bg text-white shadow-lg shadow-primary-500/25'
                      : 'bg-surface-800 text-surface-400 hover:text-white hover:bg-surface-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" fullWidth loading={createProfile.isPending}>
            {isEditing ? 'Save Changes' : 'Create Profile'}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
