"use client";
import {
	User,
	createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import ResetPasswordFrom from "@/components/auth/email/reset_password";
import ChangeOrganization from "@/components/account/change_organization";
import ChangeLanguage from "@/components/account/change_language";
import ChangeNames from "@/components/account/change_names";
import DeleteAccountButton from "@/components/account/delete_account_btn";
import { useEffect, useState } from "react";
import Loading from "@/components/ui/loading";

export default function Account() {
	const supabase = createClientComponentClient();
	const [userId, setUserId] = useState(null);
	const [loading, setLoading] = useState(true);

	const fetchUser = async () => {
		try {
			const fetchedUser = await supabase.auth.getUser();
			if (!fetchedUser.data.user)
				throw new Error("User not authenticated");
			return fetchedUser.data.user;
		} catch (error) {
			console.error("Error fetching user", error);
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const fetchedUser = await fetchUser();
				const fetchedUserId = fetchedUser.id;
				setUserId(fetchedUserId);
			} catch (error) {
				console.error("Error fetching data", error);
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
		<>
			<div className="flex flex-col gap-y-2">
				{" "}
				<div className="w-full p-5 shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
					<ChangeNames userId={userId} />
				</div>
				<div className="w-full p-5 shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
					<ChangeOrganization userId={userId} />
				</div>
				<div className="w-full p-5 shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
					<ChangeLanguage userId={userId} />
				</div>
				<div className="w-full p-5 shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
					<ResetPasswordFrom />
				</div>
				<div className="w-full p-5 shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
					<DeleteAccountButton userId={userId} />
				</div>
			</div>
		</>
	);
}
