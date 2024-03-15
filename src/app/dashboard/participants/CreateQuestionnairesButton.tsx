"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function CreateQuestionnairesButton({
  phase,
  participantCount,
}: {
  phase: string;
  participantCount: number;
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
  const canCreateQuestionnaires = isEnrollmentPhase && participantCount >= 2;

  if (!isEnrollmentPhase) {
    return null;
  }

  return (
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
              You need to add at least 2 participants before generating the
              questionnaires.
            </p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}
