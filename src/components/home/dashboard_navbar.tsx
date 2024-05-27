"use client";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoLanguageOutline } from "react-icons/io5";
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
import { MdOutlineSettingsBackupRestore } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { AiOutlineMessage } from "react-icons/ai";
import { BiSupport } from "react-icons/bi";
import { fetchLanguages } from "@/db/languages/fetchLanguages";
import { fetchRole } from "@/db/roles/fetchRoleByUserId";
import { fetchBilling } from "@/db/billings/fetchBillingByUserId";
import { GoHome } from "react-icons/go";
import { MdOutlineDashboard } from "react-icons/md";
import { BsPeople } from "react-icons/bs";

export default function DashboardNavbar({ user }) {
	const pathname = usePathname();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
	const { i18n } = useTranslation();
	const supabase = createClientComponentClient();
	const [languages, setLanguages] = useState([]);
	const [userRole, setUserRole] = useState("");
	const [subscriptionStatus, setSubscriptionStatus] = useState("");

	useEffect(() => {
		const fetchData = async () => {
			try {
				const fetchedLanguages = await fetchLanguages();
				setLanguages(fetchedLanguages);
				const fetchedRole = await fetchRole(user.id);
				setUserRole(fetchedRole.role);
				const fetchedBilling = await fetchBilling(user.id);
				setSubscriptionStatus(fetchedBilling.status);
			} catch (error) {
				console.error("Error fetching data", error);
			}
		};
		fetchData();
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
						"flex items-center justify-start ps-4 w-full h-10 bg-mid_blue gap-x-3 drop-shadow-sm rounded-bl-2xl",
						{ hidden: !isMenuOpen, "md:flex": true }
					)}
				>
					<img
						id="logo"
						src="/logo/surf-app-logo.svg"
						alt="mysurface_logo"
						className="w-7 h-7"
					/>
					<h1 className="text-xl font-fjalla">MySurface</h1>
				</div>
			</Link>
			<ul
				id="sidebar-menu"
				className={clsx(
					"flex flex-col h-full w-full text-sm mt-4 overflow-auto",
					{
						hidden: !isMenuOpen,
						"md:flex": true,
					}
				)}
			>
				<li
					className={clsx("py-2 px-4 tracking-wider", {
						"border-l-4 border-light_gray": pathname === "/home",
					})}
				>
					<Link
						onClick={handleLinkClick}
						href="/home"
						className="hover:font-bold transition-all duration-200 ease-linear flex items-center gap-x-2 uppercase"
					>
						<GoHome className="h-6 w-6" />
						<T tkey="navbar.home" />
					</Link>
				</li>
				{subscriptionStatus === "active" ? (
					<>
						<li
							className={clsx("py-2 px-4 w-full tracking-wider", {
								"border-l-4 border-light_gray":
									pathname === "/home/dashboard",
							})}
						>
							<Link
								onClick={handleLinkClick}
								href="/home/dashboard"
								className="hover:font-bold transition-all duration-200 ease-linear flex items-center gap-x-2 uppercase"
							>
								<MdOutlineDashboard className="h-6 w-6" />
								<T tkey="navbar.dashboard" />
							</Link>
						</li>
						<li
							className={clsx("py-2 px-4 tracking-wider", {
								"border-l-4 border-light_gray":
									pathname === "/home/participants",
							})}
						>
							<Link
								onClick={handleLinkClick}
								href="/home/participants"
								className="hover:font-bold transition-all duration-200 ease-linear flex items-center gap-x-2 uppercase"
							>
								<BsPeople className="h-6 w-6" />
								<T tkey="navbar.participants" />
							</Link>
						</li>
						<li
							className={clsx("py-2 px-4 tracking-wider", {
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
					</>
				) : null}
				<li
					className={clsx("py-2 px-4 tracking-wider", {
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
					className={clsx("py-2 px-4 tracking-wider", {
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
				<li
					className={clsx("py-2 px-4 tracking-wider", {
						"border-l-4 border-light_gray":
							pathname === "/home/results-examples" ||
							/^\/home\/results-examples(\/\d+)?$/.test(pathname),
					})}
				>
					<Link
						onClick={handleLinkClick}
						href="/home/results-examples"
						className="hover:font-bold transition-all duration-200 ease-linear flex items-center gap-x-2 uppercase"
					>
						<PiGraph className="h-6 w-6" />
						<T tkey="navbar.results-examples" />
					</Link>
				</li>
				{subscriptionStatus !== "active" ? (
					<li>
						<Link
							className="w-full inline-block text-sm mt-2 text-center text-gray-400 text-opacity-90 hover:text-gray-300 hover:font-semibold transition-all duration-200 ease-linear"
							href="/home/license"
						>
							<T tkey="navbar.purchase" />
						</Link>
					</li>
				) : null}
				{userRole === "superadmin" ? (
					<>
						<hr className="w-full my-4 border-light_gray border border-opacity-50" />
						<li
							className={clsx("py-2 px-4 tracking-wider", {
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
							className={clsx("py-2 ps-4 tracking-wider", {
								"border-l-4 border-light_gray":
									pathname === "/home/participants-admin",
							})}
						>
							<Link
								onClick={handleLinkClick}
								href="/home/participants-admin"
								className="hover:font-bold transition-all duration-200 ease-linear flex items-center gap-x-2 uppercase"
							>
								<BsPeople className="h-6 w-6" />
								<T tkey="navbar.participants-admin" />
							</Link>
						</li>
						<li
							className={clsx("py-2 px-4 tracking-wider", {
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
							className={clsx("py-2 px-4 tracking-wider", {
								"border-l-4 border-light_gray":
									pathname === "/home/backup" ||
									/^\/home\/backup(\/\d+)?$/.test(pathname),
							})}
						>
							<Link
								onClick={handleLinkClick}
								href="/home/backup"
								className="hover:font-bold transition-all duration-200 ease-linear flex items-center gap-x-2 uppercase"
							>
								<MdOutlineSettingsBackupRestore className="h-6 w-6" />
								<T tkey="navbar.backup" />
							</Link>
						</li>
						<li
							className={clsx("py-2 px-4 tracking-wider", {
								"border-l-4 border-light_gray":
									pathname === "/home/modeling",
							})}
						>
							<Link
								onClick={handleLinkClick}
								href="/home/modeling"
								className="hover:font-bold transition-all duration-200 ease-linear flex items-center gap-x-2 uppercase"
							>
								<FiEdit className="h-6 w-6" />
								<T tkey="navbar.modeling" />
							</Link>
						</li>
						<li
							className={clsx("py-2 px-4 tracking-wider", {
								"border-l-4 border-light_gray":
									pathname === "/home/news",
							})}
						>
							<Link
								onClick={handleLinkClick}
								href="/home/news"
								className="hover:font-bold transition-all duration-200 ease-linear flex items-center gap-x-2 uppercase"
							>
								<AiOutlineMessage className="h-6 w-6" />
								<T tkey="navbar.news" />
							</Link>
						</li>
					</>
				) : null}
				<div className="relative mt-auto">
					<hr className="w-full my-4 border-light_gray border border-opacity-50" />
					<li
						onClick={() =>
							setIsLanguageMenuOpen(!isLanguageMenuOpen)
						}
						className="py-2 px-4 tracking-wider"
					>
						{isLanguageMenuOpen && (
							<ul className="mb-2 ms-8">
								{languages.map((language) => (
									<li
										key={language.id}
										onClick={() => {
											const changeLanguage = async () => {
												i18n.changeLanguage(
													language.code
												);
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
														language_id:
															language.id,
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
					<li
						className={clsx("py-2 px-4 tracking-wider", {
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
					<li
						className={clsx("py-2 px-4 tracking-wider", {
							"border-l-4 border-light_gray":
								pathname === "/home/contact-support",
						})}
					>
						<Link
							onClick={handleLinkClick}
							href="/home/contact-support"
							className="hover:font-bold transition-all duration-200 ease-linear flex items-center gap-x-2 uppercase"
						>
							<BiSupport className="h-6 w-6" />
							<T tkey="navbar.contact-support" />
						</Link>
					</li>
					<li className="text-sm mt-2 text-center text-gray-400 text-opacity-90">
						MySurface&reg; v2.1
					</li>
				</div>
			</ul>
		</nav>
	);
}
