import React, { useState } from 'react';
import { FaUserPlus, FaUserMinus, FaTimes } from 'react-icons/fa';
import { MdDone } from 'react-icons/md';

const Notification = ({ type, name }) => {
	const [isVisible, setIsVisible] = useState(true);

	const notificationTypes = {
		add: {
			icon: <FaUserPlus className="w-5 h-5 text-white" />,
			title: 'New member added to team',
			message: `${name} has been added.`,
			gradient: 'from-blue-200 to-indigo-500'
		},
		remove: {
			icon: <FaUserMinus className="w-5 h-5 text-white" />,
			title: 'Member removed from team',
			message: `${name} has been removed.`,
			gradient: 'from-amber-300 to-red-600'
		},
		complete: {
			icon: <MdDone className="w-5 h-5 text-white" />,
			title: 'Questionnaire completed',
			message: `${name} has completed the form.`,
			gradient: 'from-lime-300 to-green-500'
		},
	};

	const { icon, title, message, gradient } = notificationTypes[type];

	if (!isVisible) {
		return null;
	}

	return (
		<div className="w-full py-1 border-b-2 flex flex-row items-center gap-x-4 flex-wrap hover:bg-light_gray dark:hover:bg-gray-600 dark:hover:bg-opacity-70 rounded-sm px-2 mb-2">
			<div className={`border-2 border-gray-200 shadow-sm dark:opacity-80 rounded-full w-10 h-10 flex items-center justify-center bg-gradient-to-br ${gradient}`}>
				{icon}
			</div>
			<div>
				<h3 className="font-semibold">{title}</h3>
				<p>{message}</p>
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