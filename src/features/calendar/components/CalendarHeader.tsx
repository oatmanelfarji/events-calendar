import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

interface CalendarHeaderProps {
	currentDate: Date;
	onPrevMonth: () => void;
	onNextMonth: () => void;
	onToday: () => void;
	onNewEvent: () => void;
}

export function CalendarHeader({
	currentDate,
	onPrevMonth,
	onNextMonth,
	onToday,
	onNewEvent,
}: CalendarHeaderProps) {
	const { t } = useTranslation();

	return (
		<div className="flex items-center justify-between p-6">
			<div className="flex items-center gap-4">
				<div className="flex items-center gap-1 bg-muted rounded-lg p-1">
					<Button
						variant="ghost"
						size="icon"
						onClick={onPrevMonth}
						className="hover:bg-accent"
					>
						<ChevronLeft className="w-5 h-5" />
					</Button>
					<h2 className="text-3xl font-bold bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
						{moment(currentDate).format("MMMM YYYY")}
					</h2>
					<Button
						variant="ghost"
						size="icon"
						onClick={onNextMonth}
						className="hover:bg-accent"
					>
						<ChevronRight className="w-5 h-5" />
					</Button>
				</div>
				<div className="flex items-center gap-1 bg-muted rounded-lg p-1">
					<Button
						variant="ghost"
						size="icon"
						onClick={onToday}
						className="hover:bg-accent text-sm font-medium mx-2 p-3"
					>
						{t("common.today")}
					</Button>
				</div>
			</div>
			<Button onClick={onNewEvent}>
				<Plus className="w-4 h-4 mr-2" /> {t("common.new_event")}
			</Button>
		</div>
	);
}
