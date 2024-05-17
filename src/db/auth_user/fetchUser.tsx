import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
const supabase = createClientComponentClient();

export const fetchUser = async () => {
    try {
        const fetchedUser = await supabase.auth.getUser();
        if (!fetchedUser.data.user)
            throw new Error("User not authenticated");
        return fetchedUser.data.user;
    } catch (error) {
        console.error("Error fetching user", error);
    }
};