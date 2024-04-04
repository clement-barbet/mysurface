import NewPasswordForm from "@/components/account/new_passwd_form";
export default function Dashboard() {
	return (
		<div className="w-full md:w-1/2 p-5 shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
			<NewPasswordForm />
		</div>
	);
}
