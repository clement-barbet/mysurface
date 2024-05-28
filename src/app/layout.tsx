import type { Metadata } from "next";
import { Glory } from "next/font/google";
import "./globals.css";
import Head from "next/head";

const glory = Glory({ subsets: ["latin"] });
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const metadata: Metadata = {
	title: "MySurface®",
	description: "App to discover the most influential people or products.",
	metadataBase: new URL(baseUrl),
	openGraph: {
		type: "website",
		url: new URL(baseUrl),
		title: "MySurface®",
		description: "App to discover the most influential people or products.",
		images: [
			{
				url: new URL("/open_graph.png", baseUrl).toString(),
				width: 2252,
				height: 1279,
				alt: "MySurface_App",
			},
		],
	},
	keywords: [
		"MySurface",
		"Influence",
		"Interaction",
		"People",
		"Products",
		"Discover",
		"App",
		"Leaders",
		"Teams",
		"Companies",
		"Schools",
		"Cities",
	],
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
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
			</Head>
			<body
				className={`${glory.className} bg-dark_gray dark:bg-dark_blue dark:bg-opacity-80 transition-colors duration-1000 linear`}
			>
				{children}
			</body>
		</html>
	);
}
