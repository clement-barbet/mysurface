"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { LeftSideLogin } from "@/components/login/left_side_login";
import { FormBg } from "@/components/ui/form_bg";
import { ErrorMessage } from "@/components/ui/msg/error_msg";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import T from "@/components/translations/translation";
import { useTranslation } from "react-i18next";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const formSchema = z.object({
	email: z.string().email(),
	password: z.string(),
});

export default function LoginForm() {
	const { t } = useTranslation();
	const [errorMessage, setErrorMessage] = useState<string | undefined>(
		undefined
	);

	// Control password visibility
	const [passwordType, setPasswordType] = useState("password");

	const togglePassword = () => {
		setPasswordType((prevType) =>
			prevType === "password" ? "text" : "password"
		);
	};

	const router = useRouter();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		signIn(values);
	}

	async function signIn(values: z.infer<typeof formSchema>) {
		const email = values.email;
		const password = values.password;

		const supabase = createClientComponentClient();
		const response = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (response.error) {
			console.log(response);
			setErrorMessage(response.error?.message);
			return;
		} else {
			console.log(response);
			return router.push("/home");
		}
	}

	return (
		<div>
			{errorMessage && (
				<ErrorMessage
					errorMessage={errorMessage}
					setErrorMessage={setErrorMessage}
				/>
			)}
			<FormBg />
			<div className="relative md:absolute top-0 left-0 right-0 flex md:flex-row flex-col items-center justify-center md:h-screen">
				<div className="md:rounded-2xl w-full md:w-4/5 flex flex-col md:flex-row md:drop-shadow-xl md:overflow-hidden hover:drop-shadow-2xl transition-all duration-200 ease-linear">
					<LeftSideLogin />
					<div className="bg-mid_gray w-full md:w-1/2 min-content flex flex-column items-center justify-center py-10 md:py-10">
						<div className="rounded-lg font-glory w-4/5 lg:w-3/5">
							<h2 className="text-4xl pb-4" id="welcome">
								<T tkey="login.title" />
							</h2>
							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
									className="space-y-8"
								>
									<FormField
										control={form.control}
										name="email"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													<T tkey="login.form.labels.email" />
												</FormLabel>
												<FormControl>
													<Input
														placeholder={t(
															"login.form.placeholders.email"
														)}
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<div className="flex flex-col space-y-2">
										<FormField
											control={form.control}
											name="password"
											render={({ field }) => (
												<FormItem>
													<FormLabel htmlFor="password">
														<T tkey="login.form.labels.password" />
													</FormLabel>
													<FormControl>
														<div className="relative">
															<Input
																id="password"
																type={
																	passwordType
																}
																placeholder={t(
																	"login.form.placeholders.password"
																)}
																{...field}
															/>
															<button
																id="togglePassword"
																type="button"
																className="absolute inset-y-0 right-0 px-4 py-2 text-dark_blue focus:outline-none"
																onClick={
																	togglePassword
																}
															>
																<FontAwesomeIcon
																	id="eyeIcon"
																	icon={
																		passwordType ===
																		"password"
																			? faEye
																			: faEyeSlash
																	}
																	className="flex items-center justify-center w-6"
																/>
															</button>
														</div>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<div className="flex justify-end items-center mt-0 pe-1">
											<Link
												href="/forgot-password"
												className="text-sm text-blue-700 border-b-2 border-transparent hover:border-b-2 hover:border-blue-700 transition-all duration-200 ease-linear"
											>
												<T tkey="login.form.buttons.forgot" />
											</Link>
										</div>
									</div>
									<div className=" flex justify-center items-center">
										<Button type="submit" variant="login">
											<T tkey="login.form.buttons.login" />
										</Button>
									</div>
									<div className=" flex justify-center items-center">
										<Link
											href="/sign-up"
											className="w-full"
										>
											<Button variant="signup">
												<T tkey="login.form.buttons.signup" />
											</Button>
										</Link>
									</div>
								</form>
							</Form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
