export default function SubscriptionDetails({ billing }) {
	if (billing) {
		if (!billing.expiration_date || billing.status === "inactive") {
			billing.expiration_date = "N/A";
			billing.days_until_expiration = "N/A";
		}

		if (billing.expiration_date && billing.expiration_date !== "N/A") {
			const date_expiration = new Date(billing.expiration_date);
			const formattedDate_expiration =
				date_expiration.toLocaleDateString("en-CA");

			billing.expiration_date = formattedDate_expiration;

			const expirationDate = new Date(billing.expiration_date);
			const currentDate = new Date();
			const diffTime = Math.abs(
				expirationDate.getTime() - currentDate.getTime()
			);
			const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

			billing.days_until_expiration = diffDays;
		}

		const date_update = new Date(billing.updated_at);
		const formattedDate_update = date_update.toLocaleDateString("en-CA");

		billing.updated_at = formattedDate_update;
	}

	return (
		<div className="text-sm m-2 capitalize flex flex-col gap-y-1">
			{billing ? (
				<>
					<p>
						<span className="font-semibold">Subscription</span>:{" "}
						{billing.subscription}
					</p>
					<p>
						<span className="font-semibold">Status</span>:{" "}
						{billing.status}
					</p>
					<p>
						<span className="font-semibold">Update Date</span>:{" "}
						{billing.updated_at}
					</p>
					<p>
						<span className="font-semibold">Expiration date</span>:{" "}
						{billing.expiration_date}
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
	);
}
