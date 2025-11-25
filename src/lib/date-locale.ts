import { ar, enUS, fr } from "date-fns/locale";
import i18n from "./i18n";

export const getDateFnsLocale = () => {
	const lang = i18n.language;
	switch (lang) {
		case "fr":
			return fr;
		case "ar":
			return ar;
		default:
			return enUS;
	}
};
