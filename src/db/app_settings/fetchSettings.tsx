import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
const supabase = createClientComponentClient();

export const fetchSettings = async () => {
	try {
		let { data: fetchedSettings, error } = await supabase
			.from("app_settings")
			.select("*");

		if (error) throw error;
		return fetchedSettings;
	} catch (error) {
		console.error("Error loading results", error);
	}
};
