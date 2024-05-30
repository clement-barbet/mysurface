"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import T from "@/components/translations/translation";
import { resetPhase } from "./resetPhase";
import { useState } from "react";
import { ErrorMessage } from "@/components/ui/msg/error_msg";
import { SuccessMessage } from "@/components/ui/msg/success_msg";

const DeleteAllParticipantsButton = ({
	participants,
	setParticipants,
	setIsEnrollmentPhase,
	userId,
}: {
	participants: any;
	setParticipants: any;
	setIsEnrollmentPhase: any;
	userId: any;
}) => {
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	const handleClick = async () => {
		const supabase = createClientComponentClient();
		let deleteParticipantsError = null;

		// Reset the phase and delete all questionnaires
		const { updateError, deleteError } = await resetPhase(userId);
		if (!updateError && !deleteError) {
			// Delete all records from participants
			const { error: deleteParticipantsError } = await supabase
				.from("participants")
				.delete()
				.eq("user_id", userId);

			if (deleteParticipantsError) {
				setErrorMessage("error.participants.participant.delete-all");
				console.error(
					"Error deleting participants:",
					deleteParticipantsError
				);
			} else {
				setSuccessMessage("success.participants.participant.delete-all");
				setParticipants([]);
				setIsEnrollmentPhase(true);
			}
		} else {
			setErrorMessage("error.participants.participant.delete-all");
			console.error(
				"Error deleting all participants:",
				updateError,
				deleteError,
				deleteParticipantsError
			);
		}
	};

	let participantCount = participants.length || 0;
	// Return null if there are no participants
	if (participantCount === 0) {
		return null;
	}

	return (
		<>
			<ErrorMessage
				errorMessage={errorMessage}
				setErrorMessage={setErrorMessage}
			/>
			<SuccessMessage
				successMessage={successMessage}
				setSuccessMessage={setSuccessMessage}
			/>
			<Button
				id="resetPhaseBtn"
				onClick={handleClick}
				variant="delete"
				className="md:w-1/5 w-full"
			>
				<T tkey="participants.buttons-section.buttons.deleteAll" />
			</Button>
		</>
	);
};

export default DeleteAllParticipantsButton;
