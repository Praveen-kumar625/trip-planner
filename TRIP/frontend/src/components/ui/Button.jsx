import { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Button = forwardRef(({ 
  className, 
  variant = 'default', 
  size = 'default', 
  isLoading = false,
  disabled = false,
  asChild = false, 
  children,
  ...props 
}, ref) => {
  const Comp = asChild ? Slot : 'button';
  
  const variants = {
    default: 'bg-gradient-to-r from-accent-500 to-accent-600 text-primary-950 hover:shadow-[0_0_30px_rgba(245,143,10,0.6)] shadow-[0_0_20px_rgba(245,143,10,0.3)]',
    secondary: 'bg-primary-800 text-white hover:bg-primary-700 border border-white/5',
    outline: 'bg-white/5 backdrop-blur-md border border-white/10 text-primary-50 hover:bg-white/10 hover:border-white/20',
    ghost: 'hover:bg-primary-800 text-primary-200 hover:text-white',
    glass: 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 shadow-xl',
    danger: 'bg-rose-500 text-white hover:bg-rose-600 shadow-[0_0_20px_rgba(243,33,33,0.3)]',
  };

  const sizes = {
    default: 'h-12 px-6 py-2 rounded-xl text-sm font-bold tracking-wide',
    sm: 'h-9 px-4 rounded-lg text-xs font-bold tracking-wide',
    lg: 'h-14 px-8 rounded-2xl text-lg font-black tracking-wider',
    icon: 'h-12 w-12 rounded-xl flex items-center justify-center',
  };

  const isDisabled = disabled || isLoading;

  return (
    <Comp
      className={cn(
        'relative overflow-hidden inline-flex items-center justify-center whitespace-nowrap transition-all duration-300',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-950',
        'disabled:pointer-events-none disabled:opacity-60 disabled:shadow-none',
        'active:scale-95',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={isLoading}
      ref={ref}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 mr-2 animate-spin" aria-hidden="true" />
          {children}
        </>
      ) : (
        children
      )}
    </Comp>
  );
});

Button.displayName = 'Button';

export { Button };
