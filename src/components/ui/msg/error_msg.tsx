import React, { useEffect } from "react";
import T from "@/components/translations/translation";

interface ErrorMessageProps {
	errorMessage: string;
	setErrorMessage: (message: string) => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
	errorMessage,
	setErrorMessage,
}) => {
	useEffect(() => {
		if (errorMessage) {
			const timer = setTimeout(() => {
				setErrorMessage("");
			}, 5000);

			return () => {
				clearTimeout(timer);
			};
		}
	}, [errorMessage, setErrorMessage]);

	return (
		errorMessage && (
			<div
				className="m-0 w-full text-white font-semibold bg-accent_delete py-2 px-4 fixed top-0 left-0 flex justify-between items-center drop-shadow-sm flex-shrink-0"
				style={{ zIndex: 200 }}
			>
				<p>
					<T tkey={errorMessage} />
				</p>
				<button
					onClick={() => setErrorMessage("")}
					className="font-bold text-2xl z-100"
				>
					×
				</button>
			</div>
		)
	);
};

export { ErrorMessage };
