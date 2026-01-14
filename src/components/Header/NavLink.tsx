import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavLinkProps {
	to: string;
	icon: LucideIcon;
	labelKey: string;
	/** Fallback text if translation key is missing */
	fallback?: string;
	onClick?: () => void;
}

/**
 * Reusable navigation link component for the sidebar.
 * Handles styling, tooltips, and active state consistently.
 */
export function NavLink({
	to,
	icon: Icon,
	labelKey,
	fallback,
	onClick,
}: NavLinkProps) {
	const { t } = useTranslation();
	const label = t(labelKey, fallback ?? labelKey);

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Link
					to={to}
					onClick={onClick}
					className="flex items-center gap-3 p-3.5 rounded-xl hover:bg-accent/10 transition-all duration-300 mb-2 group hover:shadow-md hover:translate-x-1"
					activeProps={{
						className:
							"flex items-center gap-3 p-3.5 rounded-xl gradient-primary text-primary-foreground hover:shadow-lg transition-all duration-300 mb-2 group shadow-md shadow-primary/20",
					}}
				>
					<Icon
						size={20}
						className="group-hover:scale-110 transition-transform duration-300"
					/>
					<span className="font-medium">{label}</span>
				</Link>
			</TooltipTrigger>
			<TooltipContent>{label}</TooltipContent>
		</Tooltip>
	);
}
