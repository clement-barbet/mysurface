import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
const supabase = createClientComponentClient();

export const fetchAssesseds = async (userId, processId) => {
    try {
        const { data: fetchedAssesseds, error } = await supabase
            .from("assessed")
            .select("*")
            .eq("user_id", userId)
            .eq("type", processId == 2 ? "leader" : "product")
            .order("name");
        if (error) throw error;
        return fetchedAssesseds;
    } catch (error) {
        console.error("Error fetching assesseds:", error.message);
    }
};