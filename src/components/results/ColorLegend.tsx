import * as THREE from "three";
import React from "react";

const ColorLegend = ({ minVal, maxVal }) => {
	const midVal = (minVal + maxVal) / 2;

	const getLightness = (val) => {
		const normalizedVal = (val - minVal) / (maxVal - minVal);
		return 0.5 + normalizedVal * 0.4;
	};

	const minColor = new THREE.Color()
		.setHSL(0, 0.8, getLightness(minVal))
		.getStyle();
	const midColor = new THREE.Color()
		.setHSL(0, 0.8, getLightness(midVal))
		.getStyle();
	const maxColor = new THREE.Color()
		.setHSL(0, 0.8, getLightness(maxVal))
		.getStyle();

	return (
		<div className="color-legend pb-1 w-full flex justify-end pe-1 bg-black text-dark_gray text-opacity-90">
			<div className="w-1/3">
				<div className="relative w-full h-3">
					<div
						style={{
							background: `linear-gradient(to right, ${minColor}, ${midColor}, ${maxColor})`,
						}}
						className="w-full h-3"
					/>
					<div className="absolute top-0 left-0 w-full h-3 bg-black opacity-20" />
				</div>
				<div className="flex flex-row justify-between px-2">
					<div
						className="h-1 bg-dark_gray bg-opacity-90"
						style={{ width: "1px" }}
					/>
					<div
						className="h-1 bg-dark_gray bg-opacity-90"
						style={{ width: "1px" }}
					/>
					<div
						className="h-1 bg-dark_gray bg-opacity-90"
						style={{ width: "1px" }}
					/>
				</div>
				<div className="flex flex-row justify-between text-xs">
					<span>{minVal.toFixed(2)}</span>
					<span>{midVal.toFixed(2)}</span>
					<span>{maxVal.toFixed(2)}</span>
				</div>
			</div>
		</div>
	);
};

export default ColorLegend;
