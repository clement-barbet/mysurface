"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";

const ResetPhaseButton = ({ phase }: { phase: string }) => {
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

    if (phase !== "questionnaire") {
        return null;
    }

    return (
        <Button onClick={handleClick}>
            Reset Process Phase
        </Button>
    );
};

export default ResetPhaseButton;