import { useQuery } from "@tanstack/react-query";

import { HeroSlider, SLIDES_CONFIG } from "@/components/HeroSlider";
import { EventsSection } from "@/features/events/components/EventsSection";
import { HolidaysSection } from "@/features/holidays/components/HolidaysSection";
import { TodosSection } from "@/features/todos/components/TodosSection";
import { authClient } from "@/lib/auth-client";
import { getEvents } from "@/server/events";
import { getHolidays } from "@/server/holidays";
import { getTodos } from "@/server/todos";
import { SignIn } from "./Auth/SignIn";

export function HomePage() {
	// const [currentSlide, setCurrentSlide] = useState(0);
	const { data: session } = authClient.useSession();

	// Get current month range for events
	const now = new Date();
	const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
	const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

	// Fetch data
	const { data: events = [] } = useQuery({
		queryKey: ["events", startOfMonth.toISOString(), endOfMonth.toISOString()],
		queryFn: () =>
			getEvents({
				data: {
					start: startOfMonth.toISOString(),
					end: endOfMonth.toISOString(),
				},
			}),
	});

	const { data: holidays = [] } = useQuery({
		queryKey: ["holidays", "MA"],
		queryFn: () =>
			getHolidays({
				data: {
					countryCode: "MA",
				},
			}),
	});

	const { data: todos = [] } = useQuery({
		queryKey: ["todos"],
		queryFn: () => getTodos(),
	});

	const activeTodosCount = todos.filter((t) => !t.isDone).length;

	return (
		<div className="min-h-screen p-8 space-y-12">
			{/* Three Sections Grid */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
				{/* Holidays Section */}
				<HolidaysSection
					holidays={holidays}
					icon={SLIDES_CONFIG[1].icon}
					bgColor={SLIDES_CONFIG[1].bgColor}
					textColor={SLIDES_CONFIG[1].textColor}
				/>

				{/* Events Section */}
				<EventsSection
					events={events}
					categories={[]}
					icon={SLIDES_CONFIG[0].icon}
					bgColor={SLIDES_CONFIG[0].bgColor}
					textColor={SLIDES_CONFIG[0].textColor}
					startOfMonth={startOfMonth}
					endOfMonth={endOfMonth}
				/>

				{/* Todos Section */}
				{session ? (
					<TodosSection
						todos={todos}
						icon={SLIDES_CONFIG[2].icon}
						bgColor={SLIDES_CONFIG[2].bgColor}
						textColor={SLIDES_CONFIG[2].textColor}
					/>
				) : (
					<SignIn />
				)}
			</div>

			{/* Hero Slider */}
			<HeroSlider
				eventsCount={events.length}
				holidaysCount={holidays.length}
				activeTodosCount={activeTodosCount}
				onSlideChange={() => {}}
			/>
		</div>
	);
}
