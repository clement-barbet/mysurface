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
import { Select, MenuItem } from "@mui/material";

export default function Customers() {
	const [loading, setLoading] = useState(true);
	const supabase = createClientComponentClient();
	const [users, setUsers] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [usersPerPage, setUsersPerPage] = useState(5);
	const [totalRows, setTotalRows] = useState(0);

	const handleResultsPerPageChange = (event) => {
		setUsersPerPage(event.target.value);
		setCurrentPage(1);
	};

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [usersPerPage]);

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

		let usersWithLanguageAndOrganizationNames = appSettings
			.map((setting) => {
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
			})
			.filter((user) => user.organization !== "BAAART");

		setUsers(usersWithLanguageAndOrganizationNames);
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

	const indexOfLastUser = currentPage * usersPerPage;
	const indexOfFirstUser = indexOfLastUser - usersPerPage;
	const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
	useEffect(() => {
		setTotalRows(users.length);
	}, [users]);
	let usersPerPageOptions;

	if (totalRows >= 5) {
		usersPerPageOptions = Array.from(
			{ length: Math.floor(totalRows / 5) },
			(_, i) => (i + 1) * 5
		);

		if (totalRows % 5 !== 0) {
			usersPerPageOptions.push(totalRows);
		}
	}

	return (
		!loading && (
			<>
				<div className="w-full m-auto">
					<h2 className="text-3xl pb-2">All Customers</h2>
					{users.length > 0 ? (
						<>
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
									{currentUsers.map((user) => {
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
															deleteUser(
																user.user_id
															)
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
							<div className="flex flex-col flex-wrap justify-center">
								<div className="w-1/3 m-auto pt-4 flex flex-row gap-x-6 items-center justify-center">
									<Button
										onClick={() => setCurrentPage(1)}
										disabled={currentPage === 1}
										variant="delete"
										className="w-full inline-block"
									>
										First
									</Button>
									<Button
										onClick={() =>
											setCurrentPage(currentPage - 1)
										}
										disabled={currentPage === 1}
										className="w-full inline-block"
									>
										Previous
									</Button>
									<Button
										onClick={() =>
											setCurrentPage(currentPage + 1)
										}
										disabled={
											currentPage ===
											Math.ceil(
												users.length /
													usersPerPage
											)
										}
										className="w-full inline-block"
									>
										Next
									</Button>
									<Button
										onClick={() =>
											setCurrentPage(
												Math.ceil(
													users.length /
													usersPerPage
												)
											)
										}
										disabled={
											currentPage ===
											Math.ceil(
												users.length /
												usersPerPage
											)
										}
										variant="delete"
										className="w-full inline-block"
									>
										Last
									</Button>
								</div>
							</div>
							{totalRows > 5 && (
								<div className="flex flex-row justify-center items-baseline gap-x-2 mt-4">
									<p>Results per page: </p>
									<div>
										<Select
											value={usersPerPage}
											onChange={
												handleResultsPerPageChange
											}
											sx={{
												margin: "auto",
												fontFamily: "inherit",
												fontWeight: "bold",
												backgroundColor: "white",
											}}
										>
											{usersPerPageOptions.map(
												(option) => (
													<MenuItem
														key={option}
														value={option}
													>
														{option}
													</MenuItem>
												)
											)}
										</Select>
									</div>
								</div>
							)}
						</>
					) : (
						<p>No data</p>
					)}
				</div>
			</>
		)
	);
}
