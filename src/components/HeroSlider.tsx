import { Calendar, CheckCircle2, PartyPopper } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface HeroSliderProps {
	eventsCount: number;
	holidaysCount: number;
	activeTodosCount: number;
	onSlideChange: (index: number) => void;
}

const SLIDE_INTERVAL = 5000; // 5 seconds

export function HeroSlider({
	eventsCount,
	holidaysCount,
	activeTodosCount,
	onSlideChange,
}: HeroSliderProps) {
	const { t } = useTranslation();
	const [currentSlide, setCurrentSlide] = useState(0);

	const slides = [
		{
			id: "events",
			title: t("common.events", "Events"),
			icon: Calendar,
			count: eventsCount,
			color: "from-blue-500 to-cyan-500",
			bgColor: "bg-blue-500/10",
			textColor: "text-blue-500",
		},
		{
			id: "holidays",
			title: t("common.holidays", "Holidays"),
			icon: PartyPopper,
			count: holidaysCount,
			color: "from-purple-500 to-pink-500",
			bgColor: "bg-purple-500/10",
			textColor: "text-purple-500",
		},
		{
			id: "todos",
			title: t("common.todos", "Todos"),
			icon: CheckCircle2,
			count: activeTodosCount,
			color: "from-green-500 to-emerald-500",
			bgColor: "bg-green-500/10",
			textColor: "text-green-500",
		},
	];

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % 3);
		}, SLIDE_INTERVAL);

		return () => clearInterval(timer);
	}, []);

	useEffect(() => {
		onSlideChange(currentSlide);
	}, [currentSlide, onSlideChange]);

	return (
		<div className="relative h-80 rounded-2xl overflow-hidden shadow-2xl">
			{slides.map((slide, index) => {
				const Icon = slide.icon;
				return (
					<div
						key={slide.id}
						className={cn(
							"absolute inset-0 transition-all duration-700 ease-in-out",
							currentSlide === index
								? "opacity-100 translate-x-0"
								: index < currentSlide
									? "opacity-0 -translate-x-full"
									: "opacity-0 translate-x-full",
						)}
					>
						<div
							className={cn(
								"w-full h-full bg-linear-to-br flex items-center justify-center",
								slide.color,
							)}
						>
							<div className="text-center text-white space-y-6">
								<div className="flex justify-center">
									<div className="p-6 bg-white/20 backdrop-blur-sm rounded-full">
										<Icon className="w-20 h-20" />
									</div>
								</div>
								<h2 className="text-5xl font-bold">{slide.title}</h2>
								<p className="text-2xl font-semibold">
									{slide.count}{" "}
									{slide.id === "todos"
										? t("common.active", "Active")
										: t("common.total", "Total")}
								</p>
							</div>
						</div>
					</div>
				);
			})}

			{/* Slide Indicators */}
			<div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
				{slides.map((_, index) => (
					<button
						key={index}
						type="button"
						onClick={() => setCurrentSlide(index)}
						className={cn(
							"w-3 h-3 rounded-full transition-all duration-300",
							currentSlide === index
								? "bg-white w-8"
								: "bg-white/50 hover:bg-white/75",
						)}
						aria-label={`Go to slide ${index + 1}`}
					/>
				))}
			</div>
		</div>
	);
}

export const SLIDES_CONFIG = [
	{
		id: "events",
		icon: Calendar,
		color: "from-blue-500 to-cyan-500",
		bgColor: "bg-blue-500/10",
		textColor: "text-blue-500",
	},
	{
		id: "holidays",
		icon: PartyPopper,
		color: "from-purple-500 to-pink-500",
		bgColor: "bg-purple-500/10",
		textColor: "text-purple-500",
	},
	{
		id: "todos",
		icon: CheckCircle2,
		color: "from-green-500 to-emerald-500",
		bgColor: "bg-green-500/10",
		textColor: "text-green-500",
	},
];
