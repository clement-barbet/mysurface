import { NextResponse } from "next/server";

const secret_key = process.env.STRIPE_SECRET_KEY;
const stripe = require("stripe")(secret_key);

export async function POST(req: Request) {
	const body = await req.json();
	const { session_id } = body;

	if (!session_id || Array.isArray(session_id)) {
		return NextResponse.json(
			{ error: "Invalid session ID." },
			{ status: 400 }
		);
	}

	try {
		const session = await stripe.checkout.sessions.retrieve(session_id);
		return NextResponse.json({ data: session }, { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: "Failed to retrieve session." },
			{ status: 500 }
		);
	}
}
