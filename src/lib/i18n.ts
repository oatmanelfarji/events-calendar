import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import arTranslation from "@/locales/ar/translation.json";
// Import translations directly for SSR compatibility
import enTranslation from "@/locales/en/translation.json";
import frTranslation from "@/locales/fr/translation.json";

// Initialize i18n with bundled resources for SSR
i18n
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		fallbackLng: "en",
		supportedLngs: ["en", "fr", "ar"],
		interpolation: {
			escapeValue: false, // not needed for react as it escapes by default
		},
		// Bundle translations directly instead of loading via HTTP
		resources: {
			en: {
				translation: enTranslation,
			},
			fr: {
				translation: frTranslation,
			},
			ar: {
				translation: arTranslation,
			},
		},
		detection: {
			order: ["localStorage", "navigator"],
			caches: ["localStorage"],
		},
		react: {
			useSuspense: false,
		},
	});

export default i18n;
