import React from "react";

const LoadingLogo = () => {
	return (
		<div className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center">
			<div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-accent_color"></div>
		</div>
	);
};

export default LoadingLogo;
