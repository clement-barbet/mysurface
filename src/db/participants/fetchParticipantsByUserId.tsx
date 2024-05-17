import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
const supabase = createClientComponentClient();

export const fetchParticipants = async (userId) => {
	try {
		const { data: fetchedParticipants, error } = await supabase
			.from("participants")
			.select("*")
			.eq("user_id", userId)
			.order("name");
		if (error) throw error;
		return fetchedParticipants;
	} catch (error) {
		console.error("Error fetching participants:", error.message);
	}
};
