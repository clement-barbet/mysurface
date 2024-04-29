"use client";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	THeadRow,
	TBodyRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function Customers() {
	const [loading, setLoading] = useState(true);
	const supabase = createClientComponentClient();
	const [users, setUsers] = useState([]);

	const fetchUsers = async () => {
		setLoading(true);
		let { data: appSettings, error } = await supabase
			.from("app_settings")
			.select("*");

		if (error) {
			console.log("Error fetching users: ", error);
			setLoading(false);
			return;
		}

		let { data: languagesData, error: languagesError } = await supabase
			.from("languages")
			.select("*");

		if (languagesError) {
			console.log("Error fetching languages: ", languagesError);
			setLoading(false);
			return;
		}

		let { data: organizationsData, error: organizationsError } =
			await supabase.from("organizations").select("*");

		if (organizationsError) {
			console.log("Error fetching organizations: ", organizationsError);
			setLoading(false);
			return;
		}

		let usersWithLanguageAndOrganizationNames = appSettings.map(
			(setting) => {
				let language = languagesData.find(
					(language) => language.id === setting.language_id
				);
				let organization = organizationsData.find(
					(organization) =>
						organization.id === setting.organization_id
				);
				return {
					...setting,
					language_name: language
						? language.name
						: "Language not found",
					organization_type: organization
						? organization.name
						: "Organization not found",
				};
			}
		);

		setUsers(usersWithLanguageAndOrganizationNames);
		console.log("users", usersWithLanguageAndOrganizationNames);
		setLoading(false);
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	const deleteUser = async (userId) => {
		const { error } = await supabase.rpc("delete_user", {
			user_id: userId,
		});

		if (error) {
			console.log("Error deleting user: ", error);
		} else {
			fetchUsers();
		}
	};

	return (
		!loading && (
			<>
				<div className="w-full m-auto">
					<h2 className="text-3xl pb-2">All Customers</h2>
					{users.length > 0 ? (
						<Table className="w-full">
							<TableHeader>
								<THeadRow>
									{[
										"Name",
										"Email",
										"Organization",
										"Organization type",
										"Language",
										"Delete user",
									].map((header, index) => (
										<TableHead key={index}>
											{header}
										</TableHead>
									))}
								</THeadRow>
							</TableHeader>
							<TableBody className="bg-white dark:bg-black divide-y divide-gray-200 dark:divide-gray-500">
								{users.map((user) => {
									return (
										<TBodyRow key={user.id}>
											<TableCell className="px-6 py-2 whitespace-nowrap">
												{user.name}
											</TableCell>
											<TableCell className="px-6 py-2 whitespace-nowrap">
												{user.email}
											</TableCell>
											<TableCell className="px-6 py-2 whitespace-nowrap">
												{user.organization}
											</TableCell>
											<TableCell className="px-6 py-2 whitespace-nowrap">
												{user.organization_type}
											</TableCell>
											<TableCell className="px-6 py-2 whitespace-nowrap">
												{user.language_name}
											</TableCell>
											<TableCell className="px-6 py-2 whitespace-nowrap">
												<Button
													variant="delete"
													onClick={() =>
														deleteUser(user.user_id)
													}
												>
													Delete
												</Button>
											</TableCell>
										</TBodyRow>
									);
								})}
							</TableBody>
						</Table>
					) : (
						<p>No data</p>
					)}
				</div>
			</>
		)
	);
}
