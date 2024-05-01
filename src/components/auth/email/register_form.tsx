"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { ErrorMessage } from "@/components/ui/msg/error_msg";
import { SuccessMessage } from "@/components/ui/msg/success_msg";
import { FormBg } from "@/components/ui/form_bg";
import { LeftSideLogin } from "@/components/login/left_side_login";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import T from "@/components/translations/translation";
import { useTranslation } from "react-i18next";

const formSchema = z.object({
	email: z.string().email(),
	password: z.string(),
	confirmPassword: z.string(),
	code: z.string(),
});

export default function RegisterForm() {
	const { t } = useTranslation();
	const [errorMessage, setErrorMessage] = useState<string | undefined>(
		undefined
	);
	const [successMessage, setSuccessMessage] = useState("");

	// Control password visibility
	const [passwordType, setPasswordType] = useState("password");

	const togglePassword = () => {
		setPasswordType((prevType) =>
			prevType === "password" ? "text" : "password"
		);
	};

	const [confirmPasswordType, setConfirmPasswordType] = useState("password");

	const toggleConfirmPassword = () => {
		setConfirmPasswordType(
			confirmPasswordType === "password" ? "text" : "password"
		);
	};

	const router = useRouter();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
			confirmPassword: "",
			code: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const response = await fetch("/api/registration-code", {
			method: "GET",
		});

		if (!response.ok) {
			console.error("Error:", response.statusText);
			return;
		}

		const data = await response.json();
		if (values.code !== data.code) {
			setErrorMessage("Invalid registration code.");
			return;
		}

		signUp(values);
	}

	async function signUp(values: z.infer<typeof formSchema>) {
		const email = values.email;
		const password = values.password;
		const confirmPassword = values.confirmPassword;

		if (password !== confirmPassword) {
			setErrorMessage("Passwords do not match.");
			return;
		}

		if (password.length < 6) {
			setErrorMessage("Password should be at least 6 characters.");
			return;
		}

		const supabase = createClientComponentClient();

		const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
		const url = `${baseUrl}/my-info`;

		let { data, error } = await supabase.auth.signUp({
			email: email,
			password: password,
			options: {
				emailRedirectTo: url,
			},
		});

		if (error) {
			setErrorMessage("Error signing up. Please try again.");
			console.log("Here is the error:", error);
		} else {
			setSuccessMessage("Registration successful!");
			console.log(data);
			setTimeout(() => {
				return router.push("/login");
			}, 2000);
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
			{successMessage && (
				<SuccessMessage
					successMessage={successMessage}
					setSuccessMessage={setSuccessMessage}
				/>
			)}
			<FormBg />
			<div className="relative md:absolute top-0 left-0 right-0 flex md:flex-row flex-col items-center justify-center md:h-screen">
				<div className="md:rounded-2xl w-full md:w-4/5 flex flex-col md:flex-row md:drop-shadow-xl md:overflow-hidden hover:drop-shadow-2xl transition-all duration-200 ease-linear">
					<LeftSideLogin />
					<div className="bg-mid_gray w-full md:w-1/2 min-content flex flex-column items-center justify-center py-10 md:py-10">
						<div className="rounded-lg font-glory w-4/5 lg:w-3/5">
							<h2 className="text-4xl pb-4" id="welcome">
								<T tkey="registration.title" />
							</h2>
							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
									className="space-y-6"
								>
									<FormField
										control={form.control}
										name="email"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													<T tkey="registration.form.labels.email" />
												</FormLabel>
												<FormControl>
													<Input
														placeholder={t(
															"registration.form.placeholders.email"
														)}
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<div>
										<FormField
											control={form.control}
											name="password"
											render={({ field }) => (
												<FormItem>
													<FormLabel htmlFor="password">
														<T tkey="registration.form.labels.password" />
													</FormLabel>
													<FormControl>
														<div className="relative">
															<Input
																id="password"
																type={
																	passwordType
																}
																placeholder={t(
																	"registration.form.placeholders.password"
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
																tabIndex={-1}
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
									</div>
									<div>
										<FormField
											control={form.control}
											name="confirmPassword"
											render={({ field }) => (
												<FormItem>
													<FormLabel htmlFor="confirmPassword">
														<T tkey="registration.form.labels.confirm" />
													</FormLabel>
													<FormControl>
														<div className="relative">
															<Input
																id="confirmPassword"
																type={
																	confirmPasswordType
																}
																placeholder={t(
																	"registration.form.placeholders.confirm"
																)}
																{...field}
															/>
															<button
																tabIndex={-1}
																id="toggleConfirmPassword"
																type="button"
																className="absolute inset-y-0 right-0 px-4 py-2 text-dark_blue focus:outline-none"
																onClick={
																	toggleConfirmPassword
																}
															>
																<FontAwesomeIcon
																	id="eyeIcon"
																	icon={
																		confirmPasswordType ===
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
									</div>
									<FormField
										control={form.control}
										name="code"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													<T tkey="registration.form.labels.code" />
												</FormLabel>
												<FormControl>
													<Input
														placeholder={t(
															"registration.form.placeholders.code"
														)}
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<div className="flex justify-center items-center">
										<Button type="submit" variant="login">
											<T tkey="registration.form.buttons.signup" />
										</Button>
									</div>
									<div className="flex justify-center items-center">
										<Link href="/login" className="w-full">
											<Button variant="signup">
												<T tkey="registration.form.buttons.login" />
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
