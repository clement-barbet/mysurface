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

export default function Dashboard() {
	const [results, setResults] = useState([]);
	const supabase = createClientComponentClient();

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

	return (
		<>
			<div className="w-full m-auto mb-2">
				<Table className="w-full">
					<TableHeader>
						<THeadRow>
							{[
								"ID",
								"Name",
								"Date"
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
