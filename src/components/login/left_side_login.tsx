import React from "react";
import T from "@/components/translations/translation";
import { useTranslation } from "react-i18next";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState, useEffect } from "react";

const LeftSideLogin = () => {
	const { i18n } = useTranslation();
	const supabase = createClientComponentClient();
	const [languages, setLanguages] = useState([]);

	useEffect(() => {
		const fetchLanguages = async () => {
			const { data, error } = await supabase
				.from("languages")
				.select("*");

			if (error) {
				console.error("Error fetching languages:", error);
			} else {
				setLanguages(data);
			}
		};

		fetchLanguages();
	}, []);

	return (
		<div className="bg-mid_blue w-full md:w-1/2 min-content flex flex-col items-center justify-center md:pt-10 pb-10 pt-5 gap-y-10 md:gap-y-0">
			<div className="flex flex-row gap-x-2 justify-center mt-auto text-light_gray md:order-2">
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
					src="/logo/surf-logo-white.svg"
					alt="mysurface_logo"
					className="mx-auto mb-4 w-52 h-52"
				/>
				<h1 className="text-6xl text-light_gray font-fjalla text-center mb-5">
					My Surface
				</h1>
				<hr className="w-3/4 lg:w-2/3 mx-auto mb-5 border-2 border-light_gray" />
				<p className="text-light_gray font-glory text-center font-light text-xl w-4/5 lg:w-3/5 mx-auto">
					<T tkey="login.slogan.part1" />
					<br />
					<T tkey="login.slogan.part2" />
				</p>
			</div>
		</div>
	);
};

export { LeftSideLogin };
