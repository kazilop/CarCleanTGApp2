import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "px-4 py-3 rounded-xl font-semibold transition-all duration-200 active:scale-95 flex items-center justify-center";
  const variants = {
    primary: "bg-primary hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30",
    secondary: "bg-surface hover:bg-slate-700 text-slate-200 border border-slate-700",
    danger: "bg-red-500 hover:bg-red-600 text-white",
    outline: "bg-transparent border border-slate-600 text-slate-300 hover:border-slate-400"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-surface rounded-2xl p-4 border border-slate-700/50 shadow-xl ${className}`}>
    {children}
  </div>
);

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input
    className="w-full bg-darker border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors placeholder-slate-500"
    {...props}
  />
);

export const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <label className="block text-sm font-medium text-slate-400 mb-1 ml-1">
    {children}
  </label>
);

export const Badge: React.FC<{ children: React.ReactNode; color?: 'blue' | 'green' | 'red' | 'yellow' }> = ({ children, color = 'blue' }) => {
  const colors = {
    blue: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    green: 'bg-green-500/20 text-green-300 border-green-500/30',
    red: 'bg-red-500/20 text-red-300 border-red-500/30',
    yellow: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  };
  
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${colors[color]}`}>
      {children}
    </span>
  );
};