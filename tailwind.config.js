/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Brand Colors
        'brand-primary': '#059669',
        'brand-primary-dark': '#6ee7b7',
        'brand-secondary': '#6366f1',
        'brand-secondary-dark': '#818cf8',
        
        // App Colors
        'app-light': '#f8fafc',
        'app-dark': '#0f172a',
        'app-card-light': '#ffffff',
        'app-card-dark': '#1e293b',
        
        // Content Colors
        'content-primary-light': '#1e293b',
        'content-primary-dark': '#ffffff',
        'content-secondary-light': '#64748b',
        'content-secondary-dark': '#94a3b8',
        
        // Border Colors
        'border-light': '#e2e8f0',
        'border-dark': '#334155',
        
        // Status Colors
        'status-success-light': '#34d399',
        'status-success-dark': '#6ee7b7',
        'status-error-light': '#ef4444',
        'status-error-dark': '#f87171',
        'status-warning-light': '#f59e0b',
        'status-warning-dark': '#fbbf24',
        
        // Feature Colors
        'feature-notification-light': '#8b5cf6',
        'feature-notification-dark': '#a78bfa',
        'feature-achievement-light': '#f59e0b',
        'feature-achievement-dark': '#fbbf24',
      },
    },
  },
  plugins: [],
}