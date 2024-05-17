"use client";
import { DashboardPieChart } from "@/components/dashboard/pie_chart";
import TeamMembersList from "@/components/dashboard/team_members_list";
import Link from "next/link";
import T from "@/components/translations/translation";
import { useEffect, useState } from "react";
import { TableBody, TableCell, TBodyRow } from "@/components/ui/table";
import Loading from "@/components/ui/loading";
import { fetchUser } from "@/db/auth_user/fetchUser";
import { fetchParticipants } from "@/db/participants/fetchParticipantsByUserId";
import { fetchResults } from "@/db/results/fetchResultsByUserId";

export default function Dashboard() {
	const [results, setResults] = useState([]);
	const [participants, setParticipants] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const user = await fetchUser();
				const userId = user.id;
				const [fetchedResults, fetchedParticipants] = await Promise.all(
					[fetchResults(userId), fetchParticipants(userId)]
				);
				setResults(fetchedResults?.slice(0, 3) ?? []);
				setParticipants(fetchedParticipants?.slice(0, 6) ?? []);
			} catch (error) {
				console.error("Error fetching data", error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	if (loading) {
		return <Loading />;
	}

	return (
		<>
			<div className="p-5 w-full m-auto mb-2 shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
				<h2 className="text-lg mb-2 font-semibold border-l-4 border-mid_blue pl-2">
					<T tkey="dashboard.results.title" />
				</h2>
				<p className="text-gray-600 dark:text-gray-400 text-lg md:text-base mb-2">
					<T tkey="dashboard.results.subtitle" />
				</p>
				<div className="overflow-auto rounded-md bg-white bg-opactity-90 dark:bg-black dark:bg-opacity-90">
					<table className="w-full text-sm">
						<TableBody className="bg-white dark:bg-black divide-y divide-gray-200 dark:divide-gray-500">
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
												&nbsp;&nbsp;&nbsp;
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
					</table>
				</div>
			</div>

			<div className="flex flex-col md:flex-row gap-y-2 md:gap-x-2">
				<div className="p-5 h-auto w-full shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
					<h2 className="text-lg mb-2 font-semibold border-l-4 border-mid_blue pl-2">
						<T tkey="dashboard.piechart.title" />
					</h2>
					<p className="text-gray-600 dark:text-gray-400 text-lg md:text-base">
						<T tkey="dashboard.piechart.subtitle" />
					</p>
					<div className="mt-4">
						<DashboardPieChart participants={participants} />
					</div>
				</div>
				<div className="p-5 h-auto w-full justify-between shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
					<h2 className="text-lg mb-2 font-semibold border-l-4 border-mid_blue pl-2">
						<T tkey="dashboard.team.title" />
					</h2>

					<p className="text-gray-600 dark:text-gray-400 text-lg md:text-base">
						<T tkey="dashboard.team.subtitle" />
					</p>
					<div className="mt-3">
						<TeamMembersList participants={participants} />
					</div>
					<div>
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
