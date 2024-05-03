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
import { Modal, Box, Typography, TextField, Select, MenuItem } from "@mui/material";

export default function Results() {
	const [loading, setLoading] = useState(true);
	const [results, setResults] = useState([]);
	const supabase = createClientComponentClient();
	const [selectedResult, setSelectedResult] = useState(null);
	const [open, setOpen] = useState(false);
	const [reportName, setReportName] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [resultsPerPage, setResultsPerPage] = useState(5);
	const [totalRows, setTotalRows] = useState(0);

	const handleResultsPerPageChange = (event) => {
		setResultsPerPage(event.target.value);
		setCurrentPage(1);
	};

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [resultsPerPage]);

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
			const user = await supabase.auth.getUser();
			const userId = user.data.user.id;

			setLoading(true);
			let { data: fetchedResults, error: resultsError } = await supabase
				.from("results")
				.select("*")
				.order("created_at", { ascending: false })
				.eq("user_id", userId);

			if (resultsError)
				console.error("Error loading results", resultsError);
			else setResults(fetchedResults || []);
			setLoading(false);
		};

		fetchData();
	}, []);

	const deleteReport = async (id: string) => {
		const { error } = await supabase.from("results").delete().eq("id", id);

		if (error) console.error("Error deleting report", error);
		else {
			setResults(results.filter((result) => result.id !== id));
			setResults(results.filter((result) => result.id !== id));
			const updatedTotalRows = totalRows - 1;
			setTotalRows(updatedTotalRows);
			if (resultsPerPage > updatedTotalRows) {
				setResultsPerPage(updatedTotalRows);
			}
		}
	};

	const indexOfLastResult = currentPage * resultsPerPage;
	const indexOfFirstResult = indexOfLastResult - resultsPerPage;
	const currentResults = results.slice(indexOfFirstResult, indexOfLastResult);
	useEffect(() => {
		setTotalRows(results.length);
	}, [results]);
	let resultsPerPageOptions;

	if (totalRows >= 5) {
		resultsPerPageOptions = Array.from(
			{ length: Math.floor(totalRows / 5) },
			(_, i) => (i + 1) * 5
		);

		if (totalRows % 5 !== 0) {
			resultsPerPageOptions.push(totalRows);
		}
	}

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
									{currentResults.map((result) => {
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
														href={`/home/results/${result.id}`}
														className="font-semibold text-blue-500 hover:text-blue-800 underline hover:underline-offset-4 underline-offset-2 transition-all duration-200 ease-linear"
													>
														{result.id}
													</Link>
												</TableCell>
												<TableCell className="px-6 py-2 whitespace-nowrap">
													{result.report_name}
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
												results.length / resultsPerPage
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
													results.length /
														resultsPerPage
												)
											)
										}
										disabled={
											currentPage ===
											Math.ceil(
												results.length / resultsPerPage
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
											value={resultsPerPage}
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
											{resultsPerPageOptions.map(
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
