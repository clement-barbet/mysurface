import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import GraphTabs from "@/components/results/GraphTabs";
import { generateGraphData } from "@/components/results/generateGraphData";

export default async function ResultPage({
	params,
}: {
	params: { id: string };
}) {
	const supabase = createServerComponentClient({ cookies });

	const { data: result, error: resultError } = await supabase
		.from("results")
		.select("result, report_name")
		.eq("id", params.id)
		.single();

	if (resultError) {
		console.error("Error fetching result:", resultError);
		notFound();
	}

	const reportName = result.report_name;

	const parsedResult = JSON.parse(result.result);

	const graphData = generateGraphData(parsedResult);

	return (
		<div className="w-full bg-graph_bg rounded-sm overflow-hidden">
			<GraphTabs
				graphData={graphData}
				reportId={params.id}
				reportName={reportName}
			/>
		</div>
	);
}
