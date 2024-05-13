import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
	const supabase = createServerComponentClient({ cookies });
	const user = await supabase.auth.getUser();

	try {
		// Fetch app_settings
		const { data: appSettings, error: appSettingsError } = await supabase
			.from("app_settings")
			.select("*")
			.eq("user_id", user.data.user?.id)
			.single();

		if (appSettingsError) {
			throw appSettingsError;
		}

		// Fetch questions
		const { data: questions, error: questionsError } = await supabase
			.from("questions")
			.select("*")
			.eq("language_id", appSettings.language_id)
			.eq("organization_id", appSettings.organization_id);

		if (questionsError) {
			console.log("Error fetching questions");
			throw questionsError;
		}

		// Fetch participants
		const { data: participants, error: fetchParticipantError } =
			await supabase
				.from("participants")
				.select("id, name, questionnaire")
				.eq("user_id", user.data.user?.id);

		if (fetchParticipantError) {
			throw fetchParticipantError;
		}

		// Fetch questionnaires
		const { data: questionnaires, error: fetchQuestionnaireError } =
			await supabase.from("questionnaires").select("*");

		if (fetchQuestionnaireError) {
			throw fetchQuestionnaireError;
		}

		// Map participants to their respective questionnaires
		const participantsData = participants.map((participant) => {
			const questionnaire = questionnaires.find(
				(q) => q.id === participant.questionnaire
			);

			let data;
			if (questionnaire && !questionnaire.completed) {
				data = participants
					.filter((p) => p.id !== participant.id)
					.map((p) => ({
						participantId: p.id,
						participantName: p.name,
						answers: questions.map((question) => ({
							questionText: question.question.replace(
								"%s",
								p.name
							),
							rating: 0,
							weight: question.weight,
						})),
						interactionGrade: 0,
						influenceGrade: 0,
					}));
				questionnaire.data = data;
			}

			return {
				participantName: participant.name,
				data: questionnaire ? questionnaire.data : [],
			};
		});

		// Insert the participants data into the results table
		const { data: insertedResult, error: insertError } = await supabase
			.from("results")
			.insert([
				{
					id: Date.now().toString(),
					created_at: new Date().toISOString(),
					result: JSON.stringify(participantsData),
					report_name: "Participants Data",
				},
			])
			.select("*")
			.single();

		if (insertError) {
			throw insertError;
		}

		// DELETE RECORDS FROM QUESTIONNAIRES AND PARTICIPANTS
		// Get questionnaire IDs for the logged in user
		const { data: questionnaireData, error: questionnaireError } =
			await supabase
				.from("participants")
				.select("questionnaire")
				.eq("user_id", user.data.user?.id);

		if (questionnaireError) {
			console.error("Error getting questionnaires:", questionnaireError);
		} else {
			const questionnaireIds = questionnaireData.map(
				(q) => q.questionnaire
			);

			// Delete all records from questionnaires
			const { error: deleteError } = await supabase
				.from("questionnaires")
				.delete()
				.in("id", questionnaireIds);

			if (deleteError) {
				console.error("Error deleting questionnaires:", deleteError);
			}

			// Delete all records from participants
			if (user.data.user) {
				const { error: deleteParticipantsError } = await supabase
					.from("participants")
					.delete()
					.eq("user_id", user.data.user.id);

				if (deleteParticipantsError) {
					console.error(
						"Error deleting participants:",
						deleteParticipantsError
					);
				}
			}
		}

		return NextResponse.json({
			message: "Result generated successfully",
			resultId: insertedResult.id,
		});
	} catch (error) {
		console.error("Error generating result:", error);
		return NextResponse.json(
			{ error: "An error occurred while generating the result" },
			{ status: 500 }
		);
	}
}
