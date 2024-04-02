"use client";
import {
	PieChart,
	Pie,
	Cell,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";
import { useMediaQuery } from "react-responsive";
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
	const isSmallScreen = useMediaQuery({ query: "(max-width: 400px)" });

	useEffect(() => {
		getCompletionPercentage().then((percentage) =>
			setCompletionPercentage(percentage)
		);
	}, []);

	const data = [
		{ name: "Completed", value: completionPercentage },
		{ name: "Uncompleted", value: 1 - completionPercentage },
	];

	const COLORS = ["#36b9cc", "#f6c23e"];

	return (
		<ResponsiveContainer width="80%" aspect={1}>
			<PieChart margin={{ top: 2, right: 0, bottom: 2, left: 0 }}>
				<Pie
					className="focus:outline-none"
					dataKey="value"
					isAnimationActive={false}
					data={data}
					cx="50%"
					cy="50%"
					outerRadius={isSmallScreen ? "70%" : "60%"}
					fill="#8884d8"
					label={({
						cx,
						cy,
						midAngle,
						innerRadius,
						outerRadius,
						value,
						index,
					}) => {
						const RADIAN = Math.PI / 180;
						const radius =
							25 + innerRadius + (outerRadius - innerRadius);
						const x = cx + radius * Math.cos(-midAngle * RADIAN);
						const y = cy + radius * Math.sin(-midAngle * RADIAN);

						return (
							<text
								x={x}
								y={y}
								fill="#8884d8"
								textAnchor={x > cx ? "start" : "end"}
								dominantBaseline="central"
								fontSize={isSmallScreen ? "8px" : "14px"}
							>
								{`${(value * 100).toFixed(0)}%`}
							</text>
						);
					}}
				>
					{data.map((entry, index) => (
						<Cell
							key={`cell-${index}`}
							fill={COLORS[index % COLORS.length]}
						/>
					))}
				</Pie>
				<Tooltip
					content={({ active, payload }) => {
						if (active && payload && payload.length) {
							return (
								<div className="custom-tooltip bg-white dark:text-black rounded-md p-2 bg-opacity-80">
									<p className="label">{`${
										payload[0].name
									} : ${(payload[0].value * 100).toFixed(
										0
									)}%`}</p>
								</div>
							);
						}

						return null;
					}}
				/>
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
