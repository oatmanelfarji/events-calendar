import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { useTranslation } from "react-i18next";
import Footer from "@/components/Footer";
import Header from "@/components/Header/Header";
import { NotFound } from "@/components/NotFound";
import { SeasonThemeHandler } from "@/components/season-theme-handler";
import { ThemeProvider } from "@/components/theme-provider";
import TanStackQueryDevtools from "@/integrations/tanstack-query/devtools";
import "@/lib/i18n";
import appCss from "@/styles.css?url";

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Events Calendar",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
			{
				rel: "icon",
				href: "/logo.png",
			},
		],
	}),

	shellComponent: RootDocument,
	notFoundComponent: NotFound,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	const { i18n } = useTranslation();

	return (
		<html lang={i18n.language} dir={i18n.dir(i18n.language)}>
			<head>
				<HeadContent />
			</head>
			<body>
				<ThemeProvider defaultTheme="system" storageKey="events-calendar-theme">
					<div className="flex flex-col min-h-screen">
						<Header />
						<SeasonThemeHandler />
						<main className="flex-1">{children}</main>
						<Footer />
					</div>
					<TanStackDevtools
						config={{
							position: "bottom-right",
						}}
						plugins={[
							{
								name: "Tanstack Router",
								render: <TanStackRouterDevtoolsPanel />,
							},
							TanStackQueryDevtools,
						]}
					/>
				</ThemeProvider>
				<Scripts />
			</body>
		</html>
	);
}
