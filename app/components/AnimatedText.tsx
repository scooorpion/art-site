'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedTextProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  variant?: 'fadeInUp' | 'fadeInLeft' | 'fadeInRight' | 'typewriter' | 'stagger';
}

const variants = {
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  },
  fadeInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
  },
  fadeInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
  },
  typewriter: {
    initial: { width: 0 },
    animate: { width: 'auto' },
  },
  stagger: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
  },
};

export default function AnimatedText({
  children,
  className = '',
  delay = 0,
  duration = 0.6,
  variant = 'fadeInUp',
}: AnimatedTextProps) {
  const selectedVariant = variants[variant];

  if (variant === 'stagger' && typeof children === 'string') {
    const words = children.split(' ');
    
    return (
      <motion.div
        className={className}
        initial="initial"
        animate="animate"
        transition={{ staggerChildren: 0.1, delayChildren: delay }}
      >
        {words.map((word, index) => (
          <motion.span
            key={index}
            variants={selectedVariant}
            transition={{ duration }}
            className="inline-block mr-2"
          >
            {word}
          </motion.span>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={selectedVariant.initial}
      animate={selectedVariant.animate}
      transition={{ duration, delay, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

// 特殊的打字机效果组件
export function TypewriterText({
  text,
  className = '',
  delay = 0,
  speed = 0.05,
}: {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
}) {
  return (
    <motion.div
      className={`${className} overflow-hidden whitespace-nowrap`}
      initial={{ width: 0 }}
      animate={{ width: 'auto' }}
      transition={{
        duration: text.length * speed,
        delay,
        ease: 'linear',
      }}
    >
      {text}
    </motion.div>
  );
}

// 渐变文字效果
export function GradientText({
  children,
  className = '',
  gradient = 'from-purple-600 via-pink-600 to-blue-600',
}: {
  children: ReactNode;
  className?: string;
  gradient?: string;
}) {
  return (
    <span
      className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent ${className}`}
    >
      {children}
    </span>
  );
}

// 发光文字效果
export function GlowText({
  children,
  className = '',
  glowColor = 'rgba(168, 85, 247, 0.4)',
}: {
  children: ReactNode;
  className?: string;
  glowColor?: string;
}) {
  return (
    <span
      className={`${className}`}
      style={{
        textShadow: `0 0 10px ${glowColor}, 0 0 20px ${glowColor}, 0 0 30px ${glowColor}`,
      }}
    >
      {children}
    </span>
  );
}