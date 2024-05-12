import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import GraphData from "@/components/results/GraphData";
import GraphTabs from "@/components/results/GraphTabs";

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

	const participantsNames = parsedResult.map(
		(participants) => participants.participantName
	);

	const influenceGradeList = parsedResult
		.flatMap((participants) => participants.data)
		.map((data) => ({
			participantId: data.participantId,
			participantName: data.participantName,
			influenceGrade: data.influenceGrade,
		}));

	const nodes = participantsNames.map((name) => {
		const list = influenceGradeList.filter(
			(influenceGradeEl) => influenceGradeEl.participantName === name
		);
		const sum = list.reduce((acc, curr) => acc + curr.influenceGrade, 0);
		const length = list.length;

		return {
			id: name,
			name: name,
			val: sum / length,
		};
	});

	// Process the result data to generate nodes and links
	// Process the result data to generate nodes and links

	const links = [];
	parsedResult.forEach((sourceParticipant) => {
		sourceParticipant.data.forEach((dataPoint) => {
			const targetParticipant = parsedResult.find(
				(participant) =>
					participant.participantName === dataPoint.participantName
			);
			if (targetParticipant) {
				const linkScore = dataPoint.interactionGrade;
				if (linkScore > 0) {
					links.push({
						source: sourceParticipant.participantName,
						target: targetParticipant.participantName,
						value: linkScore,
					});
				}
			}
		});
	});

	// Normalize node sizes
	const nodeValuesArray = nodes.map((node) => node.val);
	const minNodeValue = Math.min(...nodeValuesArray);
	const maxNodeValue = Math.max(...nodeValuesArray);
	nodes.forEach((node) => {
		let normalizedValue = (node.val =
			(node.val - (minNodeValue - 0.1)) / (maxNodeValue - minNodeValue));

		// Apply exponential transformation to increase difference
		node.val = Math.pow(normalizedValue, 1.5);
	});

	const graphData = {
		nodes,
		links,
	};

	return (
		<div className="w-full bg-black rounded-sm overflow-hidden">
			<h2 className="mb-2 hidden">Result: {params.id}</h2>
			<GraphTabs
				graphData={graphData}
				reportId={params.id}
				reportName={reportName}
			/>
		</div>
	);
}
