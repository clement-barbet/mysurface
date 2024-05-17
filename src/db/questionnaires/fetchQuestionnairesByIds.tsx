import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
const supabase = createClientComponentClient();

export const fetchQuestionnaires = async (questionnaireIds) => {
    try {
        const { data: fetchedQuestionnaires, error } = await supabase
            .from("questionnaires")
            .select("*")
            .in("id", questionnaireIds);
        if (error) throw error;
        return fetchedQuestionnaires;
    } catch (error) {
        console.error("Error fetching questionnaires:", error.message);
    }
};