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
import Pagination from "@/components/ui/pagination/pagination";
import usePagination from "@/components/ui/pagination/usePagination";
import ModalComponent from "@/components/results/ModalComponentEdit";
import ModalComponentDelete from "@/components/results/ModalComponentDelete";

export default function Results() {
	const [loading, setLoading] = useState(true);
	const [results, setResults] = useState([]);
	const supabase = createClientComponentClient();
	const [selectedResult, setSelectedResult] = useState(null);
	const [open, setOpen] = useState(false);
	const [openDelete, setOpenDelete] = useState(false);
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

	const handleOpenDelete = (result) => {
		setSelectedResult(result);
		setOpenDelete(true);
	};

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			let { data: fetchedResults, error: resultsError } = await supabase
				.from("deleted_reports")
				.select("*")
				.order("deleted_at", { ascending: false });

			if (resultsError)
				console.error("Error loading results", resultsError);
			else {
				setResults(fetchedResults || []);
			}
			setLoading(false);
		};

		fetchData();
	}, []);

	return (
		!loading && (
			<>
				<div className="w-full m-auto">
					<h2 className="text-3xl pb-2">
						<T tkey="backup-results.title" />
					</h2>
					{results.length > 0 ? (
						<>
							<Table className="w-full">
								<TableHeader>
									<THeadRow>
										{[
											"ID",
											"Report name",
											"Deletion date",
											"Creation date",
											"User name",
											"Organization",
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
											result.deleted_at
										);
										const formattedDate =
											date.toLocaleDateString("en-CA");
										const formattedTime =
											date.toLocaleTimeString("en-CA");
										const date2 = new Date(
											result.created_at
										);
										const formattedDate2 =
											date2.toLocaleDateString("en-CA");
										const formattedTime2 =
											date2.toLocaleTimeString("en-CA");

										return (
											<TBodyRow key={result.id}>
												<TableCell className="px-6 py-2 whitespace-nowrap">
													<Link
														href={`/home/backup/${result.id}`}
														className="font-semibold text-accent_color hover:text-accent_hover underline hover:underline-offset-4 underline-offset-2 transition-all duration-200 ease-linear"
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
													{formattedDate2}
													<br />
													{formattedTime2}
												</TableCell>
												<TableCell className="px-6 py-2 whitespace-nowrap">
													{result.user_name}
												</TableCell>
												<TableCell className="px-6 py-2 whitespace-nowrap">
													{result.organization}
												</TableCell>
												<TableCell className="px-6 py-2 whitespace-nowrap">
													<Button
														onClick={() =>
															handleOpen(result)
														}
														variant="blue"
													>
														Edit
													</Button>
												</TableCell>
												<TableCell className="px-6 py-2 whitespace-nowrap">
													<Button
														variant="delete"
														onClick={() =>
															handleOpenDelete(result)
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
				<ModalComponent
					open={open}
					setOpen={setOpen}
					reportName={reportName}
					setReportName={setReportName}
					results={results}
					setResults={setResults}
					selectedResult={selectedResult}
					table="deleted_reports"
				/>
				<ModalComponentDelete
					open={openDelete}
					setOpen={setOpenDelete}
					results={results}
					setResults={setResults}
					selectedResult={selectedResult}
					table="deleted_reports"
				/>
			</>
		)
	);
}
