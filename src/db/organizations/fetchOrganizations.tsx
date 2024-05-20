import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
const supabase = createClientComponentClient();

export const fetchOrganizations = async () => {
    try {
        const { data: fetchedOrganizations, error } = await supabase
            .from("organizations")
            .select("*");

        if (error) throw error;
        return fetchedOrganizations;
    } catch (error) {
        console.error("Error fetching organizations:", error);
    }
};