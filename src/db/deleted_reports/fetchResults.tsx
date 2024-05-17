import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
const supabase = createClientComponentClient();

export const fetchResults = async () => {
	try {
		let { data: fetchedResults, error } = await supabase
			.from("deleted_reports")
			.select("*")
			.order("deleted_at", { ascending: false });

		if (error) throw error;
		return fetchedResults;
	} catch (error) {
		console.error("Error loading results", error);
	}
};
