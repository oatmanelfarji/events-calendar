import moment from "moment";
import "moment/locale/fr";
import "moment/locale/ar";
import i18n from "./i18n";

export const setupMomentLocale = () => {
	const lang = i18n.language;
	// Map i18next language codes to moment locales if necessary
	// e.g. 'en-US' -> 'en'
	const momentLang = lang === "en-US" ? "en" : lang;
	moment.locale(momentLang);
	return momentLang;
};
