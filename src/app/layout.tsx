import type { Metadata } from "next";
import { Glory } from "next/font/google";
import "./globals.css";

const glory = Glory({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "MySurface®",
	description: "App to discover the most influential people or products.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
	return (
		<html lang="en">
			<head>
				<meta property="og:url" content="https://app.myaudit.org" />
				<meta property="og:type" content="website" />
				<meta
					property="og:image"
					content="https://app.myaudit.org/android-chrome-192x192.png"
				/>
				<meta
					property="og:logo"
					content="https://app.myaudit.org/android-chrome-192x192.png"
				/>
				<meta property="og:image:width" content="192" />
				<meta property="og:image:height" content="192" />
				<meta property="og:image:type" content="image/png" />
				<meta property="og:image:alt" content="MySurface_Logo" />
				<meta property="og:title" content="MySurface®" />
				<meta
					property="og:description"
					content="App to discover the most influential people or products."
				/>
				<meta property="og:site_name" content="MySurface®" />
				<link
					rel="apple-touch-icon"
					sizes="180x180"
					href="/apple-touch-icon.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="32x32"
					href="/favicon-32x32.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="16x16"
					href="/favicon-16x16.png"
				/>
				<link rel="manifest" href="/site.webmanifest" />
				<link
					rel="mask-icon"
					href="/safari-pinned-tab.svg"
					color="#5bbad5"
				/>
				<meta name="msapplication-TileColor" content="#da532c" />
				<meta name="theme-color" content="#ffffff" />
			</head>
			<body
				className={`${glory.className} bg-dark_gray dark:bg-dark_blue dark:bg-opacity-80 transition-colors duration-1000 linear`}
			>
				{children}
			</body>
		</html>
	);
}
