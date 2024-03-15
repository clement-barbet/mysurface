"use client";
// app/dashboard/participants/participants-table.tsx
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Participants } from "./columns";

export default function ParticipantsTable({
  initialParticipants,
  questionnaires,
}: {
  initialParticipants: Participants[];
  questionnaires: any[]; // Adjust the type based on your questionnaire data structure
}) {
  const [participants, setParticipants] = useState(initialParticipants);

  useEffect(() => {
    // ... (existing code)
  }, []);

  return <DataTable columns={columns(questionnaires)} data={participants} />;
}
