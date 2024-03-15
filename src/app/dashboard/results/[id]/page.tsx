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
    val: participant.influenceGrade,
  }));

  const links = [];
  for (let i = 0; i < parsedResult.length; i++) {
    for (let j = i + 1; j < parsedResult.length; j++) {
      const sourceParticipant = parsedResult[i];
      const targetParticipant = parsedResult[j];
      const sourceAnswers = sourceParticipant.answers;
      const targetAnswers = targetParticipant.answers;

      // Calculate the similarity between the participants' answers
      const similarity =
        sourceAnswers && targetAnswers
          ? sourceAnswers.reduce((sum, answer, index) => {
              const targetAnswer = targetAnswers[index];
              return sum + Math.abs(answer.rating - targetAnswer.rating);
            }, 0)
          : 0;

      links.push({
        source: sourceParticipant.participantName,
        target: targetParticipant.participantName,
        length: similarity,
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
