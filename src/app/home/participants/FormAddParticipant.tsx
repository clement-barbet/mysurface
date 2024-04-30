"use client";
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
import Papa from "papaparse";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

function FormAddParticipant({ onParticipantAdded, isEnrollmentPhase }) {
	const [file, setFile] = useState(null);
	const supabase = createClientComponentClient();

	const handleFileChange = (event) => {
		setFile(event.target.files[0]);
	};

	const addParticipantToDatabase = async (participant) => {
		try {
			const { data, error } = await supabase
				.from("participants")
				.insert([participant]);

			if (error) {
				console.error("Error adding participant:", error);
				return;
			}

			console.log("Participant added successfully:", data);
		} catch (error) {
			console.error("Error adding participant:", error);
		}
	};

	const handleFileUpload = async () => {
		if (!file) return;

		Papa.parse(file, {
			header: true,
			complete: async (results) => {
				const maxRows = 100; // Reemplaza esto con tu límite
				if (results.data.length > maxRows) {
					console.error(
						`Too many rows: ${results.data.length}. The limit is ${maxRows}.`
					);
					return;
				}
				for (let row of results.data) {
					const newParticipant = { name: row.name, email: row.email };

					if (!newParticipant.name || !newParticipant.email) {
						console.error(
							"Invalid participant data:",
							newParticipant
						);
						continue;
					}

					const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
					if (!emailRegex.test(newParticipant.email)) {
						console.error("Invalid email:", newParticipant.email);
						continue;
					}

					await addParticipantToDatabase(newParticipant);
					onParticipantAdded(newParticipant);
				}
			},
		});
	};

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

	return (
		<>
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
					<Button
						type="submit"
						id="addParticipantBtn"
						className="md:w-auto w-full"
						disabled={!isEnrollmentPhase}
					>
						<T tkey="participants.form.buttons.add" />
					</Button>
				</form>
			</Form>
			<div className="mt-4 w-full flex flex-col md:flex-row justify-between gap-y-2 md:gap-y-0">
				<input type="file" onChange={handleFileChange} />
				<Button
					type="submit"
					id="addParticipantBtn"
					className="md:w-auto w-full"
					disabled={!isEnrollmentPhase}
					onClick={handleFileUpload}
				>
					<T tkey="participants.csv.button" />
				</Button>
			</div>
		</>
	);
}

export default FormAddParticipant;
