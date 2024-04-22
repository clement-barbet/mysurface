import ResetPasswordFrom from "@/components/auth/email/reset_password";
import ChangeOrganization from "@/components/account/change_organization";
export default function Dashboard() {
	return (
		<div className="flex flex-col gap-y-2 lg:flex-row lg:gap-x-2">
			<div className="w-full p-5 shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
				<ResetPasswordFrom />
			</div>
			<div className="w-full p-5 shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
				<ChangeOrganization />
			</div>
		</div>
	);
}
