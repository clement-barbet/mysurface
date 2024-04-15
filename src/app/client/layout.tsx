"use client";
import DashboardNavbar from "@/components/home/dashboard_navbar_client";
import TopBar from "@/components/home/topbar_client";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";

export default function ClientLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const pathname = usePathname();
	const isResultsIdPage = /^\/client\/results\/[^\/]+$/.test(pathname);

	const [isSmallScreen, setIsSmallScreen] = useState(false);

	useEffect(() => {
		const checkScreenSize = () => {
			setIsSmallScreen(window.innerWidth < 768);
		};

		checkScreenSize();
		window.addEventListener("resize", checkScreenSize);

		return () => window.removeEventListener("resize", checkScreenSize);
	}, []);

	return (
		<div className="flex relative">
			{!(isSmallScreen && isResultsIdPage) && (
				<div
					style={{ flex: "0 0 auto" }}
					className="md:relative md:w-48"
				>
					<DashboardNavbar />
				</div>
			)}
			<div className="flex flex-grow flex-col w-full md:w-auto h-full">
				{!(isSmallScreen && isResultsIdPage) && (
					<div className="h-10 md:relative">
						<TopBar />
					</div>
				)}
				<div
					style={{ flex: "1 0 auto" }}
					className="relative py-2 px-2"
				>
					{children}
				</div>
			</div>
		</div>
	);
}
