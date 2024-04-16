"use client";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import T from "@/components/translations/translation";
import Link from "next/link";

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

	return (
		!loading && (
			<div className="w-full m-auto">
				<h2 className="text-3xl pb-2">
					<T tkey="homeresults.title" />
				</h2>
				<div className="w-full m-auto p-5 shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
					{results.length > 0 ? (
						<ul>
							{results.map((result) => {
								const date = new Date(result.created_at);
								const formattedDate =
									date.toLocaleDateString("en-CA");

								return (
									<li className="my-2" key={result.id}>
										<Link
											href={`/home/results/${result.id}`}
											className="hover:font-semibold transition-all duration-200 ease-linear"
										>
											{`${result.report_name} (${result.id}) - ${formattedDate}`}
										</Link>
									</li>
								);
							})}
						</ul>
					) : (
						<p>
							<T tkey="results.nodata" />
						</p>
					)}
				</div>
			</div>
		)
	);
}
