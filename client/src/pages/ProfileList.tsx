import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useProfiles, useDeleteProfile } from '../hooks/useProfiles';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export function ProfileList() {
  const { data: profiles, isLoading } = useProfiles();
  const deleteProfile = useDeleteProfile();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this profile?')) {
      await deleteProfile.mutateAsync(id);
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-display font-bold text-white">Profiles</h1>
          <p className="text-surface-400 mt-1">Manage your profiles and preferences</p>
        </motion.div>
        <Link to="/profiles/new">
          <Button>New Profile</Button>
        </Link>
      </div>

      {profiles && profiles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {profiles.map((profile, i) => (
            <motion.div
              key={profile.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card hover onClick={() => navigate(`/profiles/${profile.id}`)}>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-primary-500/20 flex items-center justify-center text-xl font-bold text-primary-400">
                    {profile.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">{profile.name}</h3>
                    <p className="text-sm text-surface-400 capitalize">{profile.relationshipType}</p>
                    {profile.avatarUrl && (
                      <p className="text-xs text-surface-500 mt-1">Has avatar</p>
                    )}
                  </div>
                  <button
                    onClick={(e) => handleDelete(profile.id, e)}
                    className="p-2 text-surface-500 hover:text-red-400 transition-colors"
                    title="Delete profile"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                    </svg>
                  </button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="text-4xl mb-4">👤</div>
          <h3 className="text-xl font-semibold text-white mb-2">No profiles yet</h3>
          <p className="text-surface-400 mb-6">Create a profile to start getting personalized recommendations.</p>
          <Link to="/profiles/new">
            <Button>Create Your First Profile</Button>
          </Link>
        </motion.div>
      )}
    </div>
  );
}
