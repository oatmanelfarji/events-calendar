import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useId, useState } from "react";
import { useTranslation } from "react-i18next";
import { HolidaysList } from "@/components/HolidaysList";
import { IslamicHolidays } from "@/components/IslamicHolidays";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { fetchAndSeedHolidays, getHolidays } from "@/server/holidays";

export const Route = createFileRoute("/holidays")({
	component: HolidaysPage,
});

function HolidaysPage() {
	const { t } = useTranslation();
	const [year, setYear] = useState(new Date().getFullYear());
	const [countryCode, setCountryCode] = useState("MA");
	const [isSeedFormVisible, setIsSeedFormVisible] = useState(false);
	const queryClient = useQueryClient();
	const yearInputId = useId();
	const countryInputId = useId();

	const { data: holidays, isLoading } = useQuery({
		queryKey: ["holidays", year, countryCode],
		queryFn: () => getHolidays({ data: { year, countryCode } }),
	});

	const seedMutation = useMutation({
		mutationFn: fetchAndSeedHolidays,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["holidays", year, countryCode],
			});
			setIsSeedFormVisible(false);
		},
	});

	const handleSeed = () => {
		seedMutation.mutate({ data: { year, countryCode } });
	};

	return (
		<div className="p-8 space-y-8">
			<div className="flex justify-between items-center">
				<h1 className="text-3xl font-bold">{t("common.holidays")}</h1>
				<Button
					onClick={() => setIsSeedFormVisible(!isSeedFormVisible)}
					variant="outline"
				>
					{isSeedFormVisible
						? t("common.cancel_seeding")
						: t("common.seed_holidays")}
				</Button>
			</div>

			{isSeedFormVisible && (
				<Card>
					<CardHeader>
						<CardTitle>{t("common.manage_holidays")}</CardTitle>
						<CardDescription>
							{t("common.manage_holidays_desc")}
						</CardDescription>
					</CardHeader>
					<CardContent className="flex items-end gap-4">
						<div className="space-y-2">
							<label htmlFor={yearInputId} className="text-sm font-medium">
								{t("common.year")}
							</label>
							<Input
								id={yearInputId}
								type="number"
								value={year}
								onChange={(e) => setYear(Number(e.target.value))}
								className="w-32"
							/>
						</div>
						<div className="space-y-2">
							<label htmlFor={countryInputId} className="text-sm font-medium">
								{t("common.country_code")}
							</label>
							<Input
								id={countryInputId}
								value={countryCode}
								onChange={(e) => setCountryCode(e.target.value.toUpperCase())}
								className="w-32"
								maxLength={2}
							/>
						</div>
						<Button onClick={handleSeed} disabled={seedMutation.isPending}>
							{seedMutation.isPending
								? t("common.seeding")
								: t("common.fetch_and_seed")}
						</Button>
					</CardContent>
				</Card>
			)}

			<HolidaysList
				holidays={holidays || []}
				isLoading={isLoading}
				title={t("common.showing_holidays", {
					country: countryCode,
					year: year,
				})}
				description={t("common.showing_holidays", {
					country: countryCode,
					year: year,
				})}
				emptyMessage={t("common.no_holidays_found")}
				showCountryCode={false}
			/>

			<IslamicHolidays />
		</div>
	);
}
