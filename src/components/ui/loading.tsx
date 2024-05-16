import React from "react";

const Loading = () => {
	return (
		<div className="fixed bottom-0 right-0 w-full h-full z-50 flex items-end justify-end pr-4 pb-4">
			<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent_color"></div>
		</div>
	);
};

export default Loading;
