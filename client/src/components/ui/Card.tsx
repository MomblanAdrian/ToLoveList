import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  padding?: 'sm' | 'md' | 'lg';
}

export function Card({ children, className = '', hover, onClick, padding = 'md' }: CardProps) {
  const paddings = {
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6',
  };

  return (
    <motion.div
      className={`card-gradient rounded-2xl ${paddings[padding]} ${hover ? 'cursor-pointer glass-hover' : ''} ${className}`}
      whileHover={hover ? { y: -2, transition: { duration: 0.2 } } : undefined}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
