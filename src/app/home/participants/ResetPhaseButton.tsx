"use client";
import { Button } from "@/components/ui/button";
import T from "@/components/translations/translation";
import { resetPhase } from "./resetPhase";

const ResetPhaseButton = ({ phase }: { phase: string }) => {
	const handleClick = async () => {
		const { updateError, deleteError } = await resetPhase();
		if (!updateError && !deleteError) {
			location.reload();
		} else {
			console.error("Error resetting phase:", updateError, deleteError);
		}
	};

	if (phase !== "questionnaire") {
		return null;
	}

	return (
		<Button id="resetPhaseBtn" onClick={handleClick}>
			<T tkey="participants.form.buttons.reset" />
		</Button>
	);
};

export default ResetPhaseButton;
