import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export const resetPhase = async () => {
	const supabase = createClientComponentClient();

	// Update phase to enrollment
	const { error: updateError } = await supabase
		.from("app_settings")
		.update({ setting_value: "enrollment" })
		.eq("setting_name", "phase");

	if (updateError) {
		console.error("Error updating phase:", updateError);
	} else {
		console.log("Phase updated successfully");
	}

	// Delete all records from questionnaires
	const { error: deleteError } = await supabase
		.from("questionnaires")
		.delete()
		.neq("id", "00000000-0000-0000-0000-000000000000");

	if (deleteError) {
		console.error("Error deleting questionnaires:", deleteError);
	} else {
		console.log("Questionnaires deleted successfully");
	}

	return {
		updateError,
		deleteError,
	};
};
