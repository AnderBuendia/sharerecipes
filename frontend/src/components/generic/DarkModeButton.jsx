import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import SunIcon from '@Components/Icons/sunicon';
import MoonIcon from '@Components/Icons/moonicon';

const DARK_THEME = 'dark';
const LIGHT_THEME = 'light';

const DarkModeButton = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <button
      aria-label="Toggle Dark Mode"
      type="button"
      className="mr-3 px-4 py-2 h-10 transform-translate-x-2/4 rounded-md bg-gray-700 dark:bg-gray-500"
      onClick={() => setTheme(theme === DARK_THEME ? LIGHT_THEME : DARK_THEME)}
    >
      {theme === DARK_THEME ? (
        <SunIcon className="w-5 h-5 fill-current text-gray-800" />
      ) : (
        <MoonIcon className="w-4 h-4 fill-current text-white" />
      )}
    </button>
  );
};

export default DarkModeButton;
