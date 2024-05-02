import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import GraphNode2D from "./GraphNode2D";
import GraphNode3D from "./GraphNode3D";
import GraphData from "./GraphData";
import GraphTabs from "./graph_tabs";

export default async function ResultPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createServerComponentClient({ cookies });

  const { data: result, error: resultError } = await supabase
    .from("deleted_reports")
    .select("result")
    .eq("id", params.id)
    .single();

  if (resultError) {
    console.error("Error fetching result:", resultError);
    notFound();
  }

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
    node.val =
      (node.val - (minNodeValue - 0.1)) / (maxNodeValue - minNodeValue);
  });

  const graphData = {
    nodes,
    links,
  };

  return (
    <div className="w-full">
      <h2 className="mb-2 hidden">Result: {params.id}</h2>
      <GraphTabs graphData={graphData} />
      <GraphData graphData={graphData} />
      <pre className="hidden">{JSON.stringify(graphData, null, 2)}</pre>
    </div>
  );
}