import React, { useState } from 'react';
import { GrUpdate, GrAdd } from "react-icons/gr";
import { FaTimes } from 'react-icons/fa';

const Notification = ({ type, msg, link }) => {
	const [isVisible, setIsVisible] = useState(true);

	const notificationTypes = {
		update: {
			icon: <GrUpdate className="w-5 h-5 text-white" />,
			title: 'Update',
			message: `${msg}`,
			gradient: 'from-blue-200 to-indigo-500'
		},
		news: {
			icon: <GrAdd className="w-5 h-5 text-white" />,
			title: 'News',
			message: `${msg}`,
			gradient: 'from-lime-300 to-green-500'
		},
	};

	const { icon, title, message, gradient } = notificationTypes[type];

	if (!isVisible) {
		return null;
	}

	return (
		<div className="w-full py-1 border-b-2 flex flex-row items-center gap-x-4 hover:bg-light_gray dark:hover:bg-gray-600 dark:hover:bg-opacity-70 rounded-sm px-2 mb-2">
			<div className={`border-2 border-gray-200 shadow-sm dark:opacity-80 rounded-full min-w-10 min-h-10 flex items-center justify-center bg-gradient-to-br ${gradient}`}>
				{icon}
			</div>
			<div>
				<h3 className="font-semibold md:text-base text-lg">{title}</h3>
				<p className='md:text-sm text-base'>{message} <i>(Check <a className=' text-blue-500 font-semibold' href={link}>HERE</a>)</i></p>
			</div>
			<button 
				onClick={() => setIsVisible(false)} 
				className="ml-auto"
			>
				<FaTimes />
			</button>
		</div>
	);
};

export {Notification};