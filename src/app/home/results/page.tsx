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
	const [assessment, setAssessment] = useState("");

	const headers_T = [
		"results.table.headers.id",
		"results.table.headers.name",
		"results.table.headers.process",
		"results.table.headers.date",
		"results.table.headers.edit",
		"results.table.headers.delete",
	];

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

	function getProcessName(process_id) {
		if (process_id === 1) {
			return "participants.select-process.options.influence";
		} else if (process_id === 2) {
			return "participants.select-process.options.leaders";
		} else {
			return "participants.select-process.options.products";
		}
	}

	return (
		!loading && (
			<>
				<div className="w-full m-auto hidden md:block">
					{results.length > 0 ? (
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
														href={`/home/results/${result.id}`}
														className="font-semibold text-accent_color hover:text-accent_hover underline hover:underline-offset-4 underline-offset-2 transition-all duration-200 ease-linear"
													>
														{result.id}
													</Link>
												</TableCell>
												<TableCell className="px-6 py-2 whitespace-nowrap">
													{result.report_name}
												</TableCell>
												<TableCell className="px-6 py-2 whitespace-nowrap">
													<T
														tkey={getProcessName(
															result.process_id
														)}
													/>
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
														variant="blue"
													>
														<T tkey="results.table.buttons.edit" />
													</Button>
												</TableCell>
												<TableCell className="px-6 py-2 whitespace-nowrap">
													<Button
														variant="delete"
														onClick={() =>
															handleOpenDelete(
																result
															)
														}
													>
														<T tkey="results.table.buttons.delete" />
													</Button>
												</TableCell>
											</TBodyRow>
										);
									})}
								</TableBody>
							</Table>
						</>
					) : (
						<p>
							<T tkey="results.nodata" />
						</p>
					)}
				</div>
				<div className="w-full block md:hidden">
					{results.length
						? currentItems.map((result) => {
								if (result) {
									const date = new Date(result.created_at);
									const formattedDate =
										date.toLocaleDateString("en-CA");
									const formattedTime =
										date.toLocaleTimeString("en-CA");
									return (
										<div
											key={result.id}
											className="md:hidden rounded-md border shadow-md bg-white dark:bg-black p-3 mb-4 flex flex-col gap-y-2"
										>
											<p>
												<strong>
													<T tkey={headers_T[0]} />:{" "}
												</strong>
												<Link
													href={`/home/results/${result.id}`}
													className="font-semibold text-accent_color hover:text-accent_hover underline hover:underline-offset-4 underline-offset-2 transition-all duration-200 ease-linear"
												>
													{result.id}
												</Link>
											</p>
											<p>
												<strong>
													<T tkey={headers_T[1]} />:{" "}
												</strong>
												{result.report_name}
											</p>
											<p>
												<strong>
													<T tkey={headers_T[2]} />:{" "}
												</strong>
												<T
													tkey={getProcessName(
														result.process_id
													)}
												/>
											</p>
											<p>
												<strong>
													<T tkey={headers_T[3]} />:{" "}
												</strong>
												{formattedDate}&nbsp;&nbsp;
												{formattedTime}
											</p>
											<Button
												className="w-full"
												onClick={() =>
													handleOpen(result)
												}
												variant="blue"
											>
												<T tkey="results.table.buttons.edit" />
											</Button>
											<Button
												className="w-full"
												variant="delete"
												onClick={() =>
													handleOpenDelete(result)
												}
											>
												<T tkey={headers_T[5]} />
											</Button>
										</div>
									);
								}
								return null;
						  })
						: null}
				</div>
				{results.length === 0 ? null : (
					<Pagination
						currentPage={currentPage}
						setCurrentPage={setCurrentPage}
						items={results}
						itemsPerPage={itemsPerPage}
						handleItemsPerPageChange={handleItemsPerPageChange}
						itemsPerPageOptions={itemsPerPageOptions}
					/>
				)}
				<ModalComponent
					open={open}
					setOpen={setOpen}
					reportName={reportName}
					setReportName={setReportName}
					results={results}
					setResults={setResults}
					selectedResult={selectedResult}
					table="results"
				/>
				<ModalComponentDelete
					open={openDelete}
					setOpen={setOpenDelete}
					results={results}
					setResults={setResults}
					selectedResult={selectedResult}
					table="results"
				/>
			</>
		)
	);
}
