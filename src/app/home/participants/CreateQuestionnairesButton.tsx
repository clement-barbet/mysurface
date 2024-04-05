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
import {LoadingMessage} from "@/components/ui/msg/loading_msg";

export default function CreateQuestionnairesButton({
	phase,
	participantCount,
}: {
	phase: string;
	participantCount: number;
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
				await supabase
					.from("app_settings")
					.update({ setting_value: "questionnaire" })
					.eq("setting_name", "phase");
				location.reload();
			} else {
				console.error("Error creating questionnaires");
			}
		} catch (error) {
			console.error("Error creating questionnaires:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const isEnrollmentPhase = phase === "enrollment";
	const canCreateQuestionnaires = isEnrollmentPhase && participantCount >= 2;

	if (!isEnrollmentPhase) {
		return null;
	}

	return (
		<>
			<LoadingMessage isLoading={isLoading} setIsLoading={setIsLoading} />
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<div className=" w-fit">
							<Button
								onClick={createQuestionnaires}
								disabled={!canCreateQuestionnaires}
							>
								Create Questionnaires
							</Button>
						</div>
					</TooltipTrigger>
					{!canCreateQuestionnaires && (
						<TooltipContent>
							<p>
								You need to add at least 2 participants before
								generating the questionnaires.
							</p>
						</TooltipContent>
					)}
				</Tooltip>
			</TooltipProvider>
		</>
	);
}
