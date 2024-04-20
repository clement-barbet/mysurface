"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import T from "@/components/translations/translation";

export default function CreateQuestionnairesButton({
	isEnrollmentPhase,
	participantCount,
}) {
	const [isLoading, setIsLoading] = useState(false);
	const createQuestionnaires = async () => {
		try {
			setIsLoading(true);
			const response = await fetch("/api/create-questionnaires", {
				method: "POST",
			});

			if (response.ok) {
				console.log("Questionnaires created successfully");

				// Update the phase to "questionnaire"
				const supabase = createClientComponentClient();
				const user = await supabase.auth.getUser();
				await supabase
					.from("app_settings")
					.update({ isEnrollmentPhase: false })
					.eq("user_id", user.data.user.id);
			} else {
				console.error("Error creating questionnaires");
			}
		} catch (error) {
			console.error("Error creating questionnaires:", error);
		} finally {
			location.reload();
		}
	};

	const canCreateQuestionnaires = isEnrollmentPhase && participantCount >= 2;

	if (!isEnrollmentPhase) {
		return null;
	}

	return (
		<>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<div className="md:w-fit w-full">
							<Button
								className="md:w-auto w-full"
								id="createQuestionnairesBtn"
								onClick={createQuestionnaires}
								disabled={!canCreateQuestionnaires}
							>
								<T tkey="participants.form.buttons.questionnaire.text" />
							</Button>
						</div>
					</TooltipTrigger>
					{!canCreateQuestionnaires && (
						<TooltipContent>
							<p>
								<T tkey="participants.form.buttons.questionnaire.tooltip" />
							</p>
						</TooltipContent>
					)}
				</Tooltip>
			</TooltipProvider>
		</>
	);
}
