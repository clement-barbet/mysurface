"use client";
import ResetPasswordForm from "@/components/auth/email/reset_password";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import T from "@/components/translations/translation";

export default function ResetPassword() {
	const supabase = createClientComponentClient();
	const [userSB, setUserSB] = useState(null);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const session = await supabase.auth.getSession();
				if (session) {
					setUserSB(session.data.session.user);
				}
			} catch (error) {
				console.error("Error fetching user", error);
			}
		};

		fetchUser();
	}, []);

	return (
		userSB &&
		userSB.email && (
			<div className="w-full md:w-1/2 m-auto mt-10 p-5 shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
				<h2 className="italic text-sm text-right">
					<T tkey="reset-password.account" />: {userSB.email}
				</h2>
				<ResetPasswordForm />
			</div>
		)
	);
}
