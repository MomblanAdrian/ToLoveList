import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES, CATEGORY_EMOJIS } from '../constants/categories';

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
};

const stagger = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: 'easeOut' },
};

function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-rose-500/10 blur-[120px] animate-glow" />
      <div className="absolute top-1/3 -right-32 w-80 h-80 rounded-full bg-amber-500/8 blur-[100px] animate-glow" style={{ animationDelay: '1.5s' }} />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-primary-500/8 blur-[80px] animate-glow" style={{ animationDelay: '3s' }} />
    </div>
  );
}

function NavBar() {
  return (
    <nav className="relative z-20 flex items-center justify-between px-5 py-5 max-w-6xl mx-auto">
      <Link to="/" className="flex items-center gap-2.5 group">
        <img src="/logo.png" alt="ToLoveList" className="w-9 h-9 rounded-xl object-cover shadow-lg shadow-rose-500/20 group-hover:shadow-rose-500/30 transition-shadow" />
        <span className="text-lg font-semibold text-warm-50 tracking-tight">ToLoveList</span>
      </Link>
      <div className="flex items-center gap-2">
        <Link to="/login" className="hidden sm:inline-flex px-4 py-2 text-sm text-warm-300 hover:text-warm-50 transition-colors">
          Sign In
        </Link>
        <Link to="/register" className="px-5 py-2 text-sm font-medium gradient-bg text-white rounded-xl shadow-lg shadow-rose-500/20 hover:shadow-rose-500/30 hover:scale-[1.02] transition-all">
          Get Started
        </Link>
      </div>
    </nav>
  );
}

function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <FloatingOrbs />
      <div className="absolute inset-0 bg-gradient-to-b from-surface-950 via-surface-950 to-surface-950/95" />

      <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 max-w-4xl mx-auto px-5 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mb-8"
        >
          <img src="/logo.png" alt="ToLoveList" className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-2xl shadow-2xl shadow-rose-500/20" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm mb-8"
        >
          <span className="text-rose-400 text-base leading-none">✦</span>
          For couples, friends &amp; groups
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display text-warm-50 leading-[1.1] tracking-tight mb-6"
        >
          Discover things
          <br />
          <span className="italic text-rose-300">you'll love</span>{' '}
          <span className="gradient-text">together</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="text-lg sm:text-xl text-warm-400 max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Answer a few questions and let AI find the perfect restaurants, activities, getaways, and more — tailored to what you both love.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/register"
            className="group relative px-8 py-3.5 gradient-bg text-white rounded-2xl font-semibold text-base shadow-xl shadow-rose-500/25 hover:shadow-rose-500/40 hover:scale-[1.02] transition-all"
          >
            <span className="relative z-10">Start your journey</span>
            <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
          <Link
            to="/login"
            className="px-8 py-3.5 text-base font-medium text-warm-300 border border-surface-700/50 rounded-2xl hover:border-surface-600/50 hover:text-warm-50 transition-all"
          >
            Sign In
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-16 flex items-center justify-center gap-8 text-sm text-warm-500"
        >
          <span className="flex items-center gap-1.5">
            <span className="text-rose-400">✦</span> Smart profiles
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-rose-400">✦</span> AI powered
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-rose-400">✦</span> Real suggestions
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { num: '01', emoji: '📋', title: 'Answer a few questions', desc: 'Tell us what you like across different categories — food, travel, entertainment, and more.' },
    { num: '02', emoji: '🧠', title: 'AI learns your taste', desc: 'Our engine analyzes your preferences and finds the perfect matches for you and your partner.' },
    { num: '03', emoji: '💡', title: 'Get recommendations', desc: 'Receive personalized suggestions with addresses, ratings, and why they\'re a great fit.' },
  ];

  return (
    <section className="relative py-28 px-5">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-rose-500/3 to-transparent" />
      <div className="relative z-10 max-w-5xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-16">
          <span className="text-rose-400 text-sm font-medium tracking-widest uppercase">How it works</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display text-warm-50 mt-3 mb-4">
            Three steps to better plans
          </h2>
          <p className="text-warm-400 max-w-lg mx-auto">
            No endless scrolling. No decision fatigue. Just answers that matter.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="relative card-warm rounded-2xl p-8 text-center group card-hover"
            >
              <span className="text-5xl font-display text-rose-500/20 absolute top-4 right-6 leading-none select-none">{step.num}</span>
              <div className="text-4xl mb-5">{step.emoji}</div>
              <h3 className="text-lg font-semibold text-warm-50 mb-3">{step.title}</h3>
              <p className="text-sm text-warm-400 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoriesShowcase() {
  return (
    <section className="relative py-28 px-5">
      <div className="max-w-6xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-16">
          <span className="text-rose-400 text-sm font-medium tracking-widest uppercase">Categories</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display text-warm-50 mt-3 mb-4">
            Every kind of plan, covered
          </h2>
          <p className="text-warm-400 max-w-lg mx-auto">
            From dinner dates to weekend getaways — we've got ideas for every mood.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="card-warm rounded-2xl p-5 sm:p-6 text-center group card-hover cursor-default"
            >
              <div className="text-3xl sm:text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">{CATEGORY_EMOJIS[cat.slug]}</div>
              <h3 className="text-sm font-semibold text-warm-50">{cat.name}</h3>
              <p className="text-xs text-warm-500 mt-1 leading-relaxed line-clamp-2">{cat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ForCouples() {
  return (
    <section className="relative py-28 px-5">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-rose-500/3 to-transparent" />
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="card-warm rounded-3xl p-8 sm:p-12 md:p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-rose-500/5 blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-amber-500/5 blur-[60px]" />

          <motion.div {...fadeUp} className="relative z-10">
            <span className="text-4xl block mb-4">💕</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display text-warm-50 mb-4 leading-tight">
              Made for the two of you
            </h2>
            <p className="text-warm-400 max-w-lg mx-auto mb-8 text-lg leading-relaxed">
              Create profiles for each other, answer together, and let AI find the common ground — so you spend less time planning and more time together.
            </p>
            <Link
              to="/register"
              className="inline-flex px-8 py-3.5 gradient-bg text-white rounded-2xl font-semibold text-base shadow-xl shadow-rose-500/25 hover:shadow-rose-500/40 hover:scale-[1.02] transition-all"
            >
              Get started free
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FooterSection() {
  return (
    <footer className="relative py-12 px-5 border-t border-surface-800/40">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <img src="/logo.png" alt="ToLoveList" className="w-8 h-8 rounded-lg object-cover" />
          <span className="text-sm font-medium text-warm-300">ToLoveList</span>
        </div>
        <p className="text-sm text-warm-500">Made for moments that matter ✦</p>
      </div>
    </footer>
  );
}

export function Landing() {
  return (
    <div className="min-h-screen bg-surface-950 overflow-hidden">
      <NavBar />
      <HeroSection />
      <HowItWorks />
      <CategoriesShowcase />
      <ForCouples />
      <FooterSection />
    </div>
  );
}
