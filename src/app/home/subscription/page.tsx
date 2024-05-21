"use client";

import Loading from "@/components/ui/loading";
import { fetchUser } from "@/db/auth_user/fetchUser";
import { fetchBilling } from "@/db/billings/fetchBillingByUserId";
import { useEffect, useState } from "react";

export default function Subscription() {
	const [loading, setLoading] = useState(true);
	const [billing, setBilling] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const fetchedUser = await fetchUser();
				const userId = fetchedUser.id;
				const fetchedBilling = await fetchBilling(userId);
				if (fetchedBilling) {
					if (!fetchedBilling.expiration_date) {
						fetchedBilling.expiration_date = "N/A";
						fetchedBilling.days_until_expiration = "N/A";
					}

					if (
						fetchedBilling.expiration_date &&
						fetchedBilling.expiration_date !== "N/A"
					) {
						const date_expiration = new Date(
							fetchedBilling.expiration_date
						);
						const formattedDate_expiration =
							date_expiration.toLocaleDateString("en-CA");

						fetchedBilling.expiration_date =
							formattedDate_expiration;

						const expirationDate = new Date(
							fetchedBilling.expiration_date
						);
						const currentDate = new Date();
						const diffTime = Math.abs(
							expirationDate.getTime() - currentDate.getTime()
						);
						const diffDays = Math.ceil(
							diffTime / (1000 * 60 * 60 * 24)
						);

						fetchedBilling.days_until_expiration = diffDays;
					}

					const date_update = new Date(fetchedBilling.updated_at);
					const formattedDate_update =
						date_update.toLocaleDateString("en-CA");

					fetchedBilling.updated_at = formattedDate_update;
				}
				setBilling(fetchedBilling);
			} catch (error) {
				console.error("Error fetching data:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	if (loading) {
		return <Loading />;
	}

	return (
		<div className="flex flex-col gap-y-2">
			<div className="p-5 py-h-auto w-full flex flex-col shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
				<h2 className="text-lg mb-2 font-semibold border-l-4 border-mid_blue pl-2">
					Subscription details
				</h2>
				<p className="text-gray-600 dark:text-gray-400 text-lg md:text-base">
					Actual subscription details will be shown here.
				</p>
				<div className="text-sm m-2 capitalize flex flex-col gap-y-1">
					{billing ? (
						<>
							<p>
								<span className="font-semibold">
									Subscription
								</span>
								: {billing.subscription}
							</p>
							<p>
								<span className="font-semibold">Status</span>:{" "}
								{billing.status}
							</p>
							<p>
								<span className="font-semibold">
									Update Date
								</span>
								: {billing.updated_at}
							</p>
							<p>
								<span className="font-semibold">
									Expiration date
								</span>
								: {billing.expiration_date}
							</p>
							<p>
								<span className="font-semibold">
									Days until expiration
								</span>
								: {billing.days_until_expiration}
							</p>
						</>
					) : null}
				</div>
			</div>
			<div className="p-5 py-h-auto w-full flex flex-col shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
				<h2 className="text-lg mb-2 font-semibold border-l-4 border-mid_blue pl-2">
					Manage subscription
				</h2>
				<p className="text-gray-600 dark:text-gray-400 text-lg md:text-base">
					Here you can manage your subscription.
				</p>
			</div>
		</div>
	);
}
