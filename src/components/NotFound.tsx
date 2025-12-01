import { Link } from "@tanstack/react-router";
import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export function NotFound() {
	const { t } = useTranslation();

	return (
		<div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 text-center p-8">
			<AlertCircle className="w-16 h-16 text-muted-foreground opacity-50" />
			<h1 className="text-4xl font-bold">
				{t("common.page_not_found", "Page Not Found")}
			</h1>
			<p className="text-lg text-muted-foreground max-w-md">
				{t(
					"common.page_not_found_desc",
					"The page you are looking for does not exist or has been moved.",
				)}
			</p>
			<Link to="/">
				<Button variant="default">{t("common.go_home", "Go Home")}</Button>
			</Link>
		</div>
	);
}
