import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import ParticipantsPageClient from "./ParticipantsPageClient";

export default async function ParticipantsPage() {
  const supabase = createServerComponentClient({ cookies });

  const { data: initialParticipants } = await supabase
    .from("participants")
    .select("*");

  const { data: initialQuestionnaires } = await supabase
    .from("questionnaires")
    .select("*");

  const { data: initialAppSettings } = await supabase
    .from("app_settings")
    .select("*")
    .eq("setting_name", "phase")
    .single();

  return (
    <ParticipantsPageClient
      initialParticipants={initialParticipants || []}
      initialQuestionnaires={initialQuestionnaires || []}
      initialAppSettings={initialAppSettings || {}}
    />
  );
}
