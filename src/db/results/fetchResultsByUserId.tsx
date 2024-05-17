import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
const supabase = createClientComponentClient();

export const fetchResults = async (userId) => {
	try {
		let { data: fetchedResults, error } = await supabase
			.from("results")
			.select("*")
			.order("created_at", { ascending: false })
			.eq("user_id", userId);

		if (error) throw error;
		return fetchedResults;
	} catch (error) {
		console.error("Error loading results", error);
	}
};
