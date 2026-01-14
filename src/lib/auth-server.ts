"use server";

import { getRequest } from "@tanstack/react-start/server";
import { auth } from "./auth";

/**
 * Get the current session from the request headers.
 * Use this in server functions to verify authentication.
 */
export async function getServerSession() {
	const request = getRequest();
	if (!request) {
		return null;
	}

	const session = await auth.api.getSession({
		headers: request.headers,
	});

	return session;
}

/**
 * Require authentication in a server function.
 * Throws an error if the user is not authenticated.
 */
export async function requireAuth() {
	const session = await getServerSession();

	if (!session?.user) {
		throw new Error("Unauthorized: Please sign in to continue");
	}

	return session;
}
