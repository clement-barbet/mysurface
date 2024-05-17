import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
const supabase = createClientComponentClient();

export const fetchRole = async (userId) => {
	try {
		let { data: fetchedRoles, error } = await supabase
			.from("roles")
			.select("role")
			.eq("user_id", userId)
			.single();

		if (error) throw error;
		return fetchedRoles;
	} catch (error) {
		console.error("Error loading roles", error);
	}
};
