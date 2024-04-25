import ResetPasswordForm from "@/components/auth/email/reset_password";
export default function ResetPassword() {
	return (
		<div className="w-full md:w-1/2 m-auto mt-10 p-5 shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
			<ResetPasswordForm />
		</div>
	);
}
