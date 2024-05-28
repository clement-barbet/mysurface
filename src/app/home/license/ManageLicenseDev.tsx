import { Button } from "@/components/ui/button";
import { loadStripe } from "@stripe/stripe-js";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { ErrorMessage } from "@/components/ui/msg/error_msg";
import { SuccessMessage } from "@/components/ui/msg/success_msg";
import { useRouter } from "next/navigation";
import T from "@/components/translations/translation";

export default function ManageLicenseDev({ billing, user }) {
	const public_key = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY_DEV;
	const stripePromise = loadStripe(public_key);
	const supabase = createClientComponentClient();
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const router = useRouter();

	useEffect(() => {
		const fetchSession = async () => {
			try {
				const urlParams = new URLSearchParams(window.location.search);
				const sessionId = urlParams.get("session_id");

				if (sessionId) {
					const response = await fetch(
						`/api/stripe-get-session-dev`,
						{
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify({ session_id: sessionId }),
						}
					);

					if (!response.ok) {
						throw new Error(
							`Network response was not ok, status: ${response.status}`
						);
					}

					const responseData = await response.json();
					const fetchedSession = responseData.data;
					console.log("Session data:", fetchedSession);

					if (fetchedSession.status === "complete") {
						setSubscription(fetchedSession);
					} else {
						setErrorMessage("error.license");
					}
				}
			} catch (error) {
				console.error("Error fetching session:", error);
			}
		};

		fetchSession();
	}, []);

	const setSubscription = async (session) => {
		if (!user) {
			return;
		}

		if (session.status === "complete") {
			const { data, error } = await supabase.rpc(
				"update_billing_yearly",
				{
					logged_user_id: user.id,
					stripe_session_id: session.id,
					stripe_customer_id: session.customer,
				}
			);

			if (error) {
				console.error("Error updating billing subscription:", error);
			} else {
				setSuccessMessage("success.license.purchase");
				router.push("/home/license");
				setTimeout(() => {
					location.reload();
				}, 1000);
			}
		}
	};

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
			setSuccessMessage("success.license.trial");
			setTimeout(() => {
				location.reload();
			}, 1000);
		}
	};

	const handleCheckout = async () => {
		const stripe = await stripePromise;

		if (!stripe) {
			console.error("Failed to load Stripe");
			return;
		}

		const response = await fetch("/api/stripe-checkout-dev", {
			method: "POST",
		});

		if (!response.ok) {
			throw new Error(
				`Network response was not ok, status: ${response.status}`
			);
		}

		let data = {};
		if (
			response.headers.get("content-type")?.includes("application/json")
		) {
			data = await response.json();
		}

		const { id } = data;

		const { error } = await stripe.redirectToCheckout({ sessionId: id });

		if (error) {
			console.error("Failed to start checkout:", error);
		}
	};

	const renderActiveSubscriptionType = () => {
		if (billing.status === "active") {
			if (billing.subscription === "trial") {
				return (
					<span className="lowercase font-semibold underline underline-offset-4">
						<T tkey="license.details.type.options.trial" />
					</span>
				);
			} else if (billing.subscription === "yearly") {
				return (
					<span className="lowercase font-semibold underline underline-offset-4">
						<T tkey="license.details.type.options.yearly" />
					</span>
				);
			} else {
				return (
					<span className="lowercase font-semibold underline underline-offset-4">
						<T tkey="license.details.type.options.lifetime" />
					</span>
				);
			}
		}
	};

	const isExpiringSoon = () => {
		const today = new Date();
		const expirationDate = new Date(billing.expiration_date);
		const diffTime = Math.abs(expirationDate - today);
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays <= 30;
	};

	console.log(isExpiringSoon());

	const renderActiveSubscription = () => {
		if (billing.status === "active") {
			return (
				<>
					<p>
						<T tkey="license.manage.active.a1" />{" "}
						{renderActiveSubscriptionType()}{" "}
						<T tkey="license.manage.active.a2" />{" "}
						<span className="font-semibold uppercase text-accent_color px-1">
							<T tkey="license.manage.active.a3" />
						</span>
						. <T tkey="license.manage.active.a4" />
					</p>
					{billing.subscription === "trial" ||
					(billing.subscription === "yearly" && isExpiringSoon()) ? (
						<div className="mt-2">
							<p>
								{billing.subscription === "trial" ? (
									<T tkey="license.manage.purchase.p2" />
								) : (
									<T tkey="license.manage.purchase.p3" />
								)}{" "}
								<span className="font-semibold uppercase text-mid_blue px-1">
									<T tkey="license.manage.purchase.p4" />
								</span>{" "}
								<T tkey="license.manage.purchase.p5" />.
							</p>
							<div className="flex justify-end">
								<Button
									variant="signup"
									className="my-2 w-full md:w-3/5 lg:w-2/5 xl:w-1/5 uppercase text-base"
									onClick={handleCheckout}
								>
									<T tkey="license.manage.buttons.checkout" />
								</Button>
							</div>
						</div>
					) : null}
				</>
			);
		}
	};

	const renderInactiveSubscription = () => {
		if (billing.status === "inactive") {
			return (
				<>
					<div>
						<p>
							<T tkey="license.manage.inactive.i1" />{" "}
							<span className="font-semibold uppercase text-accent_delete px-1">
								<T tkey="license.manage.inactive.i2" />
							</span>
							.
						</p>
					</div>
					{billing.subscription === "none" && !billing.isTrialUsed ? (
						<>
							<p className="mt-2">
								<T tkey="license.manage.trial.t1" />{" "}
								<span className="font-semibold uppercase text-accent_color px-1">
									<T tkey="license.manage.trial.t2" />
								</span>{" "}
								<T tkey="license.manage.trial.t3" />.
							</p>
							<div className="flex justify-end">
								<Button
									variant="login"
									className="my-2 w-full md:w-3/5 lg:w-2/5 xl:w-1/5 uppercase text-base"
									onClick={handleNewTrial}
								>
									<T tkey="license.manage.buttons.trial" />
								</Button>
							</div>
						</>
					) : null}
					<p>
						<T tkey="license.manage.purchase.p1" />{" "}
						<span className="font-semibold uppercase text-mid_blue px-1">
							<T tkey="license.manage.purchase.p4" />
						</span>{" "}
						<T tkey="license.manage.purchase.p5" />.
					</p>
					<div className="flex justify-end">
						<Button
							variant="signup"
							className="my-2 w-full md:w-3/5 lg:w-2/5 xl:w-1/5 uppercase text-base"
							onClick={handleCheckout}
						>
							<T tkey="license.manage.buttons.checkout" />
						</Button>
					</div>
				</>
			);
		}
	};

	return (
		<>
			<ErrorMessage
				errorMessage={errorMessage}
				setErrorMessage={setErrorMessage}
			/>
			<SuccessMessage
				successMessage={successMessage}
				setSuccessMessage={setSuccessMessage}
			/>
			<div className="text-sm m-2">
				{renderActiveSubscription()}
				{renderInactiveSubscription()}
			</div>
		</>
	);
}
