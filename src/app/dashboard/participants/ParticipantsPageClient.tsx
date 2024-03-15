"use client";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import ParticipantsTable from "./participants-table";
import CreateQuestionnairesButton from "./CreateQuestionnairesButton";
import { CreateParticipantForm } from "./CreateParticipantForm";
import CreateResultButton from "./CreateResultButton";

export default function ParticipantsPageClient({
  initialParticipants,
  initialQuestionnaires,
  initialAppSettings,
}) {
  const [participants, setParticipants] = useState(initialParticipants);
  const [questionnaires, setQuestionnaires] = useState(initialQuestionnaires);
  const [appSettings, setAppSettings] = useState(initialAppSettings);

  useEffect(() => {
    const supabase = createClientComponentClient();

    const fetchData = async () => {
      const { data: participants, error: participantsError } = await supabase
        .from("participants")
        .select("*");

      const { data: questionnaires, error: questionnairesError } =
        await supabase.from("questionnaires").select("*");

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
      } else {
        setParticipants(participants);
        setQuestionnaires(questionnaires);
        setAppSettings(appSettings);
      }
    };

    fetchData();
  }, []);

  const allQuestionnairesCompleted = questionnaires.every(
    (questionnaire) => questionnaire.completed
  );

  const participantCount = participants.length;

  return (
    <div>
      <ParticipantsTable
        initialParticipants={participants}
        questionnaires={questionnaires}
      />
      <CreateParticipantForm phase={appSettings.setting_value} />
      <CreateQuestionnairesButton
        phase={appSettings.setting_value}
        participantCount={participantCount}
      />
      <CreateResultButton
        phase={appSettings.setting_value}
        allQuestionnairesCompleted={allQuestionnairesCompleted}
      />
    </div>
  );
}
