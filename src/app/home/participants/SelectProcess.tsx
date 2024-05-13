"use client";
import React, { useEffect, useState } from "react";
import { set, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { SuccessMessage } from "@/components/ui/msg/success_msg";
import { ErrorMessage } from "@/components/ui/msg/error_msg";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
	process_id: z.string(),
});

export default function ChangeOrganization({
	userId,
	process,
	setProcess,
	isEnrollmentPhase,
}) {
	const supabase = createClientComponentClient();
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [selectedProcess, setSelectedProcess] = useState(process);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			process_id: selectedProcess,
		},
	});

	useEffect(() => {
		setSelectedProcess(process);
	}, [process]);

	const { setValue } = form;

	const handleSelectChange = (event) => {
		const newSelectedProcess = event.target.value;
		setSelectedProcess(newSelectedProcess);
		setValue("process_id", newSelectedProcess);
	};

	const handleChangeProcess = async (data: z.infer<typeof formSchema>) => {
		const { process_id } = data;

		const { error: updateError } = await supabase
			.from("app_settings")
			.update({ process_id: process_id })
			.eq("user_id", userId);

		if (updateError) {
			console.log(updateError);
			setErrorMessage(updateError.message);
		} else {
			setSuccessMessage("Process updated successfully.");
			setProcess(process_id);
		}
	};

	let processName;
	if (selectedProcess === 1) {
		processName = "Influence";
	} else if (selectedProcess === 2) {
		processName = "Leaders";
	} else if (selectedProcess === 3) {
		processName = "Products";
	}

	if (selectedProcess === null) {
		return null;
	}

	return (
		<>
			<ErrorMessage
				errorMessage={errorMessage}
				setErrorMessage={setErrorMessage}
			/>
			<SuccessMessage
				successMessage={successMessage}
				setSuccessMessage={setSuccessMessage}
			/>
			{isEnrollmentPhase ? (
				<div className="mb-2 p-5 shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
					<h2 className="font-bold mb-2">Set your process</h2>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(handleChangeProcess)}
							className="w-2/5 space-y-8 flex flex-row items-end gap-x-4"
						>
							<FormField
								control={form.control}
								name="process_id"
								render={({ field }) => (
									<FormItem>
										<FormLabel htmlFor="process_id">
											Process
										</FormLabel>
										<FormControl>
											<select
												name="process_id"
												id="process_id"
												onChange={handleSelectChange}
												value={selectedProcess}
												className="dark:bg-mid_blue appearance-none box-border w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 bg-dark_gray cursor-pointer"
											>
												<option value="1">
													Influence
												</option>
												<option value="2">
													Leaders
												</option>
												<option value="3">
													Products
												</option>
											</select>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="w-full flex justify-end">
								<Button type="submit" className="w-full">
									Select
								</Button>
							</div>
						</form>
					</Form>
				</div>
			) : (
				<div className="mb-2 p-5 shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
					<h2 className="font-bold">
						Selected process: <i className="font-normal">{processName?.toUpperCase()}</i>
					</h2>
				</div>
			)}
		</>
	);
}
