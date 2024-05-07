import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
	const supabase = createServerComponentClient({ cookies });
	const user = await supabase.auth.getUser();

	try {

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
			await supabase.from("questionnaires").select("id, data");

		if (fetchQuestionnaireError) {
			throw fetchQuestionnaireError;
		}

		// Map participants to their respective questionnaires
		const participantsData = participants.map((participant) => {
			const questionnaire = questionnaires.find(
				(q) => q.id === participant.questionnaire
			);

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
