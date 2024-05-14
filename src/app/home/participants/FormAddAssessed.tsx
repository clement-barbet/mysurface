"use client";
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
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

function FormAddAssessed({ process, onAssessedAdded, isEnrollmentPhase }) {
	const supabase = createClientComponentClient();

	let typeAssessed = process == 2 ? "leader" : "product";

	const formSchema = z.object({
		name: z.string().min(2, {
			message: "Name must be at least 2 characters.",
		}),
		description: z.string(),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			description: "",
		},
	});

	const addAssessedToDatabase = async (assessed) => {
		const { data: insertedAssessed, error } = await supabase.rpc(
			"insert_assessed_and_return",
			{ new_name: assessed.name, new_description: assessed.description, new_type_text: typeAssessed }
		);

		if (error) {
			console.error(
				"Error adding assessed in addAssessedToDatabase:",
				error
			);
			return;
		}

		return insertedAssessed[0];
	};

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		let newAssessed = { name: data.name, description: data.description };
		if (newAssessed.description == "") {
			newAssessed.description = null;
		}

		const insertedAssessed = await addAssessedToDatabase(newAssessed);

		if (insertedAssessed) {
			newAssessed.id = insertedAssessed.assessed_id;
			onAssessedAdded(newAssessed);
			form.reset();
		} else {
			console.error("Error adding assessed onSubmit:", insertedAssessed);
		}
	};

	if (process == 1 || !process || !isEnrollmentPhase) {
		return null;
	}

	return (
		<div className="my-2 p-5 shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
			<h2 className="mb-2 text-xl font-semibold">
				{process == 2 ? (
					<T tkey="participants.titles.add-leader" />
				) : (
					<T tkey="participants.titles.add-product" />
				)}
			</h2>
			<div className="w-full my-2">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex md:space-x-4 gap-y-2 md:items-end md:flex-row flex-col items-start w-full md:w-auto"
					>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem className="md:w-2/5 w-full">
									<FormLabel>
										<T tkey="participants.form.labels.name" />
									</FormLabel>
									<FormControl>
										<Input
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
							name="description"
							render={({ field }) => (
								<FormItem className="md:w-2/5 w-full">
									<FormLabel>
										<T tkey="participants.form.labels.description" />
									</FormLabel>
									<FormControl>
										<Input
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
							className="md:w-1/5 w-full"
						>
							{process == 2 ? (
								<T tkey="participants.form.buttons.add-leader" />
							) : (
								<T tkey="participants.form.buttons.add-product" />
							)}
						</Button>
					</form>
				</Form>
			</div>
		</div>
	);
}

export default FormAddAssessed;
