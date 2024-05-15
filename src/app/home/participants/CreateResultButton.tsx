"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import T from "@/components/translations/translation";

export default function CreateResultButton({
	isEnrollmentPhase,
	participantCount,
	atLeastOneQuestionnaireCompleted,
	process,
}: {
	isEnrollmentPhase: boolean;
	participantCount: number;
	atLeastOneQuestionnaireCompleted: boolean;
	process: any;
}) {
	const router = useRouter();

	const generateResult = async () => {
		try {
			let response;

			if (process == 1) {
				response = await fetch("/api/generate-result", {
					method: "POST",
				});
			} else {
				response = await fetch("/api/generate-result-assessed", {
					method: "POST",
				});
			}

			if (response.ok) {
				console.log("Result generated successfully");

				// Update the phase to "enrollment"
				const supabase = createClientComponentClient();
				const user = await supabase.auth.getUser();
				await supabase
					.from("app_settings")
					.update({ isEnrollmentPhase: true })
					.eq("user_id", user.data.user.id);

				// Redirect to the result page
				const resultResponse = await response.json();
				const resultId = resultResponse.resultId;
				router.push(`/home/results/${resultId}`);
			} else {
				console.error("Error generating result");
			}
		} catch (error) {
			console.error("Error generating result:", error);
		}
	};

	let canGenerateResult;

	if (process == 1) {
		canGenerateResult =
			!isEnrollmentPhase &&
			atLeastOneQuestionnaireCompleted &&
			participantCount >= 2;
	} else {
		canGenerateResult =
			!isEnrollmentPhase &&
			atLeastOneQuestionnaireCompleted &&
			participantCount >= 1;
	}
	
	if (!canGenerateResult) {
		return null;
	}

	return (
		<Button
			id="generateResultBtn"
			variant="login"
			className="uppercase md:w-1/5 w-full"
			onClick={generateResult}
		>
			<T tkey="participants.buttons-section.buttons.result" />
		</Button>
	);
}
