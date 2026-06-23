import { CATEGORY_EMOJIS } from '../../constants/categories';

interface CategoryIconProps {
  slug: string;
  size?: 'sm' | 'md' | 'lg';
}

export function CategoryIcon({ slug, size = 'md' }: CategoryIconProps) {
  const sizes = { sm: 'text-xl', md: 'text-2xl', lg: 'text-4xl' };
  return <span className={sizes[size]}>{CATEGORY_EMOJIS[slug] || '💡'}</span>;
}
