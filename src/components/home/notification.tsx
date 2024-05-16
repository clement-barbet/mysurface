import React, { useState } from "react";
import { GrUpdate, GrAdd } from "react-icons/gr";

const Notification = ({ type, msg, link, lang }) => {
	let check = "Check it";
	let here = "HERE";
	let title_update = "Update";
	let title_news = "News";

	if (lang == 2) {
		check = "Zkontrolujte to";
		here = "ZDE";
		title_update = "Aktualizace";
		title_news = "Novinky";
	} else if (lang == 3) {
		check = "Consúltalo";
		here = "AQUÍ";
		title_update = "Actualización";
		title_news = "Noticias";
	}

	const notificationTypes = {
		update: {
			icon: <GrUpdate className="w-5 h-5 text-white" />,
			title: title_update,
			message: `${msg}`,
			gradient: "from-blue-200 to-indigo-500",
		},
		news: {
			icon: <GrAdd className="w-5 h-5 text-white" />,
			title: title_news,
			message: `${msg}`,
			gradient: "from-lime-300 to-green-500",
		},
	};

	const { icon, title, message, gradient } = notificationTypes[type];

	return (
		<div className="w-full py-1 border-b-2 flex flex-row items-center gap-x-4 hover:bg-light_gray dark:hover:bg-gray-600 dark:hover:bg-opacity-70 rounded-sm px-2 mb-2">
			<div
				className={`border-2 border-gray-200 shadow-sm dark:opacity-80 rounded-full min-w-10 min-h-10 flex items-center justify-center bg-gradient-to-br ${gradient}`}
			>
				{icon}
			</div>
			<div>
				<h3 className="font-semibold md:text-base text-lg">{title}</h3>
				<p className="md:text-sm text-base">
					{message}{" "}
					{link && link != "" && (
						<i>
							({check}{" "}
							<a
								className=" text-accent_color hover:text-accent_hover font-semibold transition-color duration-200 ease-linear"
								href={link}
							>
								{here}
							</a>
							)
						</i>
					)}
				</p>
			</div>
		</div>
	);
};

export { Notification };
