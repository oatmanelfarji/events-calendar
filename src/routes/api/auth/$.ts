import { createFileRoute } from "@tanstack/react-router";
import { auth } from "@/lib/auth";

export const Route = createFileRoute("/api/auth/$")({
	server: {
		handlers: {
			GET: async ({ request }: { request: Request }) => {
				console.log("Auth GET request:", request.url);
				const res = await auth.handler(request);
				console.log("Auth GET response status:", res.status);
				return res;
			},
			POST: async ({ request }: { request: Request }) => {
				console.log("Auth POST request:", request.url);
				const res = await auth.handler(request);
				console.log("Auth POST response status:", res.status);
				if (res.status >= 400) {
					const clonedRes = res.clone();
					try {
						const body = await clonedRes.json();
						console.log("Auth POST error body:", body);
					} catch (e) {
						console.log("Auth POST error (not JSON)");
					}
				}
				return res;
			},
		},
	},
});

// import { createFileRoute } from "@tanstack/react-router";
// import { auth } from "@/lib/auth";

// export const Route = createFileRoute("/api/auth/$")({
// 	loader: ({ request }) => {
// 		return auth.handler(request);
// 	},
// 	action: ({ request }) => {
// 		return auth.handler(request);
// 	},
// });
