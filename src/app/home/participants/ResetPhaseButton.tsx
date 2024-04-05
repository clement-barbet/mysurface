"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";

const ResetPhaseButton = () => {
    const handleClick = async () => {
        const supabase = createClientComponentClient();
        const { error } = await supabase
            .from("app_settings")
            .update({ setting_value: "enrollment" })
            .eq("setting_name", "phase");

        if (error) {
            console.error('Error updating phase:', error);
        } else {
            console.log('Phase updated successfully');
            location.reload();
        }
    };

    return (
        <Button onClick={handleClick} className="my-5">
            Reset Process Phase
        </Button>
    );
};

export default ResetPhaseButton;