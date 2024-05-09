"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import T from "@/components/translations/translation";

export default function CreateResultButton({
  isEnrollmentPhase,
  allQuestionnairesCompleted,
}: {
  isEnrollmentPhase: boolean;
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

  const canGenerateResult = !isEnrollmentPhase && allQuestionnairesCompleted;

  if (!canGenerateResult) {
    return null;
  }

  return <Button id="generateResultBtn" variant="login" className="uppercase md:w-1/5 w-full" onClick={generateResult}><T tkey="participants.buttons-section.buttons.result"/></Button>;
}
