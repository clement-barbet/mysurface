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
		const { data: insertedParticipant, error } = await supabase.rpc(
			"insert_participant_and_return",
			{ new_email: participant.email, new_name: participant.name }
		);

		if (error) {
			console.error(
				"Error adding participant in addParticipantToDatabase:",
				error
			);
			return;
		}

		return insertedParticipant;
	};

	const handleFileUpload = async () => {
		if (!file) return;

		Papa.parse(file, {
			header: true,
			complete: async (results) => {
				const maxRows = 200;
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

					const insertedParticipants = await addParticipantToDatabase(
						newParticipant
					);
					const insertedParticipant = insertedParticipants[0];
					newParticipant.id = insertedParticipant.participant_id;
					onParticipantAdded(newParticipant);
				}
			},
		});
	};

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
		let newParticipant = { name: data.name, email: data.email };
		const insertedParticipants = await addParticipantToDatabase(
			newParticipant
		);

		if (insertedParticipants && insertedParticipants.length > 0) {
			const insertedParticipant = insertedParticipants[0];
			newParticipant.id = insertedParticipant.participant_id;
			onParticipantAdded(newParticipant);
			form.reset();
		} else {
			console.error(
				"Error adding participant onSubmit:",
				insertedParticipants
			);
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
						render={({ field }) => (
							<FormItem className="md:w-1/3 w-full">
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
						render={({ field }) => (
							<FormItem className="md:w-1/3 w-full">
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
						className="md:w-1/3 w-full"
						disabled={!isEnrollmentPhase}
					>
						<T tkey="participants.form.buttons.add" />
					</Button>
				</form>
			</Form>
			<div className="mt-4 w-full flex flex-col md:flex-row md:space-x-8 justify-between gap-y-2 md:gap-y-0">
				<div className="md:w-2/3">
					<input type="file" onChange={handleFileChange} />
				</div>
				<Button
					type="submit"
					id="uploadCsvBtn"
					className="w-full md:w-1/3"
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
