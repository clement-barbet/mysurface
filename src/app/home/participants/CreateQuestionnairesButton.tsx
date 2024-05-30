"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import T from "@/components/translations/translation";

export default function CreateQuestionnairesButton({
	isEnrollmentPhase,
	participants,
	setIsEnrollmentPhase,
	fetchParticipants,
	process,
	assesseds,
	userId,
}) {
	const [canCreateQuestionnaires, setCanCreateQuestionnaires] =
		useState(false);

	const createQuestionnaires = async () => {
		try {
			const response = await fetch("/api/create-questionnaires", {
				method: "POST",
			});

			if (response.ok) {
				// Update the phase to "questionnaire"
				const supabase = createClientComponentClient();
				await supabase
					.from("app_settings")
					.update({ isEnrollmentPhase: false })
					.eq("user_id", userId);

				fetchParticipants();
			} else {
				console.error("Error creating questionnaires");
			}
		} catch (error) {
			console.error("Error creating questionnaires:", error);
		} finally {
			setIsEnrollmentPhase(false);
		}
	};

	useEffect(() => {
		let canCreate;
		const participantCount = participants.length || 0;
		const assessedCount = assesseds.length || 0;
		if (process == 1) {
			canCreate = isEnrollmentPhase && participantCount >= 2;
		} else {
			canCreate =
				isEnrollmentPhase &&
				participantCount >= 1 &&
				assessedCount >= 1;
		}
		setCanCreateQuestionnaires(canCreate);
	}, [process, isEnrollmentPhase, participants, assesseds]);

	if (!isEnrollmentPhase) {
		return null;
	}

	return (
		<>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<div className="md:w-1/5 w-full">
							<Button
								className="w-full"
								id="createQuestionnairesBtn"
								onClick={createQuestionnaires}
								disabled={!canCreateQuestionnaires}
							>
								<T tkey="participants.buttons-section.buttons.questionnaire.text" />
							</Button>
						</div>
					</TooltipTrigger>
					{!canCreateQuestionnaires && (
						<TooltipContent>
							<p>
								<T tkey="participants.buttons-section.buttons.questionnaire.tooltip" />
							</p>
						</TooltipContent>
					)}
				</Tooltip>
			</TooltipProvider>
		</>
	);
}
