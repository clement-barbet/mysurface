"use client";
import React, { useState } from "react";
import { set, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { SuccessMessage } from "@/components/ui/msg/success_msg";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import T from "@/components/translations/translation";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
	oid: z.string(),
	"00N3X00000GmwAR": z.string(),
	"00N3X00000LsGqJ": z.string(),
	"00N3X00000LsGqT": z.string(),
	"00N3X00000Goi09": z.string(),
	lead_source: z.string(),
	subject: z.string().min(3).max(100),
	"00N3X00000GoT3y": z.string().min(3).max(1000),
	last_name: z.string(),
	email: z.string().email(),
	company: z.string(),
	phone: z.string(),
	retURL: z.string(),
	encoding: z.string(),
	Submit: z.string(),
});

export default function FormContact({ settings }) {
	const [successMessage, setSuccessMessage] = useState("");
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
	const actualUrl = baseUrl + "/home/contact-support";

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			oid: "00D1t000000xBws",
			"00N3X00000GmwAR": "MySurface",
			"00N3X00000LsGqJ": "Question",
			"00N3X00000LsGqT": "",
			"00N3X00000Goi09": "",
			lead_source: "MySurface",
			subject: "",
			"00N3X00000GoT3y": "",
			last_name: settings.name || "No name",
			email: settings.email,
			company: settings.organization || "No organization",
			phone: "",
			retURL: actualUrl,
			encoding: "UTF-8",
			Submit: "Send",
		},
	});

	const onSubmit = (formData: z.infer<typeof formSchema>) => {
		console.log("Sending data: ", formData);
		setSuccessMessage("success.support");
		form.reset();
	};

	return (
		<>
			<SuccessMessage
				successMessage={successMessage}
				setSuccessMessage={setSuccessMessage}
			/>
			<div>
				<h2 className="mb-2 text-lg font-semibold border-l-4 border-mid_blue pl-2">
					<T tkey="support.title" />
				</h2>
				<p className="text-gray-600 dark:text-gray-400 text-lg md:text-base mb-2">
					<T tkey="support.subtitle" />
				</p>
				<Form {...form}>
					<form
						action="https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8"
						method="POST"
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-col gap-y-4"
					>
						<input type="hidden" {...form.register("oid")} />
						<input
							type="hidden"
							{...form.register("00N3X00000GmwAR")}
						/>
						<input
							type="hidden"
							{...form.register("lead_source")}
						/>
						<input type="hidden" {...form.register("company")} />
						<input
							type="hidden"
							{...form.register("00N3X00000Goi09")}
						/>
						<input
							type="hidden"
							{...form.register("00N3X00000LsGqJ")}
						/>
						<input
							type="hidden"
							{...form.register("00N3X00000LsGqT")}
						/>
						<input type="hidden" {...form.register("retURL")} />
						<input type="hidden" {...form.register("encoding")} />
						<input type="hidden" {...form.register("Submit")} />
						<input type="hidden" {...form.register("phone")} />
						<FormField
							control={form.control}
							name="subject"
							render={({ field }) => (
								<FormItem className="w-full">
									<FormLabel htmlFor="subject">
										<T tkey="support.labels.subject" />
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
							name="00N3X00000GoT3y"
							render={({ field }) => (
								<FormItem className="w-full">
									<FormLabel htmlFor="lead_notes">
										<T tkey="support.labels.message" />
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
							<Button type="submit" className="w-full md:w-1/5" name="Submit">
								<T tkey="support.button" />
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</>
	);
}
