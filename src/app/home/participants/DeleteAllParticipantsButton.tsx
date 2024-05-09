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
		const user = await supabase.auth.getUser();
		let deleteParticipantsError = null;

		// Reset the phase and delete all questionnaires
		const { updateError, deleteError } = await resetPhase();
		if (!updateError && !deleteError) {
			// Delete all records from participants
			const { error: deleteParticipantsError } = await supabase
				.from("participants")
				.delete()
				.eq("user_id", user.data.user.id);

			if (deleteParticipantsError) {
				console.error(
					"Error deleting participants:",
					deleteParticipantsError
				);
			} else {
				console.log("Participants deleted successfully");
				location.reload();
			}
		} else {
			console.error(
				"Error deleting all participants:",
				updateError,
				deleteError,
				deleteParticipantsError
			);
		}
	};

	return (
		<Button id="resetPhaseBtn" onClick={handleClick} variant="delete" className="md:w-1/5 w-full">
			<T tkey="participants.buttons-section.buttons.deleteAll" />
		</Button>
	);
};

export default DeleteAllParticipantsButton;
