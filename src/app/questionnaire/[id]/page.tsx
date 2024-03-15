// app/questionnaire/[id]/page.tsx
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import QuestionnaireForm from "./QuestionnaireForm";

export default async function QuestionnairePage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createServerComponentClient({ cookies });

  const { data: questionnaire, error: questionnaireError } = await supabase
    .from("questionnaires")
    .select("*")
    .eq("id", params.id)
    .single();

  if (questionnaireError) {
    console.error("Error fetching questionnaire:", questionnaireError);
    notFound();
  }

  const { data: participants, error: participantsError } = await supabase
    .from("participants")
    .select("*")
    .neq("questionnaire", params.id);

  if (participantsError) {
    console.error("Error fetching participants:", participantsError);
    notFound();
  }

  const { data: questions, error: questionsError } = await supabase
    .from("questions")
    .select("*");

  if (questionsError) {
    console.error("Error fetching questions:", questionsError);
    notFound();
  }

  return (
    <div>
      <h1>Questionnaire: {params.id}</h1>
      <QuestionnaireForm
        questionnaireId={params.id}
        participants={participants}
        questions={questions}
      />
    </div>
  );
}
