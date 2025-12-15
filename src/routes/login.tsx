import { createFileRoute } from "@tanstack/react-router";
import { SignIn } from "@/components/Auth/SignIn";

export const Route = createFileRoute("/login")({
	component: LoginPage,
});

function LoginPage() {
	return (
		<div className="flex items-center justify-center min-h-[calc(100vh-200px)] p-4">
			<SignIn />
		</div>
	);
}
