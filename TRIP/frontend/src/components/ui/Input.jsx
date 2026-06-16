import { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { AlertCircle } from 'lucide-react';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Input = forwardRef(({ 
  className, 
  type = 'text',
  error,
  label,
  id,
  helperText,
  icon: Icon,
  ...props 
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={inputId} 
          className="block text-sm font-medium text-primary-200 mb-1.5"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-primary-400">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
        )}
        
        <input
          id={inputId}
          type={type}
          className={cn(
            'block w-full rounded-xl border bg-primary-900/50 text-white placeholder-primary-400',
            'transition-all duration-300',
            'focus:outline-none focus:ring-2 focus:ring-accent-500/50 focus:border-accent-500',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            Icon ? 'pl-10' : 'pl-4',
            'pr-4 py-2.5',
            error 
              ? 'border-rose-500 focus:ring-rose-500/50 focus:border-rose-500' 
              : 'border-white/10',
            className
          )}
          ref={ref}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            cn(
              error && errorId,
              helperText && helperId
            ) || undefined
          }
          {...props}
        />
        
        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-rose-500">
            <AlertCircle className="h-5 w-5" aria-hidden="true" />
          </div>
        )}
      </div>

      {(error || helperText) && (
        <p 
          className={cn(
            'mt-1.5 text-sm',
            error ? 'text-rose-500 font-medium' : 'text-primary-400'
          )}
          id={error ? errorId : helperId}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export { Input };
