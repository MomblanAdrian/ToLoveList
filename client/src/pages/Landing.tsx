import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../constants/categories';
import { CATEGORY_EMOJIS } from '../constants/categories';

export function Landing() {
  return (
    <div className="min-h-screen bg-surface-950">
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 via-surface-950 to-pink-600/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-500/10 via-transparent to-transparent" />

        <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-lg font-bold">
              T
            </div>
            <span className="text-xl font-display font-bold gradient-text">ToLoveList</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm text-surface-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 text-sm font-medium gradient-bg text-white rounded-xl shadow-lg shadow-primary-500/25 hover:opacity-90 transition-opacity"
            >
              Get Started
            </Link>
          </div>
        </nav>

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6">
              Discover together with{' '}
              <span className="gradient-text">AI-powered</span>{' '}
              recommendations
            </h1>
            <p className="text-lg md:text-xl text-surface-400 mb-10 max-w-2xl mx-auto">
              ToLoveList learns your preferences and generates personalized recommendations
              for restaurants, activities, travel, entertainment, and more — perfect for
              couples, friends, and groups.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="px-8 py-3.5 text-base font-semibold gradient-bg text-white rounded-2xl shadow-lg shadow-primary-500/30 hover:opacity-90 transition-all"
              >
                Start Your Journey
              </Link>
              <Link
                to="/login"
                className="px-8 py-3.5 text-base font-semibold glass text-white rounded-2xl hover:bg-surface-800/70 transition-all"
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </header>

      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Explore recommendation categories
            </h2>
            <p className="text-surface-400 max-w-xl mx-auto">
              Each category has its own dedicated space with personalized AI-generated suggestions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="card-gradient rounded-2xl p-6 hover:border-primary-500/30 transition-all duration-300 cursor-pointer group"
              >
                <div className="text-3xl mb-4">{CATEGORY_EMOJIS[cat.slug]}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{cat.name}</h3>
                <p className="text-sm text-surface-400">{cat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-surface-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Smart Profiles',
                desc: 'Create detailed preference profiles through comprehensive questionnaires covering every category.',
              },
              {
                title: 'Group Intelligence',
                desc: 'Combine profiles for couples and groups. The AI finds shared interests and optimal recommendations.',
              },
              {
                title: 'Real-Time Data',
                desc: 'Recommendations are generated using current information about places, events, and trending content.',
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.15 }}
                className="text-center"
              >
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-surface-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-12 px-6 border-t border-surface-800">
        <div className="max-w-7xl mx-auto text-center text-surface-500 text-sm">
          ToLoveList — AI-Powered Recommendations
        </div>
      </footer>
    </div>
  );
}
