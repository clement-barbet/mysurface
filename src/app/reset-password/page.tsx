"use client";
import ResetPasswordForm from "@/components/auth/email/reset_password";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

export default function ResetPassword() {
	const supabase = createClientComponentClient();
	const [userSB, setUserSB] = useState(null);

	useEffect(() => {
		const fetchUser = async () => {
			const session = await supabase.auth.getSession();
			if (session) {
				setUserSB(session.data.session.user);
			}
		};

		fetchUser();
	}, []);

	return (
		userSB &&
		userSB.email && (
			<div className="w-full md:w-1/2 m-auto mt-10 p-5 shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
				<h2 className="italic text-sm text-right">Account: {userSB.email}</h2>
				<ResetPasswordForm />
			</div>
		)
	);
}
