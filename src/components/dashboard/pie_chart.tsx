"use client";
import {
	PieChart,
	Pie,
	Cell,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";
import { useMediaQuery } from 'react-responsive';
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

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

export function DashboardPieChart() {
	const [completionPercentage, setCompletionPercentage] = useState(0);
    const isSmallScreen = useMediaQuery({ query: '(max-width: 400px)' });

	useEffect(() => {
		getCompletionPercentage().then((percentage) =>
			setCompletionPercentage(percentage)
		);
	}, []);

	const data = [
		{ name: "Completed", value: completionPercentage },
		{ name: "Uncompleted", value: 100 - completionPercentage },
	];

	const COLORS = ["#36b9cc", "#f6c23e"];

	return (
		<ResponsiveContainer width="80%" aspect={1}>
			<PieChart margin={{ top: 2, right: 0, bottom: 2, left: 0 }}>
				<Pie
					dataKey="value"
					isAnimationActive={false}
					data={data}
					cx="50%"
					cy="50%"
					outerRadius={isSmallScreen ? "100%" : "60%"}
					fill="#8884d8"
					label
				>
					{data.map((entry, index) => (
						<Cell
							key={`cell-${index}`}
							fill={COLORS[index % COLORS.length]}
						/>
					))}
				</Pie>
				<Tooltip />
				<Legend
					layout="horizontal"
                    align="center"
                    verticalAlign="bottom"
					wrapperStyle={{ lineHeight: "1em" }}
				/>
			</PieChart>
		</ResponsiveContainer>
	);
}
