"use client";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faBorderAll,
	faUserGroup,
	faMagnifyingGlassChart,
	faArrowLeft,
	faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";

export default function DashboardNavbar() {
	const pathname = usePathname();
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	return (
		<nav
			className={clsx(
				"absolute md:relative z-50 flex flex-col items-start w-10 h-screen bg-dark_blue bg-opacity-95 md:bg-opacity-100 text-light_gray transition-all duration-500 ease-in-out md:w-64 md:rounded-none",
				{
					"w-64": isMenuOpen,
					"rounded-r-xl": !isMenuOpen,
				}
			)}
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
				<FontAwesomeIcon
					icon={isMenuOpen ? faArrowLeft : faArrowRight}
				/>
			</div>
			<div
				className={clsx(
					"flex items-center justify-center w-full h-20 bg-mid_blue gap-x-3 drop-shadow-sm rounded-bl-2xl mb-5",
					{ hidden: !isMenuOpen, "md:flex": true }
				)}
			>
				<img src="/logo.svg" alt="mysurface_logo" className="w-10" />
				<h1 className="text-3xl font-fjalla">MySurface</h1>
			</div>
			<ul
				className={clsx("flex flex-col w-full", {
					hidden: !isMenuOpen,
					"md:flex": true,
				})}
			>
				<li
					className={clsx("py-4 px-4 w-full tracking-wider", {
						"border-l-4 border-light_gray":
							pathname === "/dashboard",
					})}
				>
					<Link
						href="/dashboard/"
						className="hover:font-bold transition-all duration-200 ease-linear"
					>
						<FontAwesomeIcon
							id="faBorderAll"
							icon={faBorderAll}
							className="pe-2"
						/>
						DASHBOARD
					</Link>
				</li>
				<li
					className={clsx("py-4 px-4 tracking-wider", {
						"border-l-4 border-light_gray":
							pathname === "/dashboard/participants",
					})}
				>
					<Link
						href="/dashboard/participants"
						className="hover:font-bold transition-all duration-200 ease-linear"
					>
						<FontAwesomeIcon
							id="faUserGroup"
							icon={faUserGroup}
							className="pe-2"
						/>
						PARTICIPANTS
					</Link>
				</li>
				<li
					className={clsx("py-4 px-4 tracking-wider", {
						"border-l-4 border-light_gray":
							pathname === "/dashboard/results",
					})}
				>
					<Link
						href="/dashboard/results"
						className="hover:font-bold transition-all duration-200 ease-linear"
					>
						<FontAwesomeIcon
							id="faMagnifyingGlassChart"
							icon={faMagnifyingGlassChart}
							className="pe-2"
						/>
						RESULTS
					</Link>
				</li>
			</ul>
		</nav>
	);
}
