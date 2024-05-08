"use client";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import T from "@/components/translations/translation";
import Link from "next/link";
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
import {
	Modal,
	Box,
	Typography,
	TextField,
} from "@mui/material";
import Pagination from "@/components/ui/pagination/pagination";
import usePagination from "@/components/ui/pagination/usePagination";

export default function Results() {
	const [loading, setLoading] = useState(true);
	const [results, setResults] = useState([]);
	const supabase = createClientComponentClient();
	const [selectedResult, setSelectedResult] = useState(null);
	const [open, setOpen] = useState(false);
	const [reportName, setReportName] = useState("");

	const {
		currentPage,
		setCurrentPage,
		itemsPerPage,
		handleItemsPerPageChange,
		currentItems,
		itemsPerPageOptions,
	} = usePagination(results, 10);

	const handleOpen = (result) => {
		setSelectedResult(result);
		setReportName(result.report_name);
		setOpen(true);
	};
	const handleSave = async () => {
		const { error } = await supabase
			.from("results")
			.update({ report_name: reportName })
			.eq("id", selectedResult.id);

		if (error) console.error("Error updating report name", error);
		else {
			setResults(
				results.map((result) =>
					result.id === selectedResult.id
						? { ...result, report_name: reportName }
						: result
				)
			);
		}

		setOpen(false);
	};

	const handleClose = () => {
		setOpen(false);
	};

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			let { data: fetchedResults, error: resultsError } = await supabase
				.from("results")
				.select("*")
				.order("created_at", { ascending: false });

			let { data: fetchedAppSettings, error: appSettingsError } =
				await supabase.from("app_settings").select("*");

			if (resultsError)
				console.error("Error loading results", resultsError);
			else if (appSettingsError)
				console.error("Error loading app settings", appSettingsError);
			else {
				let resultsWithUserEmail = fetchedResults.map((result) => {
					let appSetting = fetchedAppSettings.find(
						(setting) => setting.user_id === result.user_id
					);
					return {
						...result,
						user_email: appSetting
							? appSetting.email
							: "Email not found",
					};
				});
				setResults(resultsWithUserEmail || []);
			}
			setLoading(false);
		};

		fetchData();
	}, []);

	const deleteReport = async (id: string) => {
		const { error } = await supabase.from("results").delete().eq("id", id);

		if (error) console.error("Error deleting report", error);
		else {
			setResults(results.filter((result) => result.id !== id));
			const updatedTotalRows = totalRows - 1;
			setTotalRows(updatedTotalRows);
			if (resultsPerPage > updatedTotalRows) {
				setResultsPerPage(updatedTotalRows);
			}
		}
	};

	return (
		!loading && (
			<>
				<div className="w-full m-auto">
					<h2 className="text-3xl pb-2">
						<T tkey="homeresults.title" />
					</h2>
					{results.length > 0 ? (
						<>
							<Table className="w-full">
								<TableHeader>
									<THeadRow>
										{[
											"ID",
											"Name",
											"Owner's Email",
											"Date",
											"Edit report's name",
											"Delete report",
										].map((header, index) => (
											<TableHead key={index}>
												{header}
											</TableHead>
										))}
									</THeadRow>
								</TableHeader>
								<TableBody className="bg-white dark:bg-black divide-y divide-gray-200 dark:divide-gray-500">
									{currentItems.map((result) => {
										const date = new Date(
											result.created_at
										);
										const formattedDate =
											date.toLocaleDateString("en-CA");
										const formattedTime =
											date.toLocaleTimeString("en-CA");

										return (
											<TBodyRow key={result.id}>
												<TableCell className="px-6 py-2 whitespace-nowrap">
													<Link
														href={`/home/results-admin/${result.id}`}
														className="font-semibold text-blue-500 hover:text-blue-800 underline hover:underline-offset-4 underline-offset-2 transition-all duration-200 ease-linear"
													>
														{result.id}
													</Link>
												</TableCell>
												<TableCell className="px-6 py-2 whitespace-nowrap">
													{result.report_name}
												</TableCell>
												<TableCell className="px-6 py-2 whitespace-nowrap">
													{result.user_email}
												</TableCell>
												<TableCell className="px-6 py-2 whitespace-nowrap">
													{formattedDate}
													<br />
													{formattedTime}
												</TableCell>
												<TableCell className="px-6 py-2 whitespace-nowrap">
													<Button
														onClick={() =>
															handleOpen(result)
														}
													>
														Edit
													</Button>
												</TableCell>
												<TableCell className="px-6 py-2 whitespace-nowrap">
													<Button
														variant="delete"
														onClick={() =>
															deleteReport(
																result.id
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
								items={results}
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
				<Modal
					open={open}
					onClose={handleClose}
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description"
				>
					<Box
						sx={{
							position: "absolute",
							top: "50%",
							left: "50%",
							transform: "translate(-50%, -50%)",
							width: 400,
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
							Update Report Name
						</Typography>
						<TextField
							autoFocus
							margin="dense"
							id="name"
							label="Name"
							type="text"
							fullWidth
							value={reportName}
							onChange={(e) => setReportName(e.target.value)}
						/>
						<Button
							onClick={handleSave}
							variant="login"
							className="mt-2"
						>
							SAVE
						</Button>
					</Box>
				</Modal>
			</>
		)
	);
}
