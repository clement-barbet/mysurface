"use client";
import React, { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

export default function TopBar() {
	const [email, setEmail] = useState("");

	useEffect(() => {
		const fetchUser = async () => {
			const supabase = createClientComponentClient();
			const user = await supabase.auth.getUser("User not found");

			if (user && user.data && user.data.user) {
				setEmail(user.data.user.email);
			}
		};

		fetchUser();
	}, []);

	return (
		<div className="md:bg-dark_gray text-dark_blue px-10 h-20 flex items-center justify-end md:justify-between drop-shadow-sm rounded-br-2xl">
			<div className="hidden md:flex justify-center items-center gap-x-3">
				<FontAwesomeIcon icon={faMagnifyingGlass} />
                {/* TODO - Develop search functionality */}
				<input
					type="text"
					className="w-64 bg-transparent border-none focus:border-none focus:outline-none"
					placeholder="Search"
				/>
			</div>
			<div className="flex justify-center items-center gap-x-3">
				<div className="flex items-center justify-center w-10 h-10 border-2 rounded-full border-dark_blue p-2 bg-mid_blue drop-shadow-md">
					<FontAwesomeIcon
						icon={faUser}
						className="text-light_gray"
					/>
				</div>
				<p className="hidden md:block">{email}</p>
			</div>
		</div>
	);
}
