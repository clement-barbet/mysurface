import React, { useState } from "react";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import T from "@/components/translations/translation";

function FormAddParticipant({ onParticipantAdded, phase }) {
	const [newParticipant, setNewParticipant] = useState({
		name: "",
		email: "",
	});

	const formSchema = z.object({
		name: z.string().min(2, {
			message: "Name must be at least 2 characters.",
		}),
		email: z.string().email({
			message: "Invalid email address.",
		}),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			email: "",
		},
	});

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		try {
			const response = await fetch("/api/participants", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			if (response.ok) {
				const newParticipant = await response.json();
				onParticipantAdded(newParticipant);
				form.reset();
				console.log("Participant created successfully");
			} else {
				console.error("Error creating participant");
			}
		} catch (error) {
			console.error("Error creating participant:", error);
		}
	};

	const isEnrollmentPhase = phase === "enrollment";

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex md:space-x-4 space-y-4 md:items-end md:flex-row flex-col items-start w-full md:w-auto"
			>
				<FormField
					control={form.control}
					name="name"
					value={newParticipant.name}
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								<T tkey="participants.form.labels.name" />
							</FormLabel>
							<FormControl>
								<Input
									placeholder="John Doe"
									className=" dark:bg-mid_blue w-full"
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
					value={newParticipant.email}
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								<T tkey="participants.form.labels.email" />
							</FormLabel>
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
				<Button type="submit" id="addParticipantBtn" className="md:w-auto w-full" disabled={!isEnrollmentPhase}>
					<T tkey="participants.form.buttons.add" />
				</Button>
			</form>
		</Form>
	);
}

export default FormAddParticipant;
