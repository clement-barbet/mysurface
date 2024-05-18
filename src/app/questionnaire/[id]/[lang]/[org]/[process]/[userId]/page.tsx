// app/questionnaire/[id]/page.tsx
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import QuestionnaireForm from "./QuestionnaireForm";
import QuestionnaireFormAssessed from "./QuestionnaireFormAssessed";

/*
 * Anon users access this route with the questionnaire.
 * We need to make sure that the questionnaire is not completed.
 * We also need to get the participants and questions for the questionnaire.
 * We also need to get the owner of the questionnaire.
 * But anon users cannot access participants table directly (RLS policies).
 * So we need to get participants through participants view.
 */
export default async function QuestionnairePage({
	params,
}: {
	params: { id: string; lang: string; org: string; process: string, userId: string};
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

	if (questionnaire.completed) {
		console.error("Questionnaire already completed");
		notFound();
	}
	// Get participants through participants view, exclude current participant
	const { data: participants, error: participantsError } = await supabase
		.from("participants_view")
		.select("*")
		.neq("questionnaire", params.id)
		.eq("user_id", params.userId)
		.order("name");
	if (participantsError) {
		console.error("Error fetching participants:", participantsError);
		notFound();
	}

	// Get assessed
	const { data: assesseds, error: assessedError } = await supabase
		.from("assessed")
		.select("*")
		.eq("type", params.process == 2 ? "leader" : "product")
		.eq("user_id", params.userId)
		.order("name");

	if (assessedError) {
		console.error("Error fetching assessed:", assessedError);
		notFound();
	}

	const { data: questions, error: questionsError } = await supabase
		.from("questions")
		.select("*")
		.eq("language_id", params.lang)
		.eq("organization_id", params.org)
		.eq("process_id", params.process);

	if (questionsError) {
		console.error("Error fetching questions:", questionsError);
		notFound();
	}

	// Get owner through participants view
	const { data: owner, error: ownerError } = await supabase
		.from("participants_view")
		.select("*")
		.eq("questionnaire", params.id)
		.single();

	if (ownerError) {
		console.error("Error fetching owner:", ownerError);
		notFound();
	}

	return (
		<div className="m-auto mt-5 w-full md:w-2/3 flex flex-col">
			<h1 className="text-3xl my-5">Complete the Questionnaire</h1>
			<div className="p-10 shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
				<h2>
					<b>Questionnaire</b>: {params.id}
				</h2>
				<h2>
					<b>Evaluator</b>:{" "}
					<span className="evaluator">{owner.name}</span>
				</h2>
				{ params.process == 1 ? (
					<QuestionnaireForm
						questionnaireId={params.id}
						participants={participants}
						questions={questions}
					/>
				) : (
					<QuestionnaireFormAssessed
						questionnaireId={params.id}
						assesseds={assesseds}
						questions={questions}
					/>
				)}
			</div>
		</div>
	);
}
