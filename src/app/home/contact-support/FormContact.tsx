"use client";
import React, { useState } from "react";
import { set, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import T from "@/components/translations/translation";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
    lead_source: z.string(),
	subject: z.string().min(3).max(100),
	message: z.string().min(3).max(1000),
	name: z.string(),
	email: z.string().email(),
});

export default function FormContact({ settings }) {
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
            lead_source: "MySurface Form",
			subject: "",
			message: "",
			name: settings.name,
			email: settings.email,
		},
	});

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
			<div>
				<h2 className="mb-2 text-lg font-semibold border-l-4 border-mid_blue pl-2">
					Contact support
				</h2>
				<p className="text-gray-600 dark:text-gray-400 text-lg md:text-base mb-2">
					Please, fill out the form below to contact support.
				</p>
				<Form {...form}>
					<form
						action="https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8"
						method="POST"
						onSubmit={form.handleSubmit(() => {
							setSuccessMessage("Contact form submitted.");
							form.reset();
						})}
						className="flex flex-col gap-y-4"
					>
						{" "}
						<FormField
							control={form.control}
							name="subject"
							render={({ field }) => (
								<FormItem className="w-full">
									<FormLabel htmlFor="subject">
										Subject
									</FormLabel>
									<FormControl>
										<Input
											id="subject"
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
							name="message"
							render={({ field }) => (
								<FormItem className="w-full">
									<FormLabel htmlFor="message">
										Message
									</FormLabel>
									<FormControl>
										<textarea
											id="message"
											className="resize-none dark:bg-mid_blue box-border w-full min-h-32 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:accent_color focus:ring-offset-2 bg-dark_gray"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="w-full flex justify-end">
							<Button type="submit" className="w-full md:w-1/5">
								Send
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</>
	);
}
