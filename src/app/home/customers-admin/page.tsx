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
import Pagination from "@/components/ui/pagination/pagination";
import usePagination from "@/components/ui/pagination/usePagination";

export default function Customers() {
	const [loading, setLoading] = useState(true);
	const supabase = createClientComponentClient();
	const [users, setUsers] = useState([]);

	const {
		currentPage,
		setCurrentPage,
		itemsPerPage,
		handleItemsPerPageChange,
		currentItems,
		itemsPerPageOptions,
	} = usePagination(users, 10);

	const fetchUsers = async () => {
		setLoading(true);
		let { data: fetchedCustomers, error } = await supabase
			.from("restricted_customers_view")
			.select("*");

		if (error) {
			console.log("Error fetching users: ", error);
			setLoading(false);
			return;
		}

		console.log("fetchedCustomers: ", fetchedCustomers);
		setUsers(fetchedCustomers);
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
									{currentItems.map((user) => {
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
													{user.organization_name}
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
							<Pagination
								currentPage={currentPage}
								setCurrentPage={setCurrentPage}
								items={users}
								itemsPerPage={itemsPerPage}
								handleItemsPerPageChange={
									handleItemsPerPageChange
								}
								itemsPerPageOptions={itemsPerPageOptions}
							/>
						</>
					) : (
						<p>No data</p>
					)}
				</div>
			</>
		)
	);
}
