import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";
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

/**
 * Get initials for avatar fallback.
 * Falls back to email initial or "?" if name is empty.
 */
function getAvatarFallback(
	name?: string | null,
	email?: string | null,
): string {
	if (name && name.length > 0) {
		return name.charAt(0).toUpperCase();
	}
	if (email && email.length > 0) {
		return email.charAt(0).toUpperCase();
	}
	return "?";
}

export function UserMenu() {
	const { data: session } = authClient.useSession();
	const navigate = useNavigate();
	const { t } = useTranslation();

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
							{t("auth.signIn")}
						</Button>
					</Link>
				</TooltipTrigger>
				<TooltipContent>{t("auth.signIn")}</TooltipContent>
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
									alt={session.user.name || "User avatar"}
								/>
								<AvatarFallback>
									{getAvatarFallback(session.user.name, session.user.email)}
								</AvatarFallback>
							</Avatar>
						</Button>
					</DropdownMenuTrigger>
				</TooltipTrigger>
				<TooltipContent>{t("header.userMenu")}</TooltipContent>
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
					<span>{t("auth.signOut")}</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
