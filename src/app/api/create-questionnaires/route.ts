import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const supabase = createServerComponentClient({ cookies });
  const user = await supabase.auth.getUser();

  try {
    // Fetch all participants
    const { data: participants, error: fetchError } = await supabase
      .from("participants")
      .select("id")
      .eq("user_id", user.data.user?.id);

    if (fetchError) {
      throw fetchError;
    }

    // Create a new questionnaire for each participant
    const questionnaires = participants.map(() => ({
      completed: false,
      data: {},
    }));

    const { data: insertedQuestionnaires, error: insertError } = await supabase
      .from("questionnaires")
      .insert(questionnaires)
      .select("id");

    if (insertError) {
      throw insertError;
    }

    // Update the questionnaire field in the participants table
    const updatePromises = participants.map((participant, index) =>
      supabase
        .from("participants")
        .update({ questionnaire: insertedQuestionnaires[index].id })
        .eq("id", participant.id)
    );

    await Promise.all(updatePromises);

    return NextResponse.json({ message: "Questionnaires created successfully" });
  } catch (error) {
    console.error("Error creating questionnaires:", error);
    return NextResponse.json({ error: "An error occurred while creating questionnaires" }, { status: 500 });
  }
}