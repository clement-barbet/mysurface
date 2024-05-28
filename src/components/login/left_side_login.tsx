import React from "react";
import T from "@/components/translations/translation";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { fetchLanguages } from "@/db/languages/fetchLanguages";
import Link from "next/link";

const LeftSideLogin = () => {
	const { i18n } = useTranslation();
	const [languages, setLanguages] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const fetchedLanguages = await fetchLanguages();
				setLanguages(fetchedLanguages);
			} catch (error) {
				console.error("Error loading results", error);
			}
		};

		fetchData();
	}, []);

	return (
		<div className="bg-mid_blue w-full md:w-1/2 min-content flex flex-col items-center justify-center md:pt-10 pb-10 pt-5 gap-y-10 md:gap-y-0">
			<div className="flex flex-row gap-x-2 justify-center mt-auto text-light_gray md:order-2 md:mt-4">
				{languages.map((language) => (
					<p
						key={language.id}
						onClick={() => {
							i18n.changeLanguage(language.code);
							localStorage.setItem("i18nextLng", language.code);
						}}
						className="hover:font-semibold cursor-pointer transition-all duration-200 ease-linear mx-2"
					>
						{language.name}
					</p>
				))}
			</div>
			<div className="rounded-lg w-4/5 md:order-1 md:mb-4 ">
				<img
					id="logo"
					src="/logo/surf-app-logo.svg"
					alt="mysurface_logo"
					className="mx-auto mb-4 w-44 h-44"
				/>
				<h1 className="text-6xl text-light_gray font-fjalla text-center mb-5">
					MySurface
				</h1>
				<hr className="w-3/4 lg:w-2/3 mx-auto mb-5 border-2 border-light_gray" />
				<p className="text-light_gray font-glory text-center font-light text-xl w-full mx-auto">
					<T tkey="login.slogan.part1" />
					<br />
					<T tkey="login.slogan.part2" />
				</p>
			</div>
			<p className="md:mt-6 text-sm text-center text-gray-400 text-opacity-90 md:order-3">
				MySurface&reg; v2.1
			</p>
			<p className="md:mt-2 text-sm text-center text-accent_color text-opacity-90 hover:text-accent_light md:order-4 transition-all duration-200 ease-linear">
				<Link href="https://mysurface.myaudit.org">
					mysurface.myaudit.org
				</Link>
			</p>
		</div>
	);
};

export { LeftSideLogin };
