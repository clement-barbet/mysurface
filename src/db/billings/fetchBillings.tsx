import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
const supabase = createClientComponentClient();

export const fetchBillings = async () => {
    try {
        const { data: billings, error: billingsError } =
            await supabase
                .from("billings")
                .select("*");
        if (billingsError) throw billingError;
        return billings;
    } catch (error) {
        console.error("Error fetching phase:", error.message);
    }
};