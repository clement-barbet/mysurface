import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';

function DarkModeButton() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    const html = document.documentElement;

    if (darkMode) {
      html.classList.remove('dark');
    } else {
      html.classList.add('dark');
    }

    setDarkMode(!darkMode);
  };

  return (
    <div className="relative inline-block w-14 align-middle select-none transition duration-200 ease-in">
      <label htmlFor="toggle" className="toggle-label overflow-hidden h-6 rounded-full bg-gray-300 dark:bg-dark_blue cursor-pointer flex items-center justify-between px-1">
        <FontAwesomeIcon icon={faMoon} />
        <FontAwesomeIcon icon={faSun}  />
      </label>
      <input type="checkbox" name="toggle" id="toggle" checked={darkMode} onChange={toggleDarkMode} className={`toggle-checkbox absolute top-0 left-0 block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in ${darkMode ? 'transform translate-x-8' : ''}`} />
    </div>
  );
}

export {DarkModeButton};