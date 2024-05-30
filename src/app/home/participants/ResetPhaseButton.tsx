"use client";
import { Button } from "@/components/ui/button";
import T from "@/components/translations/translation";
import { resetPhase } from "./resetPhase";

const ResetPhaseButton = ({
	isEnrollmentPhase,
	setIsEnrollmentPhase,
	fetchParticipants,
	userId,
}: {
	isEnrollmentPhase: boolean;
	setIsEnrollmentPhase: (value: boolean) => void;
	fetchParticipants: () => void;
	userId: any;
}) => {
	const handleClick = async () => {
		const { updateError, deleteError } = await resetPhase(userId);
		if (!updateError && !deleteError) {
			setIsEnrollmentPhase(true);
			fetchParticipants();
		} else {
			console.error("Error resetting phase:", updateError, deleteError);
		}
	};

	if (isEnrollmentPhase) {
		return null;
	}

	return (
		<Button
			id="resetPhaseBtn"
			onClick={handleClick}
			className="md:w-1/5 w-full"
		>
			<T tkey="participants.buttons-section.buttons.reset" />
		</Button>
	);
};

export default ResetPhaseButton;
