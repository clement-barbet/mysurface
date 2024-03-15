import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const supabase = createServerComponentClient({ cookies });

  try {
    // Fetch questionnaires
    const { data: questionnaires, error: fetchQuestionnaireError } = await supabase
      .from("questionnaires")
      .select("id, data");

    if (fetchQuestionnaireError) {
      throw fetchQuestionnaireError;
    }

    // Fetch participants
    const { data: participants, error: fetchParticipantError } = await supabase
      .from("participants")
      .select("id, name, questionnaire");

    if (fetchParticipantError) {
      throw fetchParticipantError;
    }

    // Map participants to their respective questionnaires
    const participantsData = participants.map((participant) => {
      const questionnaire = questionnaires.find(
        (q) => q.id === participant.questionnaire
      );

      return {
        participantName: participant.name,
        data: questionnaire ? questionnaire.data : [],
      };
    });

    // Insert the participants data into the results table
    const { data: insertedResult, error: insertError } = await supabase
      .from("results")
      .insert([
        {
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
          result: JSON.stringify(participantsData),
          report_name: "Participants Data",
        },
      ])
      .select("*")
      .single();

    if (insertError) {
      throw insertError;
    }

    // Delete data from questionnaires and participants tables using raw SQL queries
    const { error: deleteQuestionnaireError } = await supabase.from('questionnaires').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (deleteQuestionnaireError) {
      throw deleteQuestionnaireError;
    }

    const { error: deleteParticipantError } = await supabase.from('participants').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (deleteParticipantError) {
      throw deleteParticipantError;
    }

    return NextResponse.json({ message: "Result generated successfully", resultId: insertedResult.id });
  } catch (error) {
    console.error("Error generating result:", error);
    return NextResponse.json(
      { error: "An error occurred while generating the result" },
      { status: 500 }
    );
  }
}