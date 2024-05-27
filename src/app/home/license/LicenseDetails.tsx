import T from "@/components/translations/translation";
import { useEffect, useState } from "react";

export default function LicenseDetails({ billing }) {
	const licenseTranslationKeys = {
		none: "license.details.type.options.none",
		trial: "license.details.type.options.trial",
		yearly: "license.details.type.options.yearly",
		lifetime: "license.details.type.options.lifetime",
	};

	const licenseStatusTranslationKeys = {
		active: "license.details.status.options.active",
		inactive: "license.details.status.options.inactive",
	};

	const [statusKey, setStatusKey] = useState(null);
	const [licenseKey, setLicenseKey] = useState(null);

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

	useEffect(() => {
		if (billing) {
			const licenseKey = licenseTranslationKeys[billing.subscription];
			setLicenseKey(licenseKey);

			const statusKey = licenseStatusTranslationKeys[billing.status];
			setStatusKey(statusKey);
		}
	}, [billing]);

	return (
		<div className="text-sm m-2 flex flex-col gap-y-1">
			{billing ? (
				<>
					<p>
						<span className="font-semibold">
							<T tkey="license.details.type.title" />
						</span>
						: <T tkey={licenseKey} />
					</p>
					<p>
						<span className="font-semibold">
							<T tkey="license.details.status.title" />
						</span>
						: <T tkey={statusKey} />
					</p>
					<p>
						<span className="font-semibold">
							<T tkey="license.details.update" />
						</span>
						: {billing.updated_at}
					</p>
					<p>
						<span className="font-semibold">
							<T tkey="license.details.expiration" />
						</span>
						: {billing.expiration_date}
					</p>
					<p>
						<span className="font-semibold">
							<T tkey="license.details.days" />
						</span>
						: {billing.days_until_expiration}
					</p>
				</>
			) : null}
		</div>
	);
}
