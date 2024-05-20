"use client";
import React, { useEffect } from "react";
import { set, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
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
	name: z.string(),
});

export default function SelectProcess({ onNameChange }) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
		},
	});

	const { setValue } = form;

	const handleChange = (event) => {
		const newSelectedName = event.target.value;
		setValue("name", newSelectedName);
		onNameChange(newSelectedName);
	};

	const reportName = form.watch("name");

	useEffect(() => {
		onNameChange(reportName);
	}, [reportName, onNameChange]);

	return (
		<>
			<div className="p-5 shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
				<h2 className="font-semibold text-lg mb-2  border-l-4 border-mid_blue pl-2">
					<T tkey="modeling.report-name.title" />
				</h2>
				<Form {...form}>
					<form className="w-2/5 space-y-8 flex flex-row items-end gap-x-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel htmlFor="name">
										<T tkey="modeling.report-name.label" />
									</FormLabel>
									<FormControl>
										<Input
											name="name"
											id="name"
											onChange={handleChange}
										/>
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
