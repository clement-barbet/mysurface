"use client";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdDashboard } from "react-icons/md";
import { IoPeople } from "react-icons/io5";
import { PiGraph } from "react-icons/pi";
import { BsArrowRightCircleFill, BsArrowLeftCircleFill } from "react-icons/bs";
import React, { useState } from "react";

export default function DashboardNavbar() {
	const pathname = usePathname();
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	return (
		<nav
			className={clsx(
				"fixed flex flex-col items-start w-10 h-screen bg-dark_blue bg-opacity-95 md:bg-opacity-100 text-light_gray transition-all duration-500 ease-in-out md:w-48 md:rounded-none",
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
			<Link href="/home" className="w-full">
				<div
					className={clsx(
						"flex items-center justify-center w-full h-12 bg-mid_blue gap-x-3 drop-shadow-sm rounded-bl-2xl mb-5",
						{ hidden: !isMenuOpen, "md:flex": true }
					)}
				>
					<img src="/logo.svg" alt="mysurface_logo" className="w-8" />
					<h1 className="text-xl font-fjalla">MySurface</h1>
				</div>
			</Link>
			<ul
				className={clsx("flex flex-col w-full", {
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
						href="/home/dashboard/"
						className="hover:font-bold transition-all duration-200 ease-linear flex items-center gap-x-2"
					>
						<MdDashboard className="h-6 w-6" />
						DASHBOARD
					</Link>
				</li>
				<li
					className={clsx("py-4 px-4 tracking-wider", {
						"border-l-4 border-light_gray":
							pathname === "/home/participants",
					})}
				>
					<Link
						href="/home/participants"
						className="hover:font-bold transition-all duration-200 ease-linear flex items-center gap-x-2"
					>
						<IoPeople className="h-6 w-6" />
						PARTICIPANTS
					</Link>
				</li>
				<li
					className={clsx("py-4 px-4 tracking-wider", {
						"border-l-4 border-light_gray":
							pathname === "/home/results",
					})}
				>
					<Link
						href="/home/results"
						className="hover:font-bold transition-all duration-200 ease-linear flex items-center gap-x-2"
					>
						<PiGraph className="h-6 w-6" />
						RESULTS
					</Link>
				</li>
			</ul>
		</nav>
	);
}
