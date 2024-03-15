import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import ParticipantsTable from "./participants-table";
import CreateQuestionnairesButton from "./CreateQuestionnairesButton";
import { CreateParticipantForm } from "./CreateParticipantForm";
import CreateResultButton from "./CreateResultButton";

export default async function ParticipantsPage() {
  const supabase = createServerComponentClient({ cookies });

  const { data: participants, error: participantsError } = await supabase
    .from("participants")
    .select("*");

  const { data: questionnaires, error: questionnairesError } = await supabase
    .from("questionnaires")
    .select("*");

  const { data: appSettings, error: appSettingsError } = await supabase
    .from("app_settings")
    .select("*")
    .eq("setting_name", "phase")
    .single();

  if (participantsError || questionnairesError || appSettingsError) {
    console.error(
      "Error fetching data:",
      participantsError || questionnairesError || appSettingsError
    );
    // Handle the error appropriately
  }

  const allQuestionnairesCompleted = questionnaires.every(
    (questionnaire) => questionnaire.completed
  );

  return (
    <div>
      <ParticipantsTable
        initialParticipants={participants}
        questionnaires={questionnaires}
      />
      <CreateParticipantForm phase={appSettings.setting_value} />
      <CreateQuestionnairesButton phase={appSettings.setting_value} />
      <CreateResultButton
        phase={appSettings.setting_value}
        allQuestionnairesCompleted={allQuestionnairesCompleted}
      />
    </div>
  );
}
