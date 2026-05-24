'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { s } from '@/lib/spacing';

interface LoadingButtonProps {
  isLoading?: boolean;
  loadingText?: ReactNode;
  children: ReactNode;
  variant?: 'gold' | 'outline-gold' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseEnter?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function LoadingButton({
  isLoading = false,
  loadingText,
  children,
  variant = 'gold',
  size = 'md',
  disabled,
  className = '',
  style,
  type = 'button',
  onClick,
  onMouseEnter,
  onMouseLeave,
}: LoadingButtonProps) {
  const variantClasses = {
    gold: 'btn-gold',
    'outline-gold': 'btn-outline-gold',
    secondary: 'btn-secondary',
  };

  const sizeClasses = {
    sm: { padding: `${s(2)} ${s(4)}`, fontSize: 'text-sm' },
    md: { padding: `${s(3)} ${s(6)}`, fontSize: 'text-base' },
    lg: { padding: `${s(4)} ${s(8)}`, fontSize: 'text-lg' },
  };

  const sizeStyle = sizeClasses[size];

  return (
    <motion.button
      whileTap={{ scale: isLoading ? 1 : 0.98 }}
      disabled={disabled || isLoading}
      type={type}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${className} ${sizeStyle.fontSize}`}
      style={{
        ...sizeStyle,
        ...style,
      }}
    >
      {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
      <motion.span
        initial={false}
        animate={{ opacity: isLoading ? 0.7 : 1 }}
      >
        {isLoading && loadingText ? loadingText : children}
      </motion.span>
    </motion.button>
  );
}
