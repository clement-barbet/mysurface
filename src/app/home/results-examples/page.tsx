"use client";
import { useEffect, useState } from "react";
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
import { fetchExamples } from "@/db/results/fetchExamplesView";
import Loading from "@/components/ui/loading";

export default function ResultsExamples() {
	const [loading, setLoading] = useState(true);
	const [results, setResults] = useState([]);

	const headers_T = [
		"results.table.headers.id",
		"results.table.headers.name",
	];

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const fetchedResults = await fetchExamples();
				setResults(fetchedResults || []);
			} catch (error) {
				console.error("Error fetching data:", error);
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
		!loading && (
			<>
				<div className="w-full m-auto">
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
									{results.map((result) => {
										return (
											<TBodyRow key={result.id}>
												<TableCell className="px-6 py-2 whitespace-nowrap">
													<Link
														href={`/home/results-examples/${result.id}`}
														className="font-semibold text-accent_color hover:text-accent_hover underline hover:underline-offset-4 underline-offset-2 transition-all duration-200 ease-linear"
													>
														{result.id}
													</Link>
												</TableCell>
												<TableCell className="px-6 py-2 whitespace-nowrap">
													{result.report_name}
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
			</>
		)
	);
}
