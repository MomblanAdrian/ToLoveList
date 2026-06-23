import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useGroups, useCreateGroup } from '../hooks/useGroups';
import { useProfiles } from '../hooks/useProfiles';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export function GroupSetup() {
  const { data: groups, isLoading: groupsLoading } = useGroups();
  const { data: profiles } = useProfiles();
  const createGroup = useCreateGroup();
  const navigate = useNavigate();

  const [showCreate, setShowCreate] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [selectedProfileIds, setSelectedProfileIds] = useState<string[]>([]);

  if (groupsLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const toggleProfile = (id: string) => {
    setSelectedProfileIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  const handleCreate = async () => {
    if (!groupName || selectedProfileIds.length < 2) return;
    try {
      const group = await createGroup.mutateAsync({
        name: groupName,
        profileIds: selectedProfileIds,
      });
      setShowCreate(false);
      setGroupName('');
      setSelectedProfileIds([]);
      navigate(`/groups/${group.id}`);
    } catch {}
  };

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-display font-bold text-white">Groups</h1>
          <p className="text-surface-400 mt-1">Combine profiles for group recommendations</p>
        </motion.div>
        <Button onClick={() => setShowCreate(true)} disabled={!profiles || profiles.length < 2}>
          Create Group
        </Button>
      </div>

      {showCreate && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-gradient rounded-2xl p-6 mb-8 space-y-4"
        >
          <input
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Group name"
            className="w-full px-4 py-2.5 bg-surface-800 border border-surface-700 rounded-xl text-white placeholder-surface-500 focus:outline-none focus:border-primary-500"
            maxLength={100}
          />

          <div>
            <p className="text-sm text-surface-400 mb-2">
              Select profiles (2-5){' '}
              <span className="text-surface-500">({selectedProfileIds.length} selected)</span>
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {profiles?.map((p) => (
                <button
                  key={p.id}
                  onClick={() => toggleProfile(p.id)}
                  className={`p-3 rounded-xl text-sm font-medium transition-all ${
                    selectedProfileIds.includes(p.id)
                      ? 'gradient-bg text-white'
                      : 'bg-surface-800 text-surface-400 hover:text-white'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleCreate} disabled={!groupName || selectedProfileIds.length < 2} loading={createGroup.isPending}>
              Create Group
            </Button>
            <Button variant="ghost" onClick={() => setShowCreate(false)}>
              Cancel
            </Button>
          </div>
        </motion.div>
      )}

      {groups && groups.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {groups.map((group, i) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link to={`/groups/${group.id}`}>
                <Card hover>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center text-sm font-bold text-primary-400">
                      {group.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{group.name}</h3>
                      <p className="text-xs text-surface-500">
                        {group.profiles.length} member{group.profiles.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {group.profiles.map((gp) => (
                      <span
                        key={gp.profileId}
                        className="px-2 py-0.5 rounded-full bg-surface-800 text-xs text-surface-400"
                      >
                        {gp.profile.name}
                      </span>
                    ))}
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="text-4xl mb-4">👥</div>
          <h3 className="text-xl font-semibold text-white mb-2">No groups yet</h3>
          <p className="text-surface-400 mb-6">
            Create profiles first, then combine them into a group for shared recommendations.
          </p>
        </motion.div>
      )}
    </div>
  );
}
