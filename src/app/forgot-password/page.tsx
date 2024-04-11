"use client";
import ForgotPassword from "@/components/auth/email/forgot_password";
import T from "@/components/translations/translation";

export default function LoginPage() {
	return (
		<>
			<div className="flex flex-col items-center gap-y-4 mt-5 px-10 md:px-0">
				<h2 className="w-full md:w-1/2 text-4xl pb-4 text-left"><T tkey="forgotpassword.title" /></h2>
				<div className="w-full md:w-1/2 md:m-auto p-5 shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
					<ForgotPassword />
				</div>
			</div>
		</>
	);
}
