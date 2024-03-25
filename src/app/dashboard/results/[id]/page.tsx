import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import GraphNode2D from "./GraphNode2D";
import GraphNode3D from "./GraphNode3D";

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
  parsedResult.forEach((sourceParticipant) => {
    let maxConnection = -Infinity;
    let closestParticipant = null;

    sourceParticipant.data.forEach((dataPoint) => {
      const targetParticipant = parsedResult.find(
        (participant) =>
          participant.participantName === dataPoint.participantName
      );
      if (targetParticipant) {
        const connectionSum =
          (dataPoint.answers.find((answer) =>
            answer.questionText.includes("collaborate with")
          )?.rating || 0) +
          (targetParticipant.data
            .find(
              (targetData) =>
                targetData.participantName === sourceParticipant.participantName
            )
            ?.answers.find((answer) =>
              answer.questionText.includes("collaborate with")
            )?.rating || 0);

        if (connectionSum > maxConnection) {
          maxConnection = connectionSum;
          closestParticipant = targetParticipant.participantName;
        }
      }
    });

    if (closestParticipant) {
      links.push({
        source: sourceParticipant.participantName,
        target: closestParticipant,
        value: maxConnection,
      });
    }
  });

  const graphData = {
    nodes,
    links,
  };

  return (
    <div>
      <h1>Result: {params.id}</h1>
      {/* <GraphNode2D graphData={graphData} /> */}
      <GraphNode3D graphData={graphData} />
    </div>
  );
}
