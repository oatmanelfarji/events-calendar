import { useState } from "react";
import { Button } from "../ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

// Common countries with their codes and names
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
] as const;

type Country = (typeof COUNTRIES)[number];

export function CountrySelector() {
	const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]);

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
								Select country: {selectedCountry.name}
							</span>
						</Button>
					</DropdownMenuTrigger>
				</TooltipTrigger>
				<TooltipContent>Select Country</TooltipContent>
			</Tooltip>
			<DropdownMenuContent
				align="end"
				className="w-56 max-h-[400px] overflow-y-auto"
			>
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
