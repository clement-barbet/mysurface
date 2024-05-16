import { NextRequest, NextResponse } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

//TODO: Control routes based on roles of database.
export async function middleware(req: NextRequest) {
	const res = NextResponse.next();

	const supabase = createMiddlewareClient({ req, res });
	const { data: user, error } = await supabase.auth.getUser();

	// Protect the /home route and its children
	if (req.nextUrl.pathname.startsWith("/home")) {
		// Redirect to /login if the user is not logged in
		if (error || !user?.user) {
			return NextResponse.redirect(`${req.nextUrl.origin}/login`);
		}
	}

	// Check for admin routes
	if (
		req.nextUrl.pathname.startsWith("/home/results-admin") ||
		req.nextUrl.pathname.startsWith("/home/customers-admin") ||
		req.nextUrl.pathname.startsWith("/home/backup") ||
		req.nextUrl.pathname.startsWith("/home/participants-admin") ||
		req.nextUrl.pathname.startsWith("/home/modeling") ||
		req.nextUrl.pathname.startsWith("/home/news") 

	) {
		// Check if the user has the "authenticated" role
		const { data: role, error: roleError } = await supabase
			.from("roles")
			.select("role")
			.eq("user_id", user.user.id)
			.single();

		if (roleError) {
			console.error(roleError);
		}

		if (role && role.role === "authenticated") {
			return NextResponse.error('Not Found', 404);
		}
	}

	if (req.nextUrl.pathname === "/") {
		if (error || !user?.user) {
			return NextResponse.redirect(`${req.nextUrl.origin}/login`);
		} else {
			return NextResponse.redirect(`${req.nextUrl.origin}/home`);
		}
	}

	if (req.nextUrl.href === req.nextUrl.origin + req.nextUrl.pathname) {
		return res;
	}

	return res;
}
