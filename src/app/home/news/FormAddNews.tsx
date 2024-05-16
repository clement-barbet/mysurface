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
import T from "@/components/translations/translation";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
	language: z.string(),
	message: z.string(),
	type: z.string(),
	link: z.string(),
});

export default function FormAddNews() {
	const supabase = createClientComponentClient();
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [languages, setLanguages] = useState([]);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			language: "1",
			message: "",
			type: "news",
			link: "",
		},
	});

	const onSubmit = async (formData: z.infer<typeof formSchema>) => {
		const { language, message, type, link } = formData;
		console.log(formData);

		const { data, error } = await supabase
			.from("notifications")
			.insert([{ language_id: language, message, type, link }]);

		if (error) {
			console.error("Error inserting notification:", error);
			setErrorMessage("Error inserting notification.");
			return;
		}

		setSuccessMessage("Notification inserted successfully.");
		form.reset({ language: "1", message: "", type: "news", link: "" });
	};

	useEffect(() => {
		const fetchLanguages = async () => {
			const { data: languagesData, error: languagesDataError } =
				await supabase.from("languages").select("*");

			if (languagesDataError) {
				console.error("Error fetching languages:", languagesDataError);
				return;
			}

			setLanguages(languagesData);
		};

		fetchLanguages();
	}, []);

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
				<h2 className="mb-2 text-xl font-semibold border-l-4 border-mid_blue pl-2">
					<T tkey="Add news or notifications" />
				</h2>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-col gap-y-4"
					>
						<div className="w-full flex md:flex-row flex-col md:gap-x-4 md:gap-y-0 gap-y-4">
							<FormField
								control={form.control}
								name="language"
								render={({ field }) => (
									<FormItem>
										<FormLabel htmlFor="language">
											Language
										</FormLabel>
										<FormControl>
											<select
												{...field}
												name="language"
												id="language"
												className="dark:bg-mid_blue appearance-none box-border w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 bg-dark_gray cursor-pointer"
											>
												{languages &&
													languages.length > 0 &&
													languages.map(
														(language) => {
															return (
																<option
																	key={
																		language.id
																	}
																	value={
																		language.id
																	}
																>
																	{
																		language.name
																	}
																</option>
															);
														}
													)}
											</select>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="type"
								render={({ field }) => (
									<FormItem>
										<FormLabel htmlFor="type">
											Type
										</FormLabel>
										<FormControl>
											<select
												{...field}
												name="type"
												id="type"
												className="dark:bg-mid_blue appearance-none box-border w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 bg-dark_gray cursor-pointer"
											>
												<option value="news">
													News
												</option>
												<option value="update">
													Update
												</option>
											</select>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="w-full flex md:flex-row flex-col md:gap-x-4 md:gap-y-0 gap-y-4">
							<FormField
								control={form.control}
								name="message"
								render={({ field }) => (
									<FormItem className="w-full">
										<FormLabel htmlFor="message">
											Message
										</FormLabel>
										<FormControl>
											<Input
												id="message"
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
								name="link"
								render={({ field }) => (
									<FormItem className="w-full">
										<FormLabel htmlFor="link">
											Link
										</FormLabel>
										<FormControl>
											<Input
												id="link"
												className=" dark:bg-mid_blue w-full"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="w-full flex justify-end">
							<Button type="submit" className="w-full md:w-1/5">
								Upload
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</>
	);
}
