import { FC, useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { SunIcon } from '@Components/Icons/sun.icon';
import { MoonIcon } from '@Components/Icons/moon.icon';
import { ThemeStyle } from '@Enums/theme-style.enum';

const DarkModeButton: FC = () => {
  const [mounted, setMounted] = useState<boolean>(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <button
      aria-label="Toggle Dark Mode"
      type="button"
      className="mr-3 px-4 py-2 h-10 transform-translate-x-2/4 rounded-md bg-gray-700 dark:bg-black dark:text-white hover:opacity-60"
      onClick={() =>
        setTheme(
          theme === ThemeStyle.DARK_THEME
            ? ThemeStyle.LIGHT_THEME
            : ThemeStyle.DARK_THEME
        )
      }
    >
      {theme === ThemeStyle.DARK_THEME ? (
        <SunIcon className="w-5 h-5 fill-current" />
      ) : (
        <MoonIcon className="w-5 h-5 fill-current text-white" />
      )}
    </button>
  );
};

export default DarkModeButton;
