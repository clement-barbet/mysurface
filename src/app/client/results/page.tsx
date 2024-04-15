"use client";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import T from "@/components/translations/translation";
import Link from "next/link";

export default function Results() {
	const [results, setResults] = useState([]);
	const supabase = createClientComponentClient();

	useEffect(() => {
		const fetchResults = async () => {
			let { data, error } = await supabase
				.from("results")
				.select("*")
				.order("created_at", { ascending: false });

			if (error) console.error("Error loading results", error);
			else setResults(data);
		};

		fetchResults();
	}, []);

	return (
		<div className="w-full m-auto p-5">
			<h2 className="text-3xl pb-5">
				<T tkey="homeresults.title" />
			</h2>
			<div className="w-full m-auto p-5 shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
				<ul>
					{results.map((result) => (
						<li className="my-2" key={result.id}>
							<Link
								href={`/client/results/${result.id}`}
								className="hover:font-semibold transition-all duration-200 ease-linear"
							>
								{`${result.report_name} (${result.id}) - ${
									new Date(result.created_at)
										.toISOString()
										.split("T")[0]
								}`}
							</Link>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
