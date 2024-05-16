"use client";
import React, { useEffect, useState } from "react";
import { set, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import T from "@/components/translations/translation";

const formSchema = z.object({
	process_id: z.number(),
});

export default function SelectProcess({ onProcessIdChange }) {
	const [selectedProcess, setSelectedProcess] = useState(1);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			process_id: selectedProcess,
		},
	});

	const { setValue } = form;

	const handleSelectChange = (event) => {
		const newSelectedProcess = event.target.value;
		setSelectedProcess(newSelectedProcess);
		setValue("process_id", newSelectedProcess);
		onProcessIdChange(selectedProcess);
	};

	let processName;
	if (selectedProcess == 1) {
		processName = "participants.select-process.options.influence";
	} else if (selectedProcess == 2) {
		processName = "participants.select-process.options.leaders";
	} else if (selectedProcess == 3) {
		processName = "participants.select-process.options.products";
	}

	const processId = form.watch("process_id");

	useEffect(() => {
		setSelectedProcess(processId);
		onProcessIdChange(processId);
	}, [processId, onProcessIdChange, setSelectedProcess]);

	return (
		<>
			<div className="p-5 shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
				<h2 className="font-semibold text-lg mb-2  border-l-4 border-mid_blue pl-2">
					<T tkey="participants.titles.set-process" />
				</h2>
				<div>
					{selectedProcess == 1 && (
						<p className="text-darkest_gray italic text-sm">
							<span className="font-semibold">
								<T tkey="participants.select-process.options.influence" />
								:{" "}
							</span>
							<T tkey="participants.select-process.explanations.influence" />
						</p>
					)}
					{selectedProcess == 2 && (
						<p className="text-darkest_gray italic text-sm">
							<span className="font-semibold">
								<T tkey="participants.select-process.options.leaders" />
								:{" "}
							</span>
							<T tkey="participants.select-process.explanations.leaders" />
						</p>
					)}
					{selectedProcess == 3 && (
						<p className="text-darkest_gray italic text-sm">
							<span className="font-semibold">
								<T tkey="participants.select-process.options.products" />
								:{" "}
							</span>
							<T tkey="participants.select-process.explanations.products" />
							.
						</p>
					)}
				</div>
				<Form {...form}>
					<form className="w-2/5 space-y-8 flex flex-row items-end gap-x-4">
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
												<T tkey="participants.select-process.options.influence" />
											</option>
											<option value="2">
												<T tkey="participants.select-process.options.leaders" />
											</option>
											<option value="3">
												<T tkey="participants.select-process.options.products" />
											</option>
										</select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</form>
				</Form>
			</div>
		</>
	);
}
