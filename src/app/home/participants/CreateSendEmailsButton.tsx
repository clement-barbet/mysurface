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

			if (!response.ok) {
				setErrorMessage(`Error: ${response.status}`);
				throw new Error(`Error: ${response.status}`);
			} else {
				const responseData = await response.json();
				return responseData;
			}
		} catch (error) {
			console.error("Error:", error);
		}
	}
	const handleClick = async () => {
		let errorCount = 0;

		for (let participant of participants) {
			const { name, email } = participant;
			const url = `${process.env.NEXT_PUBLIC_BASE_URL}/questionnaire/${participant.questionnaire}/${lang}/${org}`;

			try {
				const response = await sendEmail(name, email, url);

				if (response && response.error) {
					console.error(
						`Error sending email to ${email}:`,
						response.error
					);
					errorCount++;
				}
			} catch (error) {
				console.error(`Error sending email to ${email}:`, error);
				errorCount++;
			}
		}

		if (errorCount > 0) {
			setErrorMessage(`Failed to send ${errorCount} email(s).`);
		} else {
			setSuccessMessage("All emails sent successfully.");
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
