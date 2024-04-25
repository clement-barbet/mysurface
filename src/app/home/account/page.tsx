import ResetPasswordFrom from "@/components/auth/email/reset_password";
import ChangeOrganization from "@/components/account/change_organization";
import ChangeLanguage from "@/components/account/change_language";
import ChangeNames from "@/components/account/change_names";
export default function Account() {
	return (
		<div className="flex flex-col gap-y-4">
			{" "}
			<div className="w-full p-5 shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
				<ResetPasswordFrom />
			</div>
			<div className="w-full p-5 shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
				<ChangeNames />
			</div>
			<div className="w-full p-5 shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
				<ChangeOrganization />
			</div>
			<div className="w-full p-5 shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
				<ChangeLanguage />
			</div>
		</div>
	);
}
