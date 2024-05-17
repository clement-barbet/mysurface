import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
const supabase = createClientComponentClient();

export const fetchNotifications = async (languageId) => {
	try {
		const { data: appNotifications, error } = await supabase
			.from("notifications")
			.select("*")
			.eq("language_id", languageId);

		if (error) throw error;
		return appNotifications || [];
	} catch (error) {
		console.error("Error loading notifications", error);
	}
};
