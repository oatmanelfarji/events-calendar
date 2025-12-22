import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

// Countries with their codes, names, and flags
const COUNTRIES = [
	{ code: "US", name: "United States", flag: "🇺🇸" },
	{ code: "GB", name: "United Kingdom", flag: "🇬🇧" },
	{ code: "CA", name: "Canada", flag: "🇨🇦" },
	{ code: "AU", name: "Australia", flag: "🇦🇺" },
	{ code: "DE", name: "Germany", flag: "🇩🇪" },
	{ code: "FR", name: "France", flag: "🇫🇷" },
	{ code: "IT", name: "Italy", flag: "🇮🇹" },
	{ code: "ES", name: "Spain", flag: "🇪🇸" },
	{ code: "NL", name: "Netherlands", flag: "🇳🇱" },
	{ code: "SE", name: "Sweden", flag: "🇸🇪" },
	{ code: "NO", name: "Norway", flag: "🇳🇴" },
	{ code: "DK", name: "Denmark", flag: "🇩🇰" },
	{ code: "FI", name: "Finland", flag: "🇫🇮" },
	{ code: "PL", name: "Poland", flag: "🇵🇱" },
	{ code: "JP", name: "Japan", flag: "🇯🇵" },
	{ code: "KR", name: "South Korea", flag: "🇰🇷" },
	{ code: "CN", name: "China", flag: "🇨🇳" },
	{ code: "IN", name: "India", flag: "🇮🇳" },
	{ code: "BR", name: "Brazil", flag: "🇧🇷" },
	{ code: "MX", name: "Mexico", flag: "🇲🇽" },
	{ code: "MA", name: "Morocco", flag: "🇲🇦" },
] as const;

// Languages with their codes and native names
const LANGUAGES = [
	{ code: "en", name: "English", nativeName: "English" },
	{ code: "fr", name: "French", nativeName: "Français" },
	{ code: "ar", name: "Arabic", nativeName: "العربية" },
] as const;

type Country = (typeof COUNTRIES)[number];
type Language = (typeof LANGUAGES)[number];

export function LocaleSelector() {
	const { i18n, t } = useTranslation();
	const [selectedCountry, setSelectedCountry] = useState<Country>(
		COUNTRIES.find((c) => c.code === "MA") ?? COUNTRIES[0],
	);

	const currentLanguage =
		LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0];

	const changeLanguage = (lng: string) => {
		i18n.changeLanguage(lng);
	};

	return (
		<DropdownMenu>
			<Tooltip>
				<TooltipTrigger asChild>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="relative shadow-md hover:shadow-lg hover:scale-110 transition-all duration-300"
						>
							<span className="text-xl">{selectedCountry.flag}</span>
							<span className="sr-only">
								{t("common.locale_settings", "Locale Settings")}
							</span>
						</Button>
					</DropdownMenuTrigger>
				</TooltipTrigger>
				<TooltipContent>
					{t("common.locale_settings", "Locale Settings")}
				</TooltipContent>
			</Tooltip>
			<DropdownMenuContent
				align="end"
				className="w-56 max-h-[500px] overflow-y-auto"
			>
				{/* Language Section */}
				<DropdownMenuLabel className="text-xs text-muted-foreground">
					{t("common.language", "Language")}
				</DropdownMenuLabel>
				{LANGUAGES.map((language) => (
					<DropdownMenuItem
						key={language.code}
						onClick={() => changeLanguage(language.code)}
						className="flex items-center gap-3 cursor-pointer"
					>
						<span className="flex-1">{language.nativeName}</span>
						{currentLanguage.code === language.code && (
							<span className="text-primary">✓</span>
						)}
					</DropdownMenuItem>
				))}

				<DropdownMenuSeparator />

				{/* Country Section */}
				<DropdownMenuLabel className="text-xs text-muted-foreground">
					{t("common.country", "Country")}
				</DropdownMenuLabel>
				{COUNTRIES.map((country) => (
					<DropdownMenuItem
						key={country.code}
						onClick={() => setSelectedCountry(country)}
						className="flex items-center gap-3 cursor-pointer"
					>
						<span className="text-xl">{country.flag}</span>
						<span className="flex-1">{country.name}</span>
						{selectedCountry.code === country.code && (
							<span className="text-primary">✓</span>
						)}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
