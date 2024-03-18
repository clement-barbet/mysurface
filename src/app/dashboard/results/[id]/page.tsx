import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import GraphNode2D from "./GraphNode2D";

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
    val: 0, // Initialize the popularity value to 0
  }));

  // Calculate the popularity for each node
  parsedResult.forEach((participant) => {
    participant.data.forEach((dataPoint) => {
      const targetNode = nodes.find(
        (node) => node.id === dataPoint.participantName
      );
      if (targetNode) {
        targetNode.val +=
          dataPoint.answers.find((answer) =>
            answer.questionText.includes("influence on you")
          )?.rating || 0;
      }
    });
  });

  const links = [];
  for (let i = 0; i < parsedResult.length; i++) {
    for (let j = i + 1; j < parsedResult.length; j++) {
      const sourceParticipant = parsedResult[i];
      const targetParticipant = parsedResult[j];
      const sourceToTargetConnection = sourceParticipant.data.find(
        (dataPoint) =>
          dataPoint.participantName === targetParticipant.participantName
      );
      const targetToSourceConnection = targetParticipant.data.find(
        (dataPoint) =>
          dataPoint.participantName === sourceParticipant.participantName
      );

      // Calculate the sum of connection ratings between the participants
      const connectionSum =
        (sourceToTargetConnection?.answers.find((answer) =>
          answer.questionText.includes("collaborate with")
        )?.rating || 0) +
        (targetToSourceConnection?.answers.find((answer) =>
          answer.questionText.includes("collaborate with")
        )?.rating || 0);

      links.push({
        source: sourceParticipant.participantName,
        target: targetParticipant.participantName,
        value: connectionSum,
      });
    }
  }

  const graphData = {
    nodes,
    links,
  };

  return (
    <div>
      <h1>Result: {params.id}</h1>
      <GraphNode2D graphData={graphData} />
    </div>
  );
}
