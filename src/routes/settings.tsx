import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Button } from "../components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../components/ui/select";
import { fetchAndSeedHolidays, getHolidays } from "../server/holidays";

export const Route = createFileRoute("/settings")({
	component: SettingsPage,
});

function SettingsPage() {
	const [countryCode, setCountryCode] = useState("US");
	const [year, setYear] = useState(new Date().getFullYear());
	const queryClient = useQueryClient();

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
			<h1 className="text-3xl font-bold text-slate-100">Settings</h1>

			<Card className="bg-slate-800 border-slate-700">
				<CardHeader>
					<CardTitle className="text-slate-100">
						Holiday Configuration
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
						<div className="space-y-2">
							<Label htmlFor="country" className="text-slate-300">
								Country Code
							</Label>
							<Input
								id="country"
								value={countryCode}
								onChange={(e) => setCountryCode(e.target.value.toUpperCase())}
								className="bg-slate-900 border-slate-700 text-slate-100"
								maxLength={2}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="year" className="text-slate-300">
								Year
							</Label>
							<Input
								id="year"
								type="number"
								value={year}
								onChange={(e) => setYear(parseInt(e.target.value))}
								className="bg-slate-900 border-slate-700 text-slate-100"
							/>
						</div>
						<Button
							onClick={() => seedMutation.mutate()}
							disabled={seedMutation.isPending}
							className="bg-cyan-600 hover:bg-cyan-700 text-white"
						>
							{seedMutation.isPending ? "Fetching..." : "Fetch & Seed Holidays"}
						</Button>
					</div>

					{seedMutation.isError && (
						<p className="text-red-400 text-sm">
							Error: {seedMutation.error.message}
						</p>
					)}

					{seedMutation.isSuccess && (
						<p className="text-green-400 text-sm">
							Successfully fetched holidays!
						</p>
					)}
				</CardContent>
			</Card>

			<Card className="bg-slate-800 border-slate-700">
				<CardHeader>
					<CardTitle className="text-slate-100">
						Holidays ({holidays?.length || 0})
					</CardTitle>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<p className="text-slate-400">Loading...</p>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{holidays?.map((holiday) => (
								<div
									key={holiday.id}
									className="p-4 rounded-lg bg-slate-900/50 border border-slate-700/50 hover:border-cyan-500/30 transition-colors"
								>
									<div className="flex justify-between items-start mb-2">
										<span className="text-cyan-400 font-medium text-sm">
											{holiday.date}
										</span>
										<span className="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
											{holiday.countryCode}
										</span>
									</div>
									<h3 className="text-slate-200 font-medium">{holiday.name}</h3>
									{holiday.description && (
										<p className="text-slate-500 text-sm mt-1">
											{holiday.description}
										</p>
									)}
								</div>
							))}
							{holidays?.length === 0 && (
								<p className="text-slate-500 col-span-full text-center py-8">
									No holidays found. Click "Fetch & Seed" to import them.
								</p>
							)}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
