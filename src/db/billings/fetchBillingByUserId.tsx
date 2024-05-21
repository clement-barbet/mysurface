import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
const supabase = createClientComponentClient();

export const fetchBilling = async (userId) => {
    try {
        const { data: billing, error: billingError } =
            await supabase
                .from("billings")
                .select("*")
                .eq("user_id", userId)
                .single();
        if (billingError) throw billingError;
        return billing;
    } catch (error) {
        console.error("Error fetching phase:", error.message);
    }
};