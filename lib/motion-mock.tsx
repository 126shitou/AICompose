'use client';

import { ReactNode } from 'react';

// This is a minimal mock of framer-motion to avoid adding another dependency
// In a production app, you would install framer-motion

interface MotionProps {
  children: ReactNode;
  className?: string;
  initial?: any;
  animate?: any;
  exit?: any;
  transition?: any;
  style?: React.CSSProperties;
  [key: string]: any;
}

// Simple mock components for motion
export const motion = {
  div: ({ children, className, style, ...props }: MotionProps) => (
    <div className={className} style={style}>
      {children}
    </div>
  ),
  h1: ({ children, className, style, ...props }: MotionProps) => (
    <h1 className={className} style={style}>
      {children}
    </h1>
  ),
  p: ({ children, className, style, ...props }: MotionProps) => (
    <p className={className} style={style}>
      {children}
    </p>
  ),
  span: ({ children, className, style, ...props }: MotionProps) => (
    <span className={className} style={style}>
      {children}
    </span>
  ),
  button: ({ children, className, style, ...props }: MotionProps) => (
    <button className={className} style={style} {...props}>
      {children}
    </button>
  ),
};

// Helper function for className concatenation
export function cn(...inputs: any[]): string {
  return inputs.filter(Boolean).join(' ');
}