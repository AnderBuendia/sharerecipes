import { useTheme } from 'next-themes';
import SunIcon from '../icons/sunicon';
import MoonIcon from '../icons/moonicon';

const DarkModeButton = () => {
  const { theme, setTheme } = useTheme();

  return (
    <button
      aria-label="Toggle Dark Mode"
      type="button"
      className="mr-3 px-4 py-2 h-10 transform-translate-x-2/4 rounded-md bg-gray-700 dark:bg-gray-500"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? (
        <SunIcon className="w-5 h-5 fill-current text-gray-800" />
      ) : (
        <MoonIcon className="w-4 h-4 fill-current text-white" />
      )}
    </button>
  );
};

export default DarkModeButton;
