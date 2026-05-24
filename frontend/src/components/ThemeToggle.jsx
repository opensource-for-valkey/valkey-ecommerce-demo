import React from 'react';
import { useTheme } from '../context/ThemeContext';

/**
 * Compact light/dark switch — use in agent header, dashboard, etc.
 */
const ThemeToggle = ({ className = '', showLabel = false }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type='button'
      className={`theme-toggle ${className}`}
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Light mode' : 'Dark mode'}
    >
      <i className={isDark ? 'ph ph-sun' : 'ph ph-moon'} />
      {showLabel && (
        <span className='theme-toggle__label'>
          {isDark ? 'Light' : 'Dark'}
        </span>
      )}
    </button>
  );
};

export default ThemeToggle;
