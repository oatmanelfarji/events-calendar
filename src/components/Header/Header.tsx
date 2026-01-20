import { Link } from "@tanstack/react-router";
import {
	Home,
	ListTodo,
	Menu,
	Settings,
	Table,
	Table2Icon,
	X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { ModeToggle } from "../mode-toggle";
import { CurrentSeason } from "./current-season";
import { CurrentYear } from "./current-year";
import { LocaleSelector } from "./locale-selector";
import { NavLink } from "./NavLink";
import { UserMenu } from "./user-menu";

export default function Header() {
	const [isOpen, setIsOpen] = useState(false);
	const { t } = useTranslation();

	// Close sidebar on Escape key press
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape" && isOpen) {
				setIsOpen(false);
			}
		};
		document.addEventListener("keydown", handleEscape);
		return () => document.removeEventListener("keydown", handleEscape);
	}, [isOpen]);

	const closeSidebar = () => setIsOpen(false);

	return (
		<>
			<header className="sticky top-0 z-40 p-4 flex items-center justify-between glass-strong shadow-lg shadow-primary/5 transition-all duration-300">
				<div className="flex items-center">
					<Tooltip>
						<TooltipTrigger asChild>
							<button
								type="button"
								onClick={() => setIsOpen(true)}
								className="p-2.5 hover:bg-accent/10 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-md"
								aria-label={t("header.openMenu")}
								aria-expanded={isOpen}
								aria-controls="sidebar"
							>
								<Menu size={24} />
							</button>
						</TooltipTrigger>
						<TooltipContent>{t("header.openMenu")}</TooltipContent>
					</Tooltip>
				</div>
				<div className="hidden md:flex items-center gap-6">
					<CurrentYear />
					<Tooltip>
						<TooltipTrigger asChild>
							<Link to="/">
								<img
									src="/logo.png"
									alt="Events Calendar Logo"
									className="h-14 rounded-xl shadow-md hover:shadow-lg hover:scale-110 transition-all duration-300"
								/>
							</Link>
						</TooltipTrigger>
						<TooltipContent>{t("common.home")}</TooltipContent>
					</Tooltip>
					<CurrentSeason />
				</div>
				<div className="flex items-center gap-2">
					<ModeToggle />
					<LocaleSelector />
					<UserMenu />
				</div>
			</header>

			{/* Click-outside overlay */}
			{isOpen && (
				<div
					className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
					onClick={closeSidebar}
					onKeyDown={(e) => e.key === "Escape" && closeSidebar()}
					aria-hidden="true"
				/>
			)}

			{/* Sidebar navigation */}
			<nav
				id="sidebar"
				aria-label={t("header.navigation")}
				className={`fixed top-0 left-0 h-full w-80 glass-strong shadow-2xl shadow-primary/10 z-50 transform transition-all duration-500 ease-fluid flex flex-col border-r border-border/50 ${
					isOpen ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				<div className="flex items-center justify-between p-6 border-b border-border/50 bg-linear-to-r from-primary/5 to-accent/5">
					<Tooltip>
						<TooltipTrigger asChild>
							<Link to="/" onClick={closeSidebar}>
								<img
									src="/logo.png"
									alt="Events Calendar Logo"
									className="h-14 rounded-xl shadow-md hover:shadow-lg hover:scale-110 transition-all duration-300"
								/>
							</Link>
						</TooltipTrigger>
						<TooltipContent>{t("common.home")}</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger asChild>
							<button
								type="button"
								onClick={closeSidebar}
								className="p-2 hover:bg-accent/10 rounded-xl transition-all duration-300 hover:scale-105"
								aria-label={t("header.closeMenu")}
							>
								<X size={24} />
							</button>
						</TooltipTrigger>
						<TooltipContent>{t("header.closeMenu")}</TooltipContent>
					</Tooltip>
				</div>

				<div className="flex-1 p-4 overflow-y-auto">
					<NavLink
						to="/"
						icon={Home}
						labelKey="common.home"
						onClick={closeSidebar}
					/>
					<NavLink
						to="/events"
						icon={Table2Icon}
						labelKey="common.events"
						onClick={closeSidebar}
					/>
					<NavLink
						to="/holidays"
						icon={Table}
						labelKey="common.holidays"
						onClick={closeSidebar}
					/>
					<NavLink
						to="/astro"
						icon={Table}
						labelKey="common.astro"
						onClick={closeSidebar}
					/>
					<NavLink
						to="/todos"
						icon={ListTodo}
						labelKey="common.todos"
						fallback="Todos"
						onClick={closeSidebar}
					/>
					<NavLink
						to="/settings"
						icon={Settings}
						labelKey="common.settings"
						onClick={closeSidebar}
					/>
				</div>
			</nav>
		</>
	);
}
