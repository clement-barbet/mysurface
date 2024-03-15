"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function CreateResultButton({
  phase,
  allQuestionnairesCompleted,
}: {
  phase: string;
  allQuestionnairesCompleted: boolean;
}) {
  const router = useRouter();

  const generateResult = async () => {
    try {
      const response = await fetch("/api/generate-result", {
        method: "POST",
      });

      if (response.ok) {
        console.log("Result generated successfully");

        // Update the phase to "enrollment"
        const supabase = createClientComponentClient();
        await supabase
          .from("app_settings")
          .update({ setting_value: "enrollment" })
          .eq("setting_name", "phase");

        // Redirect to the result page
        const resultResponse = await response.json();
        const resultId = resultResponse.resultId;
        router.push(`/dashboard/results/${resultId}`);
      } else {
        console.error("Error generating result");
      }
    } catch (error) {
      console.error("Error generating result:", error);
    }
  };

  const isQuestionnairePhase = phase === "questionnaire";
  const canGenerateResult = isQuestionnairePhase && allQuestionnairesCompleted;

  return (
    <button onClick={generateResult} disabled={!canGenerateResult}>
      Generate Result
    </button>
  );
}
