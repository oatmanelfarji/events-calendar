import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { getHolidays } from "@/server/holidays";
import { HolidaysList } from "./HolidaysList";
import { IslamicHolidays } from "./IslamicHolidays";

export function HolidaysPageContent() {
	const { t } = useTranslation();
	const [year] = useState(new Date().getFullYear());
	const [countryCode] = useState("MA");

	const { data: holidays, isLoading } = useQuery({
		queryKey: ["holidays", countryCode],
		queryFn: () => getHolidays({ data: { countryCode } }),
	});

	return (
		<div className="p-8 space-y-8">
			<div className="flex justify-between items-center">
				<h1 className="text-3xl font-bold">{t("common.holidays")}</h1>
			</div>

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
