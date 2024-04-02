import { DashboardPieChart } from "@/components/chart/pie_chart";

export default function Dashboard() {
	return (
		<div className="w-full">
			<div className="w-full md:w-1/2 px-10 py-5 flex flex-col shadow-md rounded-lg bg-white bg-opacity-90">
				<h2 className="font-bold text-lg">Form Completion Status</h2>
				<p className="text-gray-600">Overview of form completion status across team members.</p>
				<div className="flex justify-center items-center">
					<DashboardPieChart />
				</div>
			</div>
		</div>
	);
}
