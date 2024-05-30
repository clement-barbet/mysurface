"use client";

import Loading from "@/components/ui/loading";
import { fetchUser } from "@/db/auth_user/fetchUser";
import { fetchBilling } from "@/db/billings/fetchBillingByUserId";
import { useEffect, useState } from "react";
import LicenseDetails from "./LicenseDetails";
import ManageLicenseDev from "./ManageLicenseDev";
import T from "@/components/translations/translation";
import LicenseTypes from "./LicenseTypes";

export default function License() {
	const [loading, setLoading] = useState(true);
	const [billing, setBilling] = useState(null);
	const [user, setUser] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const fetchedUser = await fetchUser();
				const userId = fetchedUser.id;
				setUser(fetchedUser);
				const fetchedBilling = await fetchBilling(userId);
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
					<T tkey="license.titles.details.title" />
				</h2>
				<p className="text-gray-600 dark:text-gray-400 text-lg md:text-base">
					<T tkey="license.titles.details.subtitle" />
				</p>
				<LicenseDetails billing={billing} />
			</div>
			<div className="p-5 py-h-auto w-full flex flex-col shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
				<h2 className="text-lg mb-2 font-semibold border-l-4 border-mid_blue pl-2">
					<T tkey="license.titles.manage.title" />
				</h2>
				<p className="text-gray-600 dark:text-gray-400 text-lg md:text-base">
					<T tkey="license.titles.manage.subtitle" />
				</p>
				<ManageLicenseDev billing={billing} user={user} />
			</div>
			<div className="p-5 py-h-auto w-full flex flex-col shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
				<h2 className="text-lg mb-2 font-semibold border-l-4 border-mid_blue pl-2">
					<T tkey="license.titles.types.title" />
				</h2>
				<p className="text-gray-600 dark:text-gray-400 text-lg md:text-base">
					<T tkey="license.titles.types.subtitle" />
				</p>
				<LicenseTypes />
			</div>
		</div>
	);
}
