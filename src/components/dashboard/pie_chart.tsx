"use client";
import React, { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

async function getCompletionPercentage() {
	const supabase = createClientComponentClient();

	const { data: questionnaires, error } = await supabase
		.from("questionnaires")
		.select("completed");

	if (error) {
		console.error("Error fetching questionnaires:", error);
		return 0;
	}

	const completedCount = questionnaires.filter((q) => q.completed).length;
	const totalCount = questionnaires.length;

	return (completedCount / totalCount) * 100;
}

const DashboardPieChart = () => {
	const [completedPercentage, setCompletedPercentage] = useState(0);

	useEffect(() => {
		const fetchData = async () => {
			const percentage = await getCompletionPercentage();
			setCompletedPercentage(percentage);
		};

		fetchData();
	}, []);

	const notCompletedPercentage = 100 - completedPercentage;

	const data = {
		labels: ["Completed", "Uncompleted"],
		datasets: [
			{
				data: [completedPercentage, notCompletedPercentage],
				backgroundColor: [
					"rgba(75, 192, 192, 0.2)",
					"rgba(255, 206, 86, 0.2)",
				],
				borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 206, 86, 1)"],
				borderWidth: 1,
			},
		],
	};

	const options = {
		plugins: {
			legend: {
				position: "bottom",
				labels: {
					font: {
						size: 12,
					},
					padding: 20,
				},
			},
		},
		responsive: true,
		maintainAspectRatio: false,
	};

	return (
		<div className="max-w-full max-h-full xl:min-h-48">
			<Pie data={data} options={options} />
		</div>
	);
};

export { DashboardPieChart };
