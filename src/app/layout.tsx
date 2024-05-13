import type { Metadata } from "next";
import { Glory } from "next/font/google";
import "./globals.css";

const glory = Glory({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "MySurface",
	description: "Generated by create next app",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<link
					rel="icon"
					href="/logo_mysurface.svg"
				/>
			</head>
			<body
				className={`${glory.className} bg-dark_gray dark:bg-dark_blue dark:bg-opacity-80 transition-colors duration-1000 linear`}
			>
				{children}
			</body>
		</html>
	);
}
