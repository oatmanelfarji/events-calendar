import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useId, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

import { fetchAndSeedHolidays, getHolidays } from "../server/holidays";

export const Route = createFileRoute("/settings")({
	component: SettingsPage,
});

function SettingsPage() {
	const { t } = useTranslation();
	const [countryCode, setCountryCode] = useState("US");
	const [year, setYear] = useState(new Date().getFullYear());
	const queryClient = useQueryClient();
	const countryInputId = useId();
	const yearInputId = useId();

	const { data: holidays, isLoading } = useQuery({
		queryKey: ["holidays", countryCode, year],
		queryFn: () => getHolidays({ data: { countryCode, year } }),
	});

	const seedMutation = useMutation({
		mutationFn: () => fetchAndSeedHolidays({ data: { countryCode, year } }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["holidays"] });
		},
	});

	return (
		<div className="p-6 max-w-4xl mx-auto space-y-8">
			<h1 className="text-3xl font-bold">{t("common.settings")}</h1>

			<Card>
				<CardHeader>
					<CardTitle>{t("common.holiday_configuration")}</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
						<div className="space-y-2">
							<Label htmlFor={countryInputId}>{t("common.country_code")}</Label>
							<Input
								id={countryInputId}
								value={countryCode}
								onChange={(e) => setCountryCode(e.target.value.toUpperCase())}
								maxLength={2}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor={yearInputId}>{t("common.year")}</Label>
							<Input
								id={yearInputId}
								type="number"
								value={year}
								onChange={(e) => setYear(parseInt(e.target.value))}
							/>
						</div>
						<Button
							onClick={() => seedMutation.mutate()}
							disabled={seedMutation.isPending}
						>
							{seedMutation.isPending
								? t("common.fetching")
								: t("common.fetch_and_seed_holidays")}
						</Button>
					</div>

					{seedMutation.isError && (
						<p className="text-destructive text-sm">
							{t("common.error_message", {
								message: seedMutation.error.message,
							})}
						</p>
					)}

					{seedMutation.isSuccess && (
						<p className="text-green-600 dark:text-green-400 text-sm">
							{t("common.success_fetched")}
						</p>
					)}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>
						{t("common.holidays_count", { count: holidays?.length || 0 })}
					</CardTitle>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<p className="text-muted-foreground">{t("common.loading")}</p>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{holidays?.map((holiday) => (
								<div
									key={holiday.id}
									className="p-4 rounded-lg bg-muted/50 border hover:border-primary/30 transition-colors"
								>
									<div className="flex justify-between items-start mb-2">
										<span className="text-primary font-medium text-sm">
											{holiday.date}
										</span>
										<span className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground border">
											{holiday.countryCode}
										</span>
									</div>
									<h3 className="font-medium">{holiday.name}</h3>
									{holiday.description && (
										<p className="text-muted-foreground text-sm mt-1">
											{holiday.description}
										</p>
									)}
								</div>
							))}
							{holidays?.length === 0 && (
								<p className="text-muted-foreground col-span-full text-center py-8">
									{t("common.no_holidays_import")}
								</p>
							)}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
