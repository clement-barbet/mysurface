import { NextRequest, NextResponse } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req: NextRequest) {
	const res = NextResponse.next();
	const supabase = createMiddlewareClient({ req, res });
	const { data: session, error } = await supabase.auth.getSession();

    // When trying to access the root path, redirect to /home if the user is logged in
	if (req.nextUrl.pathname === "/") {
		if (session?.session) {
			return NextResponse.redirect(`${req.nextUrl.origin}/home`);
		} else {
			return NextResponse.redirect(`${req.nextUrl.origin}/login`);
		}
	}

    // Protect the /home route and its children
	if (!req.nextUrl.pathname.startsWith("/home")) {
		return res;
	}

    // Redirect to /login if the user is not logged in
	if (error || !session?.session) {
		return NextResponse.redirect(`${req.nextUrl.origin}/login`);
	}

	return res;
}
