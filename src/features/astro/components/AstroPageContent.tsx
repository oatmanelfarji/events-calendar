import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { getAstroHouses } from "@/server/astro";
import { AstroCard } from "./AstroCard";

export function AstroPageContent() {
	const { data: houses, isLoading } = useQuery({
		queryKey: ["astro-houses"],
		queryFn: () => getAstroHouses(),
	});

	if (isLoading) {
		return (
			<div className="p-8 space-y-8">
				<h1 className="text-3xl font-bold">Astronomical Houses (Al-Manazil)</h1>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{Array.from({ length: 9 }).map((_, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: Skeletons don't have IDs and order doesn't matter
						<Skeleton key={i} className="h-48 w-full rounded-xl" />
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="p-8 space-y-8">
			<div className="space-y-2">
				<h1 className="text-3xl font-bold">Astronomical Houses (Al-Manazil)</h1>
				<p className="text-muted-foreground">
					The 28 mansions of the moon (manazil al-qamar) used for reckoning time
					and seasons in traditional astronomy.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{houses?.map((house) => (
					<AstroCard key={house.id} house={house} />
				))}
			</div>
		</div>
	);
}
