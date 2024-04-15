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
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import T from "@/components/translations/translation";

export default function DashboardNavbar() {
	const pathname = usePathname();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
	const { i18n } = useTranslation();

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
			<Link onClick={handleLinkClick} href="/client" className="w-full">
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
				className={clsx("flex flex-col h-full", {
					hidden: !isMenuOpen,
					"md:flex": true,
				})}
			>
				<li
					className={clsx("py-4 px-4 w-full tracking-wider", {
						"border-l-4 border-light_gray":
							pathname === "/client/dashboard",
					})}
				>
					<Link
						onClick={handleLinkClick}
						href="/client/dashboard/"
						className="hover:font-bold transition-all duration-200 ease-linear flex items-center gap-x-2 uppercase"
					>
						<MdDashboard className="h-6 w-6" />
						<T tkey="navbar.dashboard" />
					</Link>
				</li>
				<li
					className={clsx("py-4 px-4 tracking-wider", {
						"border-l-4 border-light_gray":
							pathname === "/client/participants",
					})}
				>
					<Link
						onClick={handleLinkClick}
						href="/client/participants"
						className="hover:font-bold transition-all duration-200 ease-linear flex items-center gap-x-2 uppercase"
					>
						<IoPeople className="h-6 w-6" />
						<T tkey="navbar.participants" />
					</Link>
				</li>
				<li
					className={clsx("py-4 px-4 tracking-wider", {
						"border-l-4 border-light_gray":
							pathname === "/client/results",
					})}
				>
					<Link
						onClick={handleLinkClick}
						href="/client/results"
						className="hover:font-bold transition-all duration-200 ease-linear flex items-center gap-x-2 uppercase"
					>
						<PiGraph className="h-6 w-6" />
						<T tkey="navbar.results" />
					</Link>
				</li>
				<li
					className={clsx("py-4 px-4 tracking-wider", {
						"border-l-4 border-light_gray":
							pathname === "/client/models",
					})}
				>
					<Link
						onClick={handleLinkClick}
						href="/client/models"
						className="hover:font-bold transition-all duration-200 ease-linear flex items-center gap-x-2 uppercase"
					>
						<TbVectorTriangle className="h-6 w-6" />
						<T tkey="navbar.models" />
					</Link>
				</li>
				<li
					className={clsx("py-4 px-4 tracking-wider", {
						"border-l-4 border-light_gray":
							pathname === "/client/patterns",
					})}
				>
					<Link
						onClick={handleLinkClick}
						href="/client/patterns"
						className="hover:font-bold transition-all duration-200 ease-linear flex items-center gap-x-2 uppercase"
					>
						<BiTrendingUp className="h-6 w-6" />
						<T tkey="navbar.patterns" />
					</Link>
				</li>
				<li
					className={clsx("py-4 px-4 tracking-wider", {
						"border-l-4 border-light_gray":
							pathname === "/client/faq",
					})}
				>
					<Link
						onClick={handleLinkClick}
						href="/client/faq"
						className="hover:font-bold transition-all duration-200 ease-linear flex items-center gap-x-2 uppercase"
					>
						<AiOutlineQuestion className="h-6 w-6" />
						<T tkey="navbar.faq" />
					</Link>
				</li>
				<li
					onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
					className="py-4 px-4 tracking-wider relative mt-auto"
				>
					{isLanguageMenuOpen && (
						<ul className="mb-2 ms-8">
							<li
								onClick={() => {
									i18n.changeLanguage("cs");
									localStorage.setItem("i18nextLng", "cs");
									handleLinkClick();
								}}
								className="hover:font-semibold cursor-pointer transition-all duration-200 ease-linear"
							>
								Česky
							</li>
							<li
								onClick={() => {
									i18n.changeLanguage("en");
									localStorage.setItem("i18nextLng", "en");
									handleLinkClick();
								}}
								className="hover:font-semibold cursor-pointer transition-all duration-200 ease-linear"
							>
								English
							</li>
							<li
								onClick={() => {
									i18n.changeLanguage("es");
									localStorage.setItem("i18nextLng", "es");
									handleLinkClick();
								}}
								className="hover:font-semibold cursor-pointer transition-all duration-200 ease-linear"
							>
								Español
							</li>
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
