import React, {useEffect} from "react";

interface SuccessMessageProps {
	successMessage: string;
	setSuccessMessage: (message: string) => void;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({
	successMessage,
	setSuccessMessage,
}) => {
	useEffect(() => {
		if (successMessage) {
			const timer = setTimeout(() => {
				setSuccessMessage("");
			}, 5000);

			return () => {
				clearTimeout(timer);
			};
		}
	}, [successMessage, setSuccessMessage]);

	return (
		successMessage && (
			<div
				className="m-0 w-full text-green-600 font-bold bg-green-200 p-4 fixed top-0 left-0 flex justify-between items-center drop-shadow-sm flex-shrink-0"
				style={{ zIndex: 200 }}
			>
				<p>{successMessage}</p>
				<button
					onClick={() => setSuccessMessage("")}
					className="font-bold text-2xl z-100"
				>
					×
				</button>
			</div>
		)
	);
};

export { SuccessMessage };
