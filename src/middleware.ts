import { NextRequest, NextResponse } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { serialize, parse } from "cookie";

export async function middleware(req: NextRequest) {
	const res = NextResponse.next();
	const supabase = createMiddlewareClient({ req, res });
	const { data: session, error } = await supabase.auth.getSession();

	const userId = session?.session?.user?.id;

	const cookieHeader = req.headers.get("Cookie");
	let isAdmin = undefined;

	if (cookieHeader) {
		const cookies = parse(cookieHeader);
		const isAdminCookie = cookies["isAdmin"];
		if (isAdminCookie && isAdminCookie !== "undefined") {
			isAdmin = JSON.parse(isAdminCookie);
		}
	}

	// Fetch the user's isAdmin status from the database if it's not in the cookies
	if (isAdmin === undefined) {
		const { data: data, error: userError } = await supabase
			.from("app_users")
			.select("isAdmin")
			.eq("id", userId)
			.single();

		isAdmin = data?.isAdmin;

		// Set the isAdmin cookie to expire in 30 days
		res.headers.set(
			"Set-Cookie",
			serialize("isAdmin", JSON.stringify(isAdmin), {
				path: "/",
				maxAge: 30 * 24 * 60 * 60,
			})
		);
	} else {
		isAdmin = JSON.parse(isAdmin);
	}

	// Protect the /home route and its children
	if (req.nextUrl.pathname.startsWith("/home")) {
		// Redirect to /login if the user is not logged in
		if (error || !session?.session) {
			return NextResponse.redirect(`${req.nextUrl.origin}/login`);
		}
		// Redirect to /client if the user is not an admin
		else if (!isAdmin) {
			return NextResponse.redirect(`${req.nextUrl.origin}/client`);
		}
	}

	// Protect the /client route and its children
	if (req.nextUrl.pathname.startsWith("/client")) {
		// Redirect to /login if the user is not logged in
		if (error || !session?.session) {
			return NextResponse.redirect(`${req.nextUrl.origin}/login`);
		}
		// If the user is an admin, redirect to /home
		else if (isAdmin) {
			return NextResponse.redirect(`${req.nextUrl.origin}/home`);
		}
	}

	// Redirect from root to /login if the user is not logged in or to /home or /client if they are
	if (req.nextUrl.pathname === "/") {
		if (error || !session?.session) {
			return NextResponse.redirect(`${req.nextUrl.origin}/login`);
		} else {
			if (isAdmin) {
				return NextResponse.redirect(`${req.nextUrl.origin}/home`);
			} else {
				return NextResponse.redirect(`${req.nextUrl.origin}/client`);
			}
		}
	}

	// Redirect from /login to /home or /client if the user is logged in
	if (req.nextUrl.pathname === "/login" && session?.session) {
		if (isAdmin) {
			return NextResponse.redirect(`${req.nextUrl.origin}/home`);
		} else {
			return NextResponse.redirect(`${req.nextUrl.origin}/client`);
		}
	}

	return res;
}
