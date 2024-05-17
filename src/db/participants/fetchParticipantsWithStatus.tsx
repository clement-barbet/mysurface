import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
const supabase = createClientComponentClient();

export const fetchParticipants = async () => {
	try {
		const { data: fetchedParticipants, error } = await supabase
			.from("participants")
			.select(
				`
      *,
      questionnaires:questionnaire (
        id,
        completed
      )
    `
			)
			.order("created_at", { ascending: false });
		if (error) throw error;
		return fetchedParticipants;
	} catch (error) {
		console.error("Error fetching participants:", error);
	}
};
