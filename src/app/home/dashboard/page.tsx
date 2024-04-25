"use client";

import { DashboardPieChart } from "@/components/dashboard/pie_chart";
import TeamMembersList from "@/components/dashboard/team_members_list";
import { Notification } from "@/components/dashboard/notification";
import Link from "next/link";
import T from "@/components/translations/translation";
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
import { Modal, Box, Typography, TextField } from "@mui/material";
import { FaTimes } from "react-icons/fa";

export default function Dashboard() {
	const [results, setResults] = useState([]);
	const supabase = createClientComponentClient();
	const [selectedResult, setSelectedResult] = useState(null);
	const [open, setOpen] = useState(false);
	const [reportName, setReportName] = useState("");

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
			let { data: fetchedResults, error: resultsError } = await supabase
				.from("results")
				.select("*")
				.order("created_at", { ascending: false })
				.limit(3);

			if (resultsError)
				console.error("Error loading results", resultsError);
			else setResults(fetchedResults || []);
		};

		fetchData();
	}, []);

	const deleteReport = async (id: string) => {
		const { error } = await supabase.from("results").delete().eq("id", id);

		if (error) console.error("Error deleting report", error);
		else {
			setResults(results.filter((result) => result.id !== id));
		}
	};
	return (
		<>
			<div className="w-full m-auto mb-2">
				<Table className="w-full">
					<TableHeader>
						<THeadRow>
							{[
								"ID",
								"Name",
								"Date",
								"Delete report",
								"Edit report's name",
							].map((header, index) => (
								<TableHead key={index}>{header}</TableHead>
							))}
						</THeadRow>
					</TableHeader>
					<TableBody className="bg-white divide-y divide-gray-200">
						{results.length > 0 ? (
							results.map((result) => {
								const date = new Date(result.created_at);
								const formattedDate =
									date.toLocaleDateString("en-CA");
								const formattedTime =
									date.toLocaleTimeString("en-CA");

								return (
									<TBodyRow key={result.id}>
										<TableCell className="px-6 py-4 whitespace-nowrap">
											<Link
												href={`/home/results/${result.id}`}
												className="font-semibold text-blue-500 hover:text-blue-800 underline hover:underline-offset-4 underline-offset-2 transition-all duration-200 ease-linear"
											>
												{result.id}
											</Link>
										</TableCell>
										<TableCell className="px-6 py-4 whitespace-nowrap">
											{result.report_name}
										</TableCell>
										<TableCell className="px-6 py-4 whitespace-nowrap">
											{formattedDate}
											<br />
											{formattedTime}
										</TableCell>
										<TableCell className="px-6 py-4 whitespace-nowrap">
											<Button
												variant="delete"
												onClick={() =>
													deleteReport(result.id)
												}
											>
												Delete
											</Button>
										</TableCell>
										<TableCell className="px-6 py-4 whitespace-nowrap">
											<Button
												onClick={() =>
													handleOpen(result)
												}
											>
												Edit
											</Button>
										</TableCell>
									</TBodyRow>
								);
							})
						) : (
							<TBodyRow>
								<TableCell
									colSpan={5}
									className="px-6 py-4 text-center"
								>
									No tests executed yet.
								</TableCell>
							</TBodyRow>
						)}
					</TableBody>
				</Table>
			</div>
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
				BackdropProps={{
					onClick: (event) => {
						event.stopPropagation();
					},
				}}
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
					<Button
						onClick={handleClose}
						className="absolute top-1 right-1"
						variant={"delete"}
					>
						<FaTimes className="w-3 h-3" />
					</Button>
					<Typography
						id="modal-modal-title"
						variant="h6"
						component="h2"
						sx={{ mb: 2 }}
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

			<div className="flex flex-col xl:flex-row gap-y-2 xl:gap-x-2">
				<div className="flex flex-col sm:flex-row xl:flex-col gap-y-2 sm:gap-x-2 xl:w-3/5">
					<div className="h-auto w-full sm:w-1/2 xl:w-full flex flex-col shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
						<div className="px-4 md:px-10 py-5">
							<h2 className="font-bold text-xl md:text-lg">
								<T tkey="dashboard.piechart.title" />
							</h2>
							<p className="text-gray-600 dark:text-gray-400 text-lg md:text-base">
								<T tkey="dashboard.piechart.subtitle" />
							</p>
							<div className="mt-4">
								<DashboardPieChart />
							</div>
						</div>
					</div>
					<div className="h-auto w-full sm:w-1/2 xl:w-full flex flex-col shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
						<div className="px-4 md:px-10 py-5">
							<div className="mb-2">
								<h2 className="font-bold text-xl md:text-lg">
									<T tkey="dashboard.notifications.title" />
								</h2>
								<p className="text-gray-600 dark:text-gray-400 text-lg md:text-base">
									<T tkey="dashboard.notifications.subtitle" />
								</p>
							</div>
							<Notification type="add" name="John Doe" />
							<Notification type="remove" name="Richard Roe" />
							<Notification type="complete" name="Jane Doe" />
						</div>
					</div>
				</div>
				<div className="h-auto w-full xl:w-2/5 flex flex-col justify-between shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
					<div>
						<div className="px-4 md:px-10 py-5">
							<h2 className="font-bold text-xl md:text-lg">
								<T tkey="dashboard.team.title" />
							</h2>

							<p className="text-gray-600 dark:text-gray-400 text-lg md:text-base">
								<T tkey="dashboard.team.subtitle" />
							</p>
							<div className="mt-3">
								<TeamMembersList />
							</div>
						</div>
					</div>
					<div className="px-4 md:px-10 py-5">
						<Link
							href="/home/participants"
							className="text-lg md:text-base text-gray-600 dark:text-gray-400 block w-full text-center hover:font-semibold transition-all duration-200 ease-linear"
						>
							<T tkey="dashboard.team.link" />
						</Link>
					</div>
				</div>
			</div>
		</>
	);
}
