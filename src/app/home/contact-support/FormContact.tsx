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

/*
<input name="oid" type="hidden" value="00D1t000000xBws" />
<input name="00N3X00000GmwAR" type="hidden" value="Enterprise" />
<input name="00N3X00000LsGqJ" type="hidden" value="Question" />
<input name="lead_source" type="hidden" value="Academy Web Form" />
<input id="00N3X00000LsGqT" name="00N3X00000LsGqT" type="hidden" value="" />
*/

const formSchema = z.object({
    oid: z.string(),
    "00N3X00000GmwAR": z.string(),
    "00N3X00000LsGqJ": z.string(),
    "00N3X00000LsGqT": z.string(),
    lead_source: z.string(),
	subject: z.string().min(3).max(100),
	lead_notes: z.string().min(3).max(1000),
	last_name: z.string(),
	email: z.string().email(),
});

export default function FormContact({ settings }) {
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
            oid: "00D1t000000xBws",
            "00N3X00000GmwAR": "Enterprise",
            "00N3X00000LsGqJ": "Question",
            "00N3X00000LsGqT": "",
            lead_source: "MySurface App Form",
			subject: "",
			lead_notes: "",
			last_name: settings.name,
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
						onSubmit={form.handleSubmit((data) => {
                            console.log("Sending data: ", data);
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
							name="lead_notes"
							render={({ field }) => (
								<FormItem className="w-full">
									<FormLabel htmlFor="lead_notes">
										Message
									</FormLabel>
									<FormControl>
										<textarea
											id="lead_notes"
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
