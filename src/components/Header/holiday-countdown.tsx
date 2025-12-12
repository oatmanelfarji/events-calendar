import { useQuery } from "@tanstack/react-query";
import { Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getNextHoliday } from "@/server/holidays";

interface TimeRemaining {
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
}

function calculateTimeRemaining(targetDate: string): TimeRemaining {
	const now = new Date();
	const target = new Date(targetDate);
	const diff = target.getTime() - now.getTime();

	if (diff <= 0) {
		return { days: 0, hours: 0, minutes: 0, seconds: 0 };
	}

	const days = Math.floor(diff / (1000 * 60 * 60 * 24));
	const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
	const seconds = Math.floor((diff % (1000 * 60)) / 1000);

	return { days, hours, minutes, seconds };
}

export function HolidayCountdown() {
	const { t } = useTranslation();
	const [mounted, setMounted] = useState(false);
	const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
	});

	// Get the country code from localStorage (similar to how other components do it)
	const [countryCode, setCountryCode] = useState("MA");

	useEffect(() => {
		setMounted(true);
		const storedCountry = localStorage.getItem("selectedCountry");
		if (storedCountry) {
			setCountryCode(storedCountry);
		}
	}, []);

	const { data: nextHoliday } = useQuery({
		queryKey: ["nextHoliday", countryCode],
		queryFn: () => getNextHoliday({ data: { countryCode } }),
		enabled: mounted,
	});

	useEffect(() => {
		if (!nextHoliday?.date) return;

		const updateCountdown = () => {
			setTimeRemaining(calculateTimeRemaining(nextHoliday.date));
		};

		updateCountdown();
		const interval = setInterval(updateCountdown, 1000);

		return () => clearInterval(interval);
	}, [nextHoliday]);

	if (!mounted || !nextHoliday) return null;

	const { days, hours, minutes, seconds } = timeRemaining;

	return (
		<div
			className={`relative flex items-center justify-center gap-2 px-4 w-fit h-8 rounded-full overflow-hidden bg-foreground/50 border border-blue-950 dark:border-white`}
		>
			{/* Calendar Icon */}
			<Calendar className={`h-4 w-4 text-white drop-shadow-md`} />

			{/* Holiday Name */}
			<span
				className={`text-xs font-bold text-white drop-shadow-md truncate max-w-24`}
			>
				{nextHoliday.name}
				{" in "}
			</span>

			{/* Countdown */}
			<div
				className={`flex items-center gap-1 text-xs font-semibold text-white`}
			>
				{days > 0 && (
					<>
						<span className="font-bold">{days}</span>
						<span className="font-bold">{t("countdown.days")}</span>
					</>
				)}
				<span className="font-bold">{hours}</span>
				<span className="font-bold">{t("countdown.hours")}</span>
				<span className="font-bold">{minutes}</span>
				<span className="font-bold">{t("countdown.minutes")}</span>
				<span className="font-bold">{seconds}</span>
				<span className="font-bold">{t("countdown.seconds")}</span>
			</div>
		</div>
	);
}
