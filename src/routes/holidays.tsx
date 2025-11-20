import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { fetchAndSeedHolidays, getHolidays } from "../server/holidays";

export const Route = createFileRoute("/holidays")({
	component: HolidaysPage,
});

function HolidaysPage() {
	const [year, setYear] = useState(new Date().getFullYear());
	const [countryCode, setCountryCode] = useState("US");
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
				<h1 className="text-3xl font-bold">Holidays</h1>
				<Button
					onClick={() => setIsSeedFormVisible(!isSeedFormVisible)}
					variant="outline"
				>
					{isSeedFormVisible ? "Cancel Seeding" : "Seed Holidays"}
				</Button>
			</div>

			{isSeedFormVisible && (
				<Card>
					<CardHeader>
						<CardTitle>Manage Holidays</CardTitle>
						<CardDescription>
							Fetch and seed holidays for a specific year and country.
						</CardDescription>
					</CardHeader>
					<CardContent className="flex items-end gap-4">
						<div className="space-y-2">
							<label htmlFor={yearInputId} className="text-sm font-medium">
								Year
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
								Country Code
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
							{seedMutation.isPending ? "Seeding..." : "Fetch & Seed"}
						</Button>
					</CardContent>
				</Card>
			)}

			<Card>
				<CardHeader>
					<CardTitle>Holiday List</CardTitle>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<div>Loading...</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Date</TableHead>
									<TableHead>Name</TableHead>
									<TableHead>Type</TableHead>
									<TableHead>Description</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{holidays?.map((holiday) => (
									<TableRow key={holiday.id}>
										<TableCell>{holiday.date}</TableCell>
										<TableCell className="font-medium">
											{holiday.name}
										</TableCell>
										<TableCell>{holiday.type}</TableCell>
										<TableCell>{holiday.description}</TableCell>
									</TableRow>
								))}
								{holidays?.length === 0 && (
									<TableRow>
										<TableCell colSpan={4} className="text-center py-4">
											No holidays found. Try seeding them.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
