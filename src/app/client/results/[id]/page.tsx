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
    .from("results")
    .select("result")
    .eq("id", params.id)
    .single();

  if (resultError) {
    console.error("Error fetching result:", resultError);
    notFound();
  }

  const parsedResult = JSON.parse(result.result);

  // Process the result data to generate nodes and links
  const nodes = parsedResult.map((participant) => ({
    id: participant.participantName,
    name: participant.participantName,
    val: Math.log(
      participant.data.reduce((sum, dataPoint) => {
        const influenceRating =
          dataPoint.answers.find((answer) =>
            answer.questionText.includes("influence on you")
          )?.rating || 0;
        return sum + influenceRating;
      }, 0)
    ),
  }));

  const links = [];
  parsedResult.forEach((sourceParticipant) => {
    sourceParticipant.data.forEach((dataPoint) => {
      const targetParticipant = parsedResult.find(
        (participant) =>
          participant.participantName === dataPoint.participantName
      );
      if (targetParticipant) {
        const collaborationScore =
          dataPoint.answers.find((answer) =>
            answer.questionText.includes("collaborate with")
          )?.rating || 0;

        const oppositeCollaborationScore =
          targetParticipant.data
            .find(
              (targetData) =>
                targetData.participantName === sourceParticipant.participantName
            )
            ?.answers.find((answer) =>
              answer.questionText.includes("collaborate with")
            )?.rating || 0;

        const linkScore = collaborationScore + oppositeCollaborationScore;

        if (linkScore > 0) {
          links.push({
            source: sourceParticipant.participantName,
            target: targetParticipant.participantName,
            value: Math.log(linkScore),
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
    node.val = (node.val - minNodeValue) / (maxNodeValue - minNodeValue);
  });

  const graphData = {
    nodes,
    links,
  };

  return (
    <div className="w-full">
      <h2 className="mb-2 hidden">Result: {params.id}</h2>
      <GraphTabs graphData={graphData} />
      <pre className="hidden">{JSON.stringify(graphData, null, 2)}</pre>
    </div>
  );
}
