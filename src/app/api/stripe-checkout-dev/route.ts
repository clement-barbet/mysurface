import { NextResponse } from "next/server";

const secret_key = process.env.STRIPE_SECRET_KEY_DEV;
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const returnUrlSubs = `${baseUrl}/home/license`;
const returnUrlSuccess = `${returnUrlSubs}?session_id={CHECKOUT_SESSION_ID}`;
const stripe = require("stripe")(secret_key);

export async function POST() {
	const price_id = process.env.STRIPE_PRICE_ID_DEV;
	const session = await stripe.checkout.sessions.create({
		payment_method_types: ["card"],
		line_items: [{ price: price_id, quantity: 1 }],
		mode: "payment",
		success_url: returnUrlSuccess,
		cancel_url: returnUrlSubs,
	});

	return NextResponse.json({ id: session.id });
}