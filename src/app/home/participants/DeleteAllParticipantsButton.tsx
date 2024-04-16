"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import T from "@/components/translations/translation";

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
		const { error: deleteError } = await supabase
			.from("participants")
			.delete()
			.neq("id", "00000000-0000-0000-0000-000000000000");

		if (deleteError) {
			console.error("Error deleting participants:", deleteError);
		} else {
			console.log("Participants deleted successfully");
		}

		// Reload the page to show updated table
		if (!deleteError) {
			location.reload();
		}
	};

	return (
		<Button
			id="resetPhaseBtn"
			onClick={handleClick}
			className="bg-red-500 px-2 py-1 rounded text-white"
		>
			<T tkey="participants.form.buttons.deleteAll" />
		</Button>
	);
};

export default DeleteAllParticipantsButton;
