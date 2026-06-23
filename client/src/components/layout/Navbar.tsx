import { useUIStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import { useLogout } from '../../hooks/useAuth';

export function Navbar() {
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();

  return (
    <header className="sticky top-0 z-30 bg-surface-950/80 backdrop-blur-xl border-b border-surface-800/50">
      <div className="flex items-center justify-between px-4 lg:px-6 h-16">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 -ml-2 text-surface-400 hover:text-white transition-colors"
          aria-label="Toggle sidebar"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>

        <div className="hidden lg:flex items-center gap-2">
          <span className="text-sm text-surface-400">Welcome,</span>
          <span className="text-sm font-medium text-white">{user?.username}</span>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <button
            onClick={() => logout.mutate()}
            className="px-4 py-2 text-sm text-surface-400 hover:text-white transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}
