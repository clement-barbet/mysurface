"use client";

import { DashboardPieChart } from "@/components/dashboard/pie_chart";
import TeamMembersList from "@/components/dashboard/team_members_list";
import { Notification } from "@/components/dashboard/notification";
import Link from "next/link";
import T from "@/components/translations/translation";

export default function Dashboard() {
	return (
		<div className="flex flex-col xl:flex-row gap-y-4 xl:gap-x-4">
			<div className="flex flex-col sm:flex-row xl:flex-col gap-y-4 sm:gap-x-4 xl:w-3/5">
				<div className="h-auto w-full sm:w-1/2 xl:w-full flex flex-col shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
					<div className="px-10 py-5">
						<h2 className="font-bold text-lg">
							<T tkey="dashboard.piechart.title" />
						</h2>
						<p className="text-gray-600 dark:text-gray-400">
							<T tkey="dashboard.piechart.subtitle" />
						</p>
						<div className="mt-4">
							<DashboardPieChart />
						</div>
					</div>
				</div>
				<div className="h-auto w-full sm:w-1/2 xl:w-full flex flex-col shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
					<div className="px-10 py-5">
						<div className="mb-2">
							<h2 className="font-bold text-lg">
								<T tkey="dashboard.notifications.title" />
							</h2>
							<p className="text-gray-600 dark:text-gray-400">
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
					<div className="px-10 py-5">
						<h2 className="font-bold text-lg hover:text-blue-500 transition-colors duration-200 ease-linear">
							<T tkey="dashboard.team.title" />
						</h2>

						<p className="text-gray-600 dark:text-gray-400">
							<T tkey="dashboard.team.subtitle" />
						</p>
						<div className="mt-3">
							<TeamMembersList />
						</div>
					</div>
				</div>
				<div className="px-10 py-5">
					<Link
						href="/home/participants"
						className="text-gray-600 dark:text-gray-400 block w-full text-center hover:font-semibold transition-all duration-200 ease-linear"
					>
						<T tkey="dashboard.team.link" />
					</Link>
				</div>
			</div>
		</div>
	);
}
