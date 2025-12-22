import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { authClient } from "@/lib/auth-client";

export function UserMenu() {
	const { data: session } = authClient.useSession();
	const navigate = useNavigate();

	const handleSignOut = async () => {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					navigate({ to: "/" });
				},
			},
		});
	};

	if (!session) {
		return (
			<Tooltip>
				<TooltipTrigger asChild>
					<Link to="/login">
						<Button variant="default" size="sm">
							Sign In
						</Button>
					</Link>
				</TooltipTrigger>
				<TooltipContent>Sign In</TooltipContent>
			</Tooltip>
		);
	}

	return (
		<DropdownMenu>
			<Tooltip>
				<TooltipTrigger asChild>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="relative rounded-full shadow-md hover:shadow-lg hover:scale-110 transition-all duration-300"
						>
							<Avatar className="h-10 w-10">
								<AvatarImage
									src={session.user.image || undefined}
									alt={session.user.name}
								/>
								<AvatarFallback>{session.user.name.charAt(0)}</AvatarFallback>
							</Avatar>
						</Button>
					</DropdownMenuTrigger>
				</TooltipTrigger>
				<TooltipContent>User menu</TooltipContent>
			</Tooltip>
			<DropdownMenuContent className="w-56" align="end" forceMount>
				<DropdownMenuItem className="flex flex-col items-start gap-1">
					<p className="text-sm font-medium leading-none">
						{session.user.name}
					</p>
					<p className="text-xs leading-none text-muted-foreground">
						{session.user.email}
					</p>
				</DropdownMenuItem>
				<DropdownMenuItem onClick={handleSignOut} className="text-red-600">
					<LogOut className="mr-2 h-4 w-4" />
					<span>Log out</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
