import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useLogout } from '../hooks/useAuth';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export function Settings() {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();

  return (
    <div className="p-4 lg:p-8 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-bold text-white mb-8">Settings</h1>

        <div className="space-y-4">
          <Card>
            <h2 className="text-lg font-semibold text-white mb-4">Account</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-surface-400">Email</p>
                <p className="text-white">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-surface-400">Username</p>
                <p className="text-white">{user?.username}</p>
              </div>
              <div>
                <p className="text-sm text-surface-400">Member since</p>
                <p className="text-white">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold text-white mb-4">Preferences</h2>
            <p className="text-sm text-surface-400 mb-4">
              Manage your profiles and questionnaires to improve recommendations.
            </p>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => window.location.href = '/profiles'}>
                Manage Profiles
              </Button>
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold text-white mb-4">Danger Zone</h2>
            <p className="text-sm text-surface-400 mb-4">
              Sign out of your account. Your data will be preserved.
            </p>
            <Button
              variant="danger"
              onClick={() => logout.mutate()}
              loading={logout.isPending}
            >
              Sign Out
            </Button>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
