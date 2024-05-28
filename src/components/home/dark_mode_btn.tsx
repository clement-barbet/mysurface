import { useEffect, useState } from "react";
import { IoSunny, IoMoon } from "react-icons/io5";

function DarkModeButton() {
	const [darkMode, setDarkMode] = useState(() => {
		const storedDarkMode = sessionStorage.getItem("darkMode");
		return storedDarkMode ? JSON.parse(storedDarkMode) : false;
	});

	useEffect(() => {
		const html = document.documentElement;

		if (darkMode) {
			html.classList.add("dark");
		} else {
			html.classList.remove("dark");
		}

		sessionStorage.setItem("darkMode", JSON.stringify(darkMode));
	}, [darkMode]);

	const toggleDarkMode = () => {
		setDarkMode((prevMode) => !prevMode);
	};

	return (
		<div className="relative inline-block w-14 align-middle select-none transition duration-200 ease-in">
			<label
				htmlFor="toggle"
				className="toggle-label overflow-hidden h-6 rounded-full bg-gray-300 dark:bg-dark_blue cursor-pointer flex items-center justify-between px-1"
			>
				<IoMoon size="1em" />
				<IoSunny size="1em" />
			</label>
			<input
				type="checkbox"
				name="toggle"
				id="toggle"
				checked={darkMode}
				onChange={toggleDarkMode}
				className={`toggle-checkbox absolute top-0 left-0 block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in ${
					darkMode ? "transform translate-x-8" : ""
				}`}
			/>
		</div>
	);
}

export { DarkModeButton };
