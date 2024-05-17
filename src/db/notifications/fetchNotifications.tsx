import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
const supabase = createClientComponentClient();

export const fetchNotifications = async () => {
    try {
        const { data: fetchedNotifications, error } = await supabase
            .from("notifications")
            .select("*");

        if (error) throw error;
        return fetchedNotifications;
    } catch (error) {
        console.error("Error fetching notifications:", error);
    }
};