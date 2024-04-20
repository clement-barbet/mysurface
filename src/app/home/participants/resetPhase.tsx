import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export const resetPhase = async () => {
	const supabase = createClientComponentClient();
	const user = await supabase.auth.getUser();
	let deleteError = null;

	// Update phase to enrollment
	const { error: updateError } = await supabase
		.from("app_settings")
		.update({ isEnrollmentPhase: true })
		.eq("user_id", user.data.user.id);

	if (updateError) {
		console.error("Error updating phase:", updateError);
	} else {
		console.log("Phase updated successfully");
	}

	// Get questionnaire IDs for the logged in user
	const { data: questionnaireData, error: questionnaireError } =
		await supabase
			.from("participants")
			.select("questionnaire")
			.eq("user_id", user.data.user.id);

	if (questionnaireError) {
		console.error("Error getting questionnaires:", questionnaireError);
	} else {
		const questionnaireIds = questionnaireData.map((q) => q.questionnaire);

		// Delete all records from questionnaires
		const { error: deleteError } = await supabase
			.from("questionnaires")
			.delete()
			.in("id", questionnaireIds);

		if (deleteError) {
			console.error("Error deleting questionnaires:", deleteError);
		} else {
			console.log("Questionnaires deleted successfully");
		}
	}

	return {
		updateError,
		deleteError,
	};
};
