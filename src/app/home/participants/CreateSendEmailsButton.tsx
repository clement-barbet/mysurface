import React from "react";
import { ErrorMessage } from "@/components/ui/msg/error_msg";
import { SuccessMessage } from "@/components/ui/msg/success_msg";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import T from "@/components/translations/translation";

const EmailButton = ({ participants, lang, org, isEnrollmentPhase }) => {
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	async function sendEmail(name, email, url) {
		try {
			const response = await fetch("/api/send-email", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ name, email, url }),
			});

			return response;
		} catch (error) {
			console.error("Error:", error);
		}
	}
	const handleClick = async () => {
		let failedEmails = [];
		for (let participant of participants) {
			const { name, email } = participant;
			const url = `${process.env.NEXT_PUBLIC_BASE_URL}/questionnaire/${participant.questionnaire}/${lang}/${org}`;

			try {
				const response = await sendEmail(name, email, url);
				if (!response.ok) {
					failedEmails.push(email);
				}
			} catch (error) {
				console.error(`Error:`, error);
			}
		}

		if (failedEmails.length === 0){
			setSuccessMessage("All emails sent successfully.");
		} else {
			setErrorMessage(`Error sending emails to the following addresses: ${failedEmails.join(", ")}`);
		}
	};

	if (isEnrollmentPhase) {
		return null;
	}

	return (
		<>
			<div className="relative">
				<ErrorMessage
					errorMessage={errorMessage}
					setErrorMessage={setErrorMessage}
				/>
				<SuccessMessage
					successMessage={successMessage}
					setSuccessMessage={setSuccessMessage}
				/>
			</div>
			<Button
				className="md:w-1/5 w-full"
				variant="outline_blue"
				onClick={handleClick}
			>
				<T tkey="participants.buttons-section.buttons.sendAll" />
			</Button>
		</>
	);
};

export default EmailButton;
