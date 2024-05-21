import { NextResponse } from "next/server";

const secret_key = process.env.STRIPE_SECRET_KEY;
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const returnUrl = `${baseUrl}/home/subscription`;
const stripe = require("stripe")(secret_key);

export async function POST(req: Request) {
	const price_id = process.env.STRIPE_PRICE_ID;
	const session = await stripe.checkout.sessions.create({
		payment_method_types: ["card"],
		line_items: [{ price: price_id, quantity: 1 }],
		mode: "subscription",
		success_url: returnUrl,
		cancel_url: returnUrl,
	});

	return NextResponse.json({ id: session.id });
}
