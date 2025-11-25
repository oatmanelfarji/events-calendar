import { Link } from "@tanstack/react-router";
import { Home, Menu, Settings, Table, Table2Icon, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CountrySelector } from "./country-selector";
import { LanguageSwitcher } from "./language-switcher";
import { ModeToggle } from "./mode-toggle";

export default function Header() {
	const [isOpen, setIsOpen] = useState(false);
	const { t } = useTranslation();

	return (
		<>
			<header className="p-4 flex items-center justify-between bg-card border-b border-border shadow-sm">
				<div className="flex items-center">
					<button
						type="button"
						onClick={() => setIsOpen(true)}
						className="p-2 hover:bg-accent rounded-lg transition-colors"
						aria-label="Open menu"
					>
						<Menu size={24} />
					</button>
					<h1 className="ml-4 text-xl font-semibold">
						<Link to="/">
							<img
								src="/drizzle.svg"
								alt="Drizzle Logo"
								className="h-10 dark:invert-0 invert"
							/>
						</Link>
					</h1>
				</div>
				<div className="flex items-center gap-2">
					<LanguageSwitcher />
					<ModeToggle />
					<CountrySelector />
				</div>
			</header>

			<aside
				className={`fixed top-0 left-0 h-full w-80 bg-card border-r border-border shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
					isOpen ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				<div className="flex items-center justify-between p-4 border-b border-border">
					<h2 className="text-xl font-bold">{t("common.navigation")}</h2>
					<button
						type="button"
						onClick={() => setIsOpen(false)}
						className="p-2 hover:bg-accent rounded-lg transition-colors"
						aria-label="Close menu"
					>
						<X size={24} />
					</button>
				</div>

				<nav className="flex-1 p-4 overflow-y-auto">
					<Link
						to="/"
						onClick={() => setIsOpen(false)}
						className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors mb-2"
						activeProps={{
							className:
								"flex items-center gap-3 p-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors mb-2",
						}}
					>
						<Home size={20} />
						<span className="font-medium">{t("common.home")}</span>
					</Link>

					<Link
						to="/events"
						onClick={() => setIsOpen(false)}
						className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors mb-2"
						activeProps={{
							className:
								"flex items-center gap-3 p-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors mb-2",
						}}
					>
						<Table2Icon size={20} />
						<span className="font-medium">{t("common.events")}</span>
					</Link>

					<Link
						to="/holidays"
						onClick={() => setIsOpen(false)}
						className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors mb-2"
						activeProps={{
							className:
								"flex items-center gap-3 p-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors mb-2",
						}}
					>
						<Table size={20} />
						<span className="font-medium">{t("common.holidays")}</span>
					</Link>

					<Link
						to="/settings"
						onClick={() => setIsOpen(false)}
						className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors mb-2"
						activeProps={{
							className:
								"flex items-center gap-3 p-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors mb-2",
						}}
					>
						<Settings size={20} />
						<span className="font-medium">{t("common.settings")}</span>
					</Link>
				</nav>
			</aside>
		</>
	);
}
