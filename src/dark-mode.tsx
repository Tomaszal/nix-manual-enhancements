import { FiMoon, FiSun } from 'react-icons/fi';
import { type IconType } from 'react-icons';
import { enable as enableDarkMode, disable as disableDarkMode } from 'darkreader';
import { useEffect, useState } from 'react';

const localStorageKey = 'dark-mode';

const localStorageItem = localStorage.getItem(localStorageKey);
const prefersColorScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
const initialState = localStorageItem === null ? prefersColorScheme : localStorageItem === 'true';

export const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(initialState);

  useEffect(() => {
    if (darkMode) enableDarkMode({});
    else disableDarkMode();
  }, [darkMode]);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const DarkModeIcon: IconType = darkMode ? FiMoon : FiSun;

  return (
    <DarkModeIcon
      className='navButton'
      onClick={() =>
        void setDarkMode((state) => {
          const newState = !state;
          localStorage.setItem(localStorageKey, JSON.stringify(newState));
          return newState;
        })
      }
    />
  );
};
