import { NextRequest, NextResponse } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

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