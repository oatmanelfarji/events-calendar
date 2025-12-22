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
import { useState } from "react";
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
import { UserMenu } from "./user-menu";

export default function Header() {
	const [isOpen, setIsOpen] = useState(false);
	const { t } = useTranslation();

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
								aria-label="Open menu"
							>
								<Menu size={24} />
							</button>
						</TooltipTrigger>
						<TooltipContent>Open menu</TooltipContent>
					</Tooltip>
					{/*<Link to="/">
						<img
							src="/logo.png"
							alt="Events Calendar Logo"
							className="h-11 rounded-xl shadow-md hover:shadow-lg hover:scale-110 transition-all duration-300"
						/>
					</Link>*/}
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
						<TooltipContent>Home</TooltipContent>
					</Tooltip>
					<CurrentSeason />
					{/*<HolidayCountdown />*/}
				</div>
				<div className="flex items-center gap-2">
					<ModeToggle />
					<LocaleSelector />
					<UserMenu />
				</div>
			</header>

			<aside
				className={`fixed top-0 left-0 h-full w-80 glass-strong shadow-2xl shadow-primary/10 z-50 transform transition-all duration-500 ease-fluid flex flex-col border-r border-border/50 ${
					isOpen ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				<div className="flex items-center justify-between p-6 border-b border-border/50 bg-linear-to-r from-primary/5 to-accent/5">
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
						<TooltipContent>Home</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger asChild>
							<button
								type="button"
								onClick={() => setIsOpen(false)}
								className="p-2 hover:bg-accent/10 rounded-xl transition-all duration-300 hover:scale-105"
								aria-label="Close menu"
							>
								<X size={24} />
							</button>
						</TooltipTrigger>
						<TooltipContent>Close menu</TooltipContent>
					</Tooltip>
				</div>

				<nav className="flex-1 p-4 overflow-y-auto">
					<Tooltip>
						<TooltipTrigger asChild>
							<Link
								to="/"
								onClick={() => setIsOpen(false)}
								className="flex items-center gap-3 p-3.5 rounded-xl hover:bg-accent/10 transition-all duration-300 mb-2 group hover:shadow-md hover:translate-x-1"
								activeProps={{
									className:
										"flex items-center gap-3 p-3.5 rounded-xl gradient-primary text-primary-foreground hover:shadow-lg transition-all duration-300 mb-2 group shadow-md shadow-primary/20",
								}}
							>
								<Home
									size={20}
									className="group-hover:scale-110 transition-transform duration-300"
								/>
								<span className="font-medium">{t("common.home")}</span>
							</Link>
						</TooltipTrigger>
						<TooltipContent>{t("common.home")}</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger asChild>
							<Link
								to="/events"
								onClick={() => setIsOpen(false)}
								className="flex items-center gap-3 p-3.5 rounded-xl hover:bg-accent/10 transition-all duration-300 mb-2 group hover:shadow-md hover:translate-x-1"
								activeProps={{
									className:
										"flex items-center gap-3 p-3.5 rounded-xl gradient-primary text-primary-foreground hover:shadow-lg transition-all duration-300 mb-2 group shadow-md shadow-primary/20",
								}}
							>
								<Table2Icon
									size={20}
									className="group-hover:scale-110 transition-transform duration-300"
								/>
								<span className="font-medium">{t("common.events")}</span>
							</Link>
						</TooltipTrigger>
						<TooltipContent>{t("common.events")}</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger asChild>
							<Link
								to="/holidays"
								onClick={() => setIsOpen(false)}
								className="flex items-center gap-3 p-3.5 rounded-xl hover:bg-accent/10 transition-all duration-300 mb-2 group hover:shadow-md hover:translate-x-1"
								activeProps={{
									className:
										"flex items-center gap-3 p-3.5 rounded-xl gradient-primary text-primary-foreground hover:shadow-lg transition-all duration-300 mb-2 group shadow-md shadow-primary/20",
								}}
							>
								<Table
									size={20}
									className="group-hover:scale-110 transition-transform duration-300"
								/>
								<span className="font-medium">{t("common.holidays")}</span>
							</Link>
						</TooltipTrigger>
						<TooltipContent>{t("common.holidays")}</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger asChild>
							<Link
								to="/todos"
								onClick={() => setIsOpen(false)}
								className="flex items-center gap-3 p-3.5 rounded-xl hover:bg-accent/10 transition-all duration-300 mb-2 group hover:shadow-md hover:translate-x-1"
								activeProps={{
									className:
										"flex items-center gap-3 p-3.5 rounded-xl gradient-primary text-primary-foreground hover:shadow-lg transition-all duration-300 mb-2 group shadow-md shadow-primary/20",
								}}
							>
								<ListTodo
									size={20}
									className="group-hover:scale-110 transition-transform duration-300"
								/>
								<span className="font-medium">
									{t("common.todos", "Todos")}
								</span>
							</Link>
						</TooltipTrigger>
						<TooltipContent>{t("common.todos", "Todos")}</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger asChild>
							<Link
								to="/settings"
								onClick={() => setIsOpen(false)}
								className="flex items-center gap-3 p-3.5 rounded-xl hover:bg-accent/10 transition-all duration-300 mb-2 group hover:shadow-md hover:translate-x-1"
								activeProps={{
									className:
										"flex items-center gap-3 p-3.5 rounded-xl gradient-primary text-primary-foreground hover:shadow-lg transition-all duration-300 mb-2 group shadow-md shadow-primary/20",
								}}
							>
								<Settings
									size={20}
									className="group-hover:scale-110 transition-transform duration-300"
								/>
								<span className="font-medium">{t("common.settings")}</span>
							</Link>
						</TooltipTrigger>
						<TooltipContent>{t("common.settings")}</TooltipContent>
					</Tooltip>
				</nav>
			</aside>
		</>
	);
}
