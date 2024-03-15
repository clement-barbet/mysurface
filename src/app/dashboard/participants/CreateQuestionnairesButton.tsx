"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function CreateQuestionnairesButton({
  phase,
}: {
  phase: string;
}) {
  const createQuestionnaires = async () => {
    try {
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
      } else {
        console.error("Error creating questionnaires");
      }
    } catch (error) {
      console.error("Error creating questionnaires:", error);
    }
  };

  const isEnrollmentPhase = phase === "enrollment";

  return (
    <button onClick={createQuestionnaires} disabled={!isEnrollmentPhase}>
      Create Questionnaires
    </button>
  );
}
