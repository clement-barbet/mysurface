"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import T from "@/components/translations/translation";
import { resetPhase } from "./resetPhase";

const DeleteAllParticipantsButton = ({
	participantCount,
}: {
	participantCount: number;
}) => {
	// Return null if there are no participants
	if (participantCount === 0) {
		return null;
	}

	const handleClick = async () => {
		const supabase = createClientComponentClient();

		// Delete all records from participants
		const { error: deleteParticipantsError } = await supabase
			.from("participants")
			.delete()
			.neq("id", "00000000-0000-0000-0000-000000000000");

		if (deleteParticipantsError) {
			console.error("Error deleting participants:", deleteParticipantsError);
		} else {
			console.log("Participants deleted successfully");
		}

		// Reset the phase and delete all questionnaires
		const { updateError, deleteError } = await resetPhase();
		if (!updateError && !deleteError && !deleteParticipantsError) {
			location.reload();
		} else {
			console.error("Error deleting all participants:", updateError, deleteError, deleteParticipantsError);
		}
	};

	return (
		<Button
			id="resetPhaseBtn"
			onClick={handleClick}
			variant="delete"
		>
			<T tkey="participants.form.buttons.deleteAll" />
		</Button>
	);
};

export default DeleteAllParticipantsButton;