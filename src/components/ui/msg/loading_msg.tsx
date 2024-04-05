import React from "react";

interface LoadingMessageProps {
	isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

const LoadingMessage: React.FC<LoadingMessageProps> = ({ isLoading, setIsLoading }) => {
	if (!isLoading) {
		return null;
	}
	return (
		(
			<div
				className="w-full text-blue-700 font-bold bg-blue-200 p-4 fixed top-0 left-0 flex justify-between items-center drop-shadow-sm flex-shrink-0"
				style={{ zIndex: 200 }}
			>
				<p>Loading...</p>
				<button
					onClick={() => setIsLoading(false)}
					className="font-bold text-2xl z-100"
				>
					×
				</button>
			</div>
		)
	);
};

export { LoadingMessage };
