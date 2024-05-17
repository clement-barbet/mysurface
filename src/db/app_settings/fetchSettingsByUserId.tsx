import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
const supabase = createClientComponentClient();

export const fetchSettings = async (userId) => {
    try {
        const { data: appSettings, error: appSettingsError } =
            await supabase
                .from("app_settings")
                .select("*")
                .eq("user_id", userId)
                .single();
        if (appSettingsError) throw appSettingsError;
        return appSettings;
    } catch (error) {
        console.error("Error fetching phase:", error.message);
    }
};