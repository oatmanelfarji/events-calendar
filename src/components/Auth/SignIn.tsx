import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { authClient } from "@/lib/auth-client";

export function SignIn() {
	const [isSignUp, setIsSignUp] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			if (isSignUp) {
				await authClient.signUp.email(
					{
						email,
						password,
						name,
					},
					{
						onSuccess: () => {
							navigate({ to: "/" });
						},
						onError: (ctx) => {
							console.error("Sign up error context:", ctx);
							alert(ctx.error.message ?? "Failed to sign up");
							setIsLoading(false);
						},
					},
				);
			} else {
				await authClient.signIn.email(
					{
						email,
						password,
					},
					{
						onSuccess: () => {
							navigate({ to: "/" });
						},
						onError: (ctx) => {
							console.error("Sign in error context:", ctx);
							alert(ctx.error.message ?? "Failed to sign in");
							setIsLoading(false);
						},
					},
				);
			}
		} catch (error) {
			console.error(error);
			setIsLoading(false);
		}
	};

	return (
		<div className="w-full max-w-md p-6 bg-card rounded-lg shadow-lg border border-border">
			<h2 className="text-2xl font-bold mb-6 text-center text-foreground">
				{isSignUp ? "Create Account" : "Login"}
			</h2>
			<form onSubmit={handleSubmit} className="space-y-4">
				{isSignUp && (
					<div className="space-y-2">
						<Label htmlFor="name">Name</Label>
						<Input
							id="name"
							type="text"
							placeholder="John Doe"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
						/>
					</div>
				)}
				<div className="space-y-2">
					<Label htmlFor="email">Email</Label>
					<Input
						id="email"
						type="email"
						placeholder="user@example.com"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="password">Password</Label>
					<Input
						id="password"
						type="password"
						placeholder="••••••••"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading ? "Loading..." : isSignUp ? "Sign Up" : "Login"}
						</Button>
					</TooltipTrigger>
					<TooltipContent>{isSignUp ? "Sign Up" : "Login"}</TooltipContent>
				</Tooltip>
			</form>
			<div className="mt-4 text-center">
				<Tooltip>
					<TooltipTrigger asChild>
						<button
							type="button"
							onClick={() => setIsSignUp(!isSignUp)}
							className="text-sm text-primary hover:underline"
						>
							{isSignUp
								? "Already have an account? Login"
								: "Don't have an account? Sign Up"}
						</button>
					</TooltipTrigger>
					<TooltipContent>
						{isSignUp ? "Switch to Login" : "Switch to Sign Up"}
					</TooltipContent>
				</Tooltip>
			</div>
		</div>
	);
}
