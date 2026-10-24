import { useCallback, useEffect, useState } from 'react';

export type Theme = 'dark' | 'light';

function readTheme(): Theme {
  return document.documentElement.dataset.mode === 'light' ? 'light' : 'dark';
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(readTheme);

  useEffect(() => {
    document.documentElement.dataset.mode = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? '#0f172a' : '#eef0f5');
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('rex-theme', next);
      } catch {
        // Storage can be blocked (private mode); the toggle still works for this visit.
      }
      return next;
    });
  }, []);

  return { theme, toggle };
}
