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

export default function Results() {
	const [loading, setLoading] = useState(true);
	const [results, setResults] = useState([]);
	const supabase = createClientComponentClient();

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			let { data: fetchedResults, error: resultsError } = await supabase
				.from("results")
				.select("*")
				.order("created_at", { ascending: false });

			if (resultsError)
				console.error("Error loading results", resultsError);
			else setResults(fetchedResults || []);
			setLoading(false);
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
		!loading && (
			<div className="w-full m-auto">
				<h2 className="text-3xl pb-2">
					<T tkey="homeresults.title" />
				</h2>
				{results.length > 0 ? (
					<Table className="w-full">
						<TableHeader>
							<THeadRow>
								{["ID", "Name", "Date", "Delete report"].map(
									(header, index) => (
										<TableHead key={index}>
											{header}
										</TableHead>
									)
								)}
							</THeadRow>
						</TableHeader>
						<TableBody className="bg-white divide-y divide-gray-200">
							{results.map((result) => {
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
									</TBodyRow>
								);
							})}
						</TableBody>
					</Table>
				) : (
					<p>No data</p>
				)}
			</div>
		)
	);
}
