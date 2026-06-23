import { motion, AnimatePresence } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { useUIStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '◉' },
  { to: '/questionnaires', label: 'Questionnaires', icon: '📋' },
  { to: '/recommendations', label: 'Recommendations', icon: '💡' },
  { to: '/profiles', label: 'Profiles', icon: '👤' },
  { to: '/groups', label: 'Groups', icon: '👥' },
];

export function Sidebar() {
  const isOpen = useUIStore((s) => s.isSidebarOpen);
  const setOpen = useUIStore((s) => s.setSidebarOpen);
  const user = useAuthStore((s) => s.user);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed top-0 left-0 bottom-0 w-72 z-50 bg-surface-900 border-r border-surface-800 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-72'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-surface-800">
            <NavLink to="/dashboard" className="flex items-center gap-3" onClick={() => setOpen(false)}>
              <img src="/logo.png" alt="ToLoveList" className="w-10 h-10 rounded-xl object-cover" />
              <span className="text-xl font-display font-bold gradient-text">ToLoveList</span>
            </NavLink>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20'
                      : 'text-surface-400 hover:text-white hover:bg-surface-800/50'
                  }`
                }
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-surface-800">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center text-sm font-medium text-primary-400">
                {user?.username?.charAt(0).toUpperCase() || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.username}</p>
                <p className="text-xs text-surface-500 truncate">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
