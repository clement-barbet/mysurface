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
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import T from "@/components/translations/translation";
import Loading from "@/components/ui/loading";

export default function Customers() {
	const [loading, setLoading] = useState(true);
	const supabase = createClientComponentClient();
	const [users, setUsers] = useState([]);
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [selectedUserId, setSelectedUserId] = useState("");

	const headers_T = [
		"customers.table.headers.name",
		"customers.table.headers.email",
		"customers.table.headers.organization",
		"customers.table.headers.organization-type",
		"customers.table.headers.language",
		"customers.table.headers.delete",
	];

	const handleConfirmOpen = (userId) => {
		setConfirmOpen(true);
		setSelectedUserId(userId);
	};

	const handleConfirmClose = () => {
		setConfirmOpen(false);
	};

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

		setUsers(fetchedCustomers);
		setLoading(false);
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	const deleteUser = async () => {
		const { error } = await supabase.rpc("delete_user", {
			user_id: selectedUserId,
		});

		if (error) {
			console.log("Error deleting user: ", error);
		} else {
			console.log("users:", users);
			const updatedUsers = users.filter(
				(user) => user.user_id !== selectedUserId
			);
			setUsers(updatedUsers);
			setConfirmOpen(false);
		}
	};

	if (loading) {
		return <Loading />;
	}

	return (
		!loading && (
			<>
				<div className="w-full m-auto">
					<h2 className="text-3xl pb-2">
						<T tkey="customers.title" />
					</h2>
					{users.length > 0 ? (
						<>
							<Table className="w-full">
								<TableHeader>
									<THeadRow>
										{headers_T.map((header, index) => {
											return (
												<TableHead key={index}>
													<T tkey={header} />
												</TableHead>
											);
										})}
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
															handleConfirmOpen(
																user.user_id
															)
														}
													>
														<T tkey="customers.table.buttons.delete" />
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
						<T tkey="customers.nodata" />
					)}
				</div>
				<Modal
					open={confirmOpen}
					onClose={handleConfirmClose}
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description"
				>
					<Box
						sx={{
							position: "absolute",
							top: "50%",
							left: "50%",
							transform: "translate(-50%, -50%)",
							width: "90%",
							maxWidth: 400,
							bgcolor: "background.paper",
							borderRadius: "10px",
							boxShadow: 24,
							p: 4,
						}}
					>
						<Typography
							id="modal-modal-title"
							variant="h6"
							component="h2"
							sx={{
								mb: 2,
								textAlign: "center",
								fontFamily: "inherit",
							}}
						>
							<T tkey="customers.modal.question" />
						</Typography>
						<Button
							onClick={deleteUser}
							variant="delete"
							className="mt-2 w-full"
						>
							<T tkey="customers.modal.options.yes" />
						</Button>
						<Button
							onClick={handleConfirmClose}
							className="mt-2 w-full"
						>
							<T tkey="customers.modal.options.no" />
						</Button>
					</Box>
				</Modal>
			</>
		)
	);
}
