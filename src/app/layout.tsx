import type { Metadata } from "next";
import { Glory } from "next/font/google";
import "./globals.css";
import Head from "next/head";

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
			<Head>
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
				<meta property="og:title" content="MySurface®" />
				<meta
					property="og:description"
					content="App to discover the most influential people or products."
				/>
				<meta
					property="og:image"
					content={`${baseUrl}/android-chrome-512x512.png`}
				/>
				<meta
					property="og:image:secure_url"
					content="https://app.myaudit.org/android-chrome-512x512.png"
				/>
				<meta property="og:image:type" content="image/png" />
				<meta property="og:image:width" content="200" />
				<meta property="og:image:height" content="200" />
			</Head>
			<body
				className={`${glory.className} bg-dark_gray dark:bg-dark_blue dark:bg-opacity-80 transition-colors duration-1000 linear`}
			>
				{children}
			</body>
		</html>
	);
}
