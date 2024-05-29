import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: Request) {
	try {
		const supabase = createServerComponentClient({ cookies });
		const { logged_user_id, stripe_session_id, stripe_customer_id } =
			await req.json();

		const { data, error } = await supabase.rpc("update_billing_yearly", {
			logged_user_id: logged_user_id,
			stripe_session_id: stripe_session_id,
			stripe_customer_id: stripe_customer_id,
		});

		if (error) {
			throw new Error(error.message);
		}

		return new Response("Updated billing yearly", {
			status: 200,
		});
	} catch (error) {
		console.error("Failed to update billing yearly: ", error);
		return new Response("Failed to update billing yearly", { status: 500 });
	}
}
