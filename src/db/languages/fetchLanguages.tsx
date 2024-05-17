import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
const supabase = createClientComponentClient();

export const fetchLanguages = async () => {
    try {
        const { data: fetchedLanguages, error } = await supabase
            .from("languages")
            .select("*");

        if (error) throw error;
        return fetchedLanguages;
    } catch (error) {
        console.error("Error fetching languages:", error);
    }
};