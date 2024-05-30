"use client";
import ResetPasswordForm from "@/components/auth/email/reset_password";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import T from "@/components/translations/translation";
import Loading from "@/components/ui/loading";
import { ErrorMessage } from "@/components/ui/msg/error_msg";

export default function ResetPassword() {
	const supabase = createClientComponentClient();
	const [userSB, setUserSB] = useState(null);
	const [errorMessage, setErrorMessage] = useState("");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				setLoading(true);
				supabase.auth.onAuthStateChange(async (event, session) => {
					if (event === "SIGNED_IN") {
						setUserSB(session.user);
						if (!session.user) {
							setErrorMessage("error.my-info.session");
						}
					}
				});
			} catch (error) {
				console.error("Error fetching user: ", error);
				setErrorMessage("error.my-info.session");
			} finally {
				setLoading(false);
			}
		};

		fetchUser();
	}, []);

	if (loading) {
		return <Loading />;
	}

	return (
		userSB &&
		userSB.email && (
			<>
				<ErrorMessage
					errorMessage={errorMessage}
					setErrorMessage={setErrorMessage}
				/>
				<div className="w-full md:w-1/2 m-auto mt-10 p-5 shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
					<h2 className="italic text-sm text-right">
						<T tkey="reset-password.account" />: {userSB.email}
					</h2>
					<ResetPasswordForm />
				</div>
			</>
		)
	);
}
