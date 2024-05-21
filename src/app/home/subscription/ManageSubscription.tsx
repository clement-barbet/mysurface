import { Button } from "@/components/ui/button";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function ManageSubscription({ billing, setBilling, user }) {
	const supabase = createClientComponentClient();

	const handleNewTrial = async () => {
		if (!user) {
			return;
		}
		const { data, error } = await supabase.rpc("update_billing_trial", {
			logged_user_id: user.id,
		});

		if (error) {
			console.error("Error updating billing trial:", error);
		} else {
			console.log("Billing trial updated successfully:", data);
			setBilling((prevState) => ({
				...prevState,
				subscription: "trial",
				status: "active",
				isTrialUsed: true,
				expiration_date: new Date(
					Date.now() + 30 * 24 * 60 * 60 * 1000
				),
			}));
		}
	};

	return (
		<div className="text-sm m-2">
			{billing.status === "active" ? (
				<p>
					Your subscription is{" "}
					<span className="font-semibold uppercase text-accent_color px-1">
						active
					</span>
					. Enjoy it!
				</p>
			) : billing.subscription === "none" && !billing.isTrialUsed ? (
				<div>
					<p>
						You have a{" "}
						<span className="font-semibold uppercase text-accent_color px-1">
							free trial
						</span>{" "}
						available.
					</p>
					<div className="flex justify-end">
						<Button
							variant="login"
							className="my-2 w-full md:w-3/5 lg:w-2/5 xl:w-1/5 uppercase text-base"
							onClick={handleNewTrial}
						>
							Start free trial now
						</Button>
					</div>
				</div>
			) : (
				<div>
					<p>
						Your subscription is{" "}
						<span className="font-semibold uppercase text-accent_delete px-1">
							inactive
						</span>
						.
					</p>
					<div className="flex justify-end">
						<Button
							variant="signup"
							className="my-2 w-full md:w-3/5 lg:w-2/5 xl:w-1/5 uppercase text-base"
						>
							Checkout yearly plan
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
