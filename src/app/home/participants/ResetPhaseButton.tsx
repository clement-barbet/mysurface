"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import T from "@/components/translations/translation";

const ResetPhaseButton = ({ phase }: { phase: string }) => {
	const handleClick = async () => {
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
            .neq('id', '00000000-0000-0000-0000-000000000000');

		if (deleteError) {
			console.error("Error deleting questionnaires:", deleteError);
		} else {
			console.log("Questionnaires deleted successfully");
		}

		// Reload the page to show updated table
		if (!updateError && !deleteError) {
			location.reload();
		}
	};

	if (phase !== "questionnaire") {
		return null;
	}

	return <Button id="resetPhaseBtn" onClick={handleClick}><T tkey="participants.form.buttons.reset" /></Button>;
};

export default ResetPhaseButton;
