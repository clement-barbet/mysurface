"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import {
	Form,
	FormControl,
	FormItem,
	FormField,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/ui/msg/error_msg";
import { SuccessMessage } from "@/components/ui/msg/success_msg";

const formSchema = z.object({
	email: z.string().email(),
});

export default function ForgotPassword() {
	const supabase = createClientComponentClient();
	const [errorMessage, setErrorMessage] = useState<string | undefined>(
		undefined
	);
	const [successMessage, setSuccessMessage] = useState("");

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
		},
	});

	const handleResetPassword = async (values: z.infer<typeof formSchema>) => {
		const { error: resetError } = await supabase.auth.resetPasswordForEmail(
			values.email,
			{ redirectTo: "https://mysurface.vercel.app/reset-password" }
		);

		if (resetError) {
			setErrorMessage("Error sending password reset email.");
		} else {
			setSuccessMessage("Password reset email sent.");
		}
	};

	return (
		<div>
			{errorMessage && (
				<ErrorMessage
					errorMessage={errorMessage}
					setErrorMessage={setErrorMessage}
				/>
			)}
			{successMessage && (
				<SuccessMessage
					successMessage={successMessage}
					setSuccessMessage={setSuccessMessage}
				/>
			)}
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(handleResetPassword)}
					className="space-y-6"
				>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input
										placeholder="Your Email"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="flex justify-center items-center">
						<Button type="submit" variant="login">
							SEND RESET EMAIL
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
