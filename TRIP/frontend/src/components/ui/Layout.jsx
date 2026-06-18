import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Utility to merge tailwind classes gracefully */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Section Primitive
 * Defines consistent vertical spacing and semantic HTML grouping for major page blocks.
 */
export const Section = React.forwardRef(({ 
  className, 
  children, 
  id,
  variant = 'default',
  spacing = 'default',
  ...props 
}, ref) => {
  const baseStyles = "w-full relative overflow-hidden";
  
  const variants = {
    default: "bg-transparent",
    primary: "bg-primary-950",
    gradient: "bg-gradient-to-b from-transparent via-primary-900/40 to-transparent",
  };

  const spacings = {
    none: "py-0",
    sm: "py-8 md:py-16",
    default: "py-16 md:py-24",
    lg: "py-24 md:py-32",
    xl: "py-32 md:py-40",
  };

  return (
    <section 
      ref={ref}
      id={id}
      className={cn(baseStyles, variants[variant], spacings[spacing], className)}
      {...props}
    >
      {children}
    </section>
  );
});
Section.displayName = "Section";

/**
 * Container Primitive
 * Defines consistent horizontal bounds, max-width, and padding for content.
 */
export const Container = React.forwardRef(({ 
  className, 
  children, 
  size = 'default',
  ...props 
}, ref) => {
  
  const sizes = {
    sm: "max-w-3xl",
    default: "max-w-[1200px]",
    lg: "max-w-[1440px]",
    fluid: "max-w-full",
  };

  return (
    <div 
      ref={ref}
      className={cn("mx-auto px-4 sm:px-6 w-full relative z-10", sizes[size], className)}
      {...props}
    >
      {children}
    </div>
  );
});
Container.displayName = "Container";
