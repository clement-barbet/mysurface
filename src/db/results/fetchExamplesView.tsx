import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
const supabase = createClientComponentClient();

export const fetchExamples = async () => {
	try {
		let { data: fetchedExamples, error } = await supabase
			.from("example_results")
			.select("*")
			.order("id", { ascending: false });

		if (error) throw error;
		return fetchedExamples;
	} catch (error) {
		console.error("Error loading results", error);
	}
};
