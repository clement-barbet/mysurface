"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { LoadingMessage } from "@/components/ui/msg/loading_msg";

const formSchema = z.object({
	name: z.string().min(2, {
		message: "Name must be at least 2 characters.",
	}),
	email: z.string().email({
		message: "Invalid email address.",
	}),
});

export function CreateParticipantForm({ phase }: { phase: string }) {
	const [isLoading, setIsLoading] = useState(false);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			email: "",
		},
	});

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		setIsLoading(true);
		try {
			const response = await fetch("/api/participants", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			if (response.ok) {
				form.reset();
				console.log("Participant created successfully");
				location.reload();
			} else {
				console.error("Error creating participant");
			}
		} catch (error) {
			console.error("Error creating participant:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const isEnrollmentPhase = phase === "enrollment";

	return (
		<>
			<LoadingMessage isLoading={isLoading} setIsLoading={setIsLoading} />

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex md:space-x-4 space-y-4 md:items-end md:flex-row flex-col items-start w-full md:w-auto"
				>
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Name</FormLabel>
								<FormControl>
									<Input
										placeholder="John Doe"
										className=" dark:bg-mid_blue"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input
										placeholder="john@example.com"
										className=" dark:bg-mid_blue"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit" disabled={!isEnrollmentPhase}>
						Add Participant
					</Button>
				</form>
			</Form>
		</>
	);
}
