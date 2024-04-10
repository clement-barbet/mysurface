import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationEN from "../public/locales/en/translation.json";
import translationES from "../public/locales/es/translation.json";
import translationCS from "../public/locales/cs/translation.json";

const resources = {
	en: {
		translation: translationEN,
	},
	es: {
		translation: translationES,
	},
	cs: {
		translation: translationCS,
	},
};

i18n.use(initReactI18next)
	.init({
		resources,
		lng:
			(typeof window !== "undefined" &&
				localStorage.getItem("i18nextLng")) ||
			"en", // save the selected language to local storage or use default language

		keySeparator: ".",

		interpolation: {
			escapeValue: false,
		},
	});

export default i18n;
