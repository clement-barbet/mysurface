"use client";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdDashboard } from "react-icons/md";
import { IoPeople, IoLanguageOutline } from "react-icons/io5";
import { PiGraph } from "react-icons/pi";
import { AiOutlineQuestion } from "react-icons/ai";
import { BsArrowRightCircleFill, BsArrowLeftCircleFill } from "react-icons/bs";
import { BiTrendingUp } from "react-icons/bi";
import { TbVectorTriangle } from "react-icons/tb";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import T from "@/components/translations/translation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { PiSuitcaseSimple } from "react-icons/pi";

export default function DashboardNavbar() {
	const pathname = usePathname();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
	const { i18n } = useTranslation();
	const supabase = createClientComponentClient();
	const [languages, setLanguages] = useState([]);
	const [userRole, setUserRole] = useState("");

	useEffect(() => {
		const fetchLanguages = async () => {
			const { data, error } = await supabase
				.from("languages")
				.select("*");

			if (error) {
				console.error("Error fetching languages:", error);
			} else {
				setLanguages(data);
			}
		};

		fetchLanguages();
	}, []);

	useEffect(() => {
		const fetchSettings = async () => {
			const user = await supabase.auth.getUser();
			const { data, error } = await supabase
				.from("roles")
				.select("role")
				.eq("user_id", user.data.user.id)
				.single();

			if (error) {
				console.error("Error fetching settings:", error);
			} else {
				setUserRole(data.role);
			}
		};

		fetchSettings();
	}, []);

	const handleLinkClick = () => {
		setIsMenuOpen(false);
	};

	return (
		<nav
			className={clsx(
				"fixed flex flex-col items-start w-10 h-screen bg-dark_blue bg-opacity-95 md:bg-opacity-100 text-light_gray transition-all duration-500 ease-in-out md:w-48 md:rounded-none pb-10 md:pb-5",
				{
					"w-48": isMenuOpen,
					"rounded-r-xl": !isMenuOpen,
				}
			)}
			style={{ zIndex: 150 }}
		>
			<div
				className={clsx(
					"md:hidden cursor-pointer absolute top-1/2 transform -translate-y-1/2 transition-all duration-200",
					{
						"left-1/2 -translate-x-1/2": !isMenuOpen,
						"right-4": isMenuOpen,
					}
				)}
				onClick={() => setIsMenuOpen(!isMenuOpen)}
			>
				{isMenuOpen ? (
					<BsArrowLeftCircleFill className="h-6 w-6" />
				) : (
					<BsArrowRightCircleFill className="h-6 w-6" />
				)}
			</div>
			<Link onClick={handleLinkClick} href="/home" className="w-full">
				<div
					className={clsx(
						"flex items-center justify-center w-full h-10 bg-mid_blue gap-x-3 drop-shadow-sm rounded-bl-2xl mb-5",
						{ hidden: !isMenuOpen, "md:flex": true }
					)}
				>
					<img src="/logo.svg" alt="mysurface_logo" className="w-8" />
					<h1 className="text-xl font-fjalla">MySurface</h1>
				</div>
			</Link>
			<ul
				className={clsx("flex flex-col h-full w-full", {
					hidden: !isMenuOpen,
					"md:flex": true,
				})}
			>
				<li
					className={clsx("py-4 px-4 w-full tracking-wider", {
						"border-l-4 border-light_gray":
							pathname === "/home/dashboard",
					})}
				>
					<Link
						onClick={handleLinkClick}
						href="/home/dashboard"
						className="hover:font-bold transition-all duration-200 ease-linear flex items-center gap-x-2 uppercase"
					>
						<MdDashboard className="h-6 w-6" />
						<T tkey="navbar.dashboard" />
					</Link>
				</li>
				<li
					className={clsx("py-4 px-4 tracking-wider", {
						"border-l-4 border-light_gray":
							pathname === "/home/participants",
					})}
				>
					<Link
						onClick={handleLinkClick}
						href="/home/participants"
						className="hover:font-bold transition-all duration-200 ease-linear flex items-center gap-x-2 uppercase"
					>
						<IoPeople className="h-6 w-6" />
						<T tkey="navbar.participants" />
					</Link>
				</li>
				<li
					className={clsx("py-4 px-4 tracking-wider", {
						"border-l-4 border-light_gray":
							pathname === "/home/results" ||
							/^\/home\/results(\/\d+)?$/.test(pathname),
					})}
				>
					<Link
						onClick={handleLinkClick}
						href="/home/results"
						className="hover:font-bold transition-all duration-200 ease-linear flex items-center gap-x-2 uppercase"
					>
						<PiGraph className="h-6 w-6" />
						<T tkey="navbar.results" />
					</Link>
				</li>
				<li
					className={clsx("py-4 px-4 tracking-wider", {
						"border-l-4 border-light_gray":
							pathname === "/home/faq",
					})}
				>
					<Link
						onClick={handleLinkClick}
						href="/home/faq"
						className="hover:font-bold transition-all duration-200 ease-linear flex items-center gap-x-2 uppercase"
					>
						<AiOutlineQuestion className="h-6 w-6" />
						<T tkey="navbar.faq" />
					</Link>
				</li>
				{userRole === "superadmin" ? (
					<>
						<hr className="w-full border-light_gray border-dashed" />
						<li
							className={clsx("py-4 px-4 tracking-wider", {
								"border-l-4 border-light_gray":
									pathname === "/home/results-admin" ||
									/^\/home\/results-admin(\/\d+)?$/.test(
										pathname
									),
							})}
						>
							<Link
								onClick={handleLinkClick}
								href="/home/results-admin"
								className="hover:font-bold transition-all duration-200 ease-linear flex items-center gap-x-2 uppercase"
							>
								<PiGraph className="h-6 w-6" />
								<T tkey="navbar.results-admin" />
							</Link>
						</li>
						<li
							className={clsx("py-4 px-4 tracking-wider", {
								"border-l-4 border-light_gray":
									pathname === "/home/customers-admin",
							})}
						>
							<Link
								onClick={handleLinkClick}
								href="/home/customers-admin"
								className="hover:font-bold transition-all duration-200 ease-linear flex items-center gap-x-2 uppercase"
							>
								<PiSuitcaseSimple className="h-6 w-6" />
								<T tkey="navbar.customers" />
							</Link>
						</li>
						<li
							className={clsx("py-4 px-4 tracking-wider", {
								"border-l-4 border-light_gray":
									pathname === "/home/models",
							})}
						>
							<Link
								onClick={handleLinkClick}
								href="/home/models"
								className="hover:font-bold transition-all duration-200 ease-linear flex items-center gap-x-2 uppercase"
							>
								<TbVectorTriangle className="h-6 w-6" />
								<T tkey="navbar.models" />
							</Link>
						</li>
						<li
							className={clsx("py-4 px-4 tracking-wider", {
								"border-l-4 border-light_gray":
									pathname === "/home/patterns",
							})}
						>
							<Link
								onClick={handleLinkClick}
								href="/home/patterns"
								className="hover:font-bold transition-all duration-200 ease-linear flex items-center gap-x-2 uppercase"
							>
								<BiTrendingUp className="h-6 w-6" />
								<T tkey="navbar.patterns" />
							</Link>
						</li>
					</>
				) : null}
				<li
					onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
					className="py-4 px-4 tracking-wider relative mt-auto"
				>
					{isLanguageMenuOpen && (
						<ul className="mb-2 ms-8">
							{languages.map((language) => (
								<li
									key={language.id}
									onClick={() => {
										const changeLanguage = async () => {
											i18n.changeLanguage(language.code);
											localStorage.setItem(
												"i18nextLng",
												language.code
											);
											handleLinkClick();

											const user =
												await supabase.auth.getUser();

											const { error } = await supabase
												.from("app_settings")
												.update({
													language_id: language.id,
												})
												.eq(
													"user_id",
													user.data.user.id
												);

											if (error) {
												console.error(
													"Error updating language:",
													error
												);
											}
										};

										changeLanguage();
									}}
									className="hover:font-semibold cursor-pointer transition-all duration-200 ease-linear"
								>
									{language.name}
								</li>
							))}
						</ul>
					)}
					<span className="hover:font-bold hover:cursor-pointer transition-all duration-200 ease-linear flex items-center gap-x-2 uppercase">
						<IoLanguageOutline className="h-6 w-6" />
						<T tkey="navbar.language" />
					</span>
				</li>
			</ul>
		</nav>
	);
}
