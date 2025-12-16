import { Calendar, CheckCircle2, PartyPopper } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
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
			image: "/hero-images/events.png",
			align: "right" as const,
			textColor: "text-white",
		},
		{
			id: "holidays",
			title: t("common.holidays", "Holidays"),
			icon: PartyPopper,
			count: holidaysCount,
			image: "/hero-images/holidays.png", // Placeholder
			align: "left" as const,
			textColor: "text-white",
		},
		{
			id: "todos",
			title: t("common.todos", "Todos"),
			icon: CheckCircle2,
			count: activeTodosCount,
			image: "/hero-images/todos.png", // Placeholder
			align: "right" as const,
			textColor: "text-white",
		},
		{
			id: "spring",
			title: t("seasons.spring", "Spring"),
			icon: Calendar, // Placeholder icon
			count: null,
			image: "/hero-images/spring.png", // Placeholder
			align: "left" as const,
			textColor: "text-white",
		},
		{
			id: "summer",
			title: t("seasons.summer", "Summer"),
			icon: Calendar, // Placeholder icon
			count: null,
			image: "/hero-images/summer.png", // Placeholder
			align: "right" as const,
			textColor: "text-white",
		},
		{
			id: "autumn",
			title: t("seasons.autumn", "Autumn"),
			icon: Calendar, // Placeholder icon
			count: null,
			image: "/hero-images/autumn.png", // Placeholder
			align: "left" as const,
			textColor: "text-white",
		},
		{
			id: "winter",
			title: t("seasons.winter", "Winter"),
			icon: Calendar, // Placeholder icon
			count: null,
			image: "/hero-images/winter.png", // Placeholder
			align: "right" as const,
			textColor: "text-white",
		},
	];

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % slides.length);
		}, SLIDE_INTERVAL);

		return () => clearInterval(timer);
	}, [slides.length]);

	useEffect(() => {
		onSlideChange(currentSlide);
	}, [currentSlide, onSlideChange]);

	return (
		<div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl shadow-primary/10 group">
			{slides.map((slide, index) => {
				const Icon = slide.icon;
				return (
					<div
						key={slide.id}
						className={cn(
							"absolute inset-0 transition-all duration-1000 ease-fluid",
							currentSlide === index
								? "opacity-100 scale-100"
								: "opacity-0 scale-105 pointer-events-none",
						)}
					>
						{/* Background Image with Enhanced Gradient Overlay */}
						<div className="absolute inset-0">
							<img
								src={slide.image}
								alt={slide.title}
								className="w-full h-full object-cover"
								onError={(e) => {
									// Fallback for missing images
									e.currentTarget.src =
										"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 800 400'%3E%3Crect fill='%23333' width='800' height='400'/%3E%3Ctext fill='%23fff' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='40'%3EImage Placeholder%3C/text%3E%3C/svg%3E";
								}}
							/>
							{/* Multi-layer gradient overlay for depth */}
							<div className="absolute inset-0 bg-linear-to-br from-black/40 via-black/20 to-transparent" />
							<div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
						</div>

						{/* Content with Glassmorphism */}
						<div
							className={cn(
								"relative h-full flex items-center px-12",
								slide.align === "left" ? "justify-start" : "justify-end",
							)}
						>
							<div
								className={cn(
									"text-center space-y-6 max-w-md glass-strong p-10 rounded-3xl shadow-2xl shadow-black/20 transform transition-all duration-700 delay-300 border border-white/20",
									currentSlide === index
										? "translate-y-0 opacity-100"
										: "translate-y-10 opacity-0",
									slide.textColor,
								)}
							>
								<div className="flex justify-center">
									<div className="p-5 bg-white/20 backdrop-blur-md rounded-full shadow-xl shadow-black/20 ring-2 ring-white/30">
										<Icon className="w-16 h-16 text-white drop-shadow-lg" />
									</div>
								</div>
								<h2 className="text-6xl font-bold tracking-tight drop-shadow-2xl">
									{slide.title}
								</h2>
								{slide.count !== null && (
									<div className="flex flex-col items-center gap-2">
										<span className="text-5xl font-extrabold drop-shadow-lg">
											{slide.count}
										</span>
										<span className="text-xl font-medium opacity-90 uppercase tracking-widest drop-shadow-md">
											{slide.id === "todos"
												? t("common.active", "Active")
												: t("common.total", "Total")}
										</span>
									</div>
								)}
							</div>
						</div>
					</div>
				);
			})}

			{/* Enhanced Slide Indicators */}
			<div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
				{slides.map((slide, index) => (
					<Tooltip key={slide.id}>
						<TooltipTrigger asChild>
							<button
								type="button"
								onClick={() => setCurrentSlide(index)}
								className={cn(
									"h-2.5 rounded-full transition-all duration-300 shadow-lg backdrop-blur-md",
									currentSlide === index
										? "bg-white w-16 opacity-100 shadow-white/50"
										: "bg-white/50 w-2.5 hover:bg-white/80 opacity-70 hover:w-8",
								)}
								aria-label={`Go to slide ${index + 1}`}
							/>
						</TooltipTrigger>
						<TooltipContent>Go to slide {index + 1}</TooltipContent>
					</Tooltip>
				))}
			</div>
		</div>
	);
}

export const SLIDES_CONFIG = [
	{
		id: "events",
		icon: Calendar,
		image: "/hero-images/events.png",
		align: "right",
	},
	{
		id: "holidays",
		icon: PartyPopper,
		image: "/hero-images/holidays.png",
		align: "left",
	},
	{
		id: "todos",
		icon: CheckCircle2,
		image: "/hero-images/todos.png",
		align: "right",
	},
	{
		id: "spring",
		icon: Calendar,
		image: "/hero-images/spring.png",
		align: "left",
	},
	{
		id: "summer",
		icon: Calendar,
		image: "/hero-images/summer.png",
		align: "right",
	},
	{
		id: "autumn",
		icon: Calendar,
		image: "/hero-images/autumn.png",
		align: "left",
	},
	{
		id: "winter",
		icon: Calendar,
		image: "/hero-images/winter.png",
		align: "right",
	},
];
