import * as THREE from "three";
import React from "react";

const ColorLegend = ({
	minVal,
	maxVal,
	hue,
	saturation,
	baseLightness,
	bgColorClass,
	textColorClass,
}) => {
	const midVal = (minVal + maxVal) / 2;

	const getLightness = (val) => {
		const normalizedVal = (val - minVal) / (maxVal - minVal);
		return baseLightness + normalizedVal * 0.5;
	};

	const minColor = new THREE.Color()
		.setHSL(hue, saturation, getLightness(minVal))
		.getStyle();
	const midColor = new THREE.Color()
		.setHSL(hue, saturation, getLightness(midVal))
		.getStyle();
	const maxColor = new THREE.Color()
		.setHSL(hue, saturation, getLightness(maxVal))
		.getStyle();

	return (
		<div className={`color-legend pb-1 w-full flex justify-end pe-1 bg-${bgColorClass} text-${textColorClass} text-opacity-90`}>
			<div className="w-1/3">
				<p className="text-xs pb-0.5">Influence level:</p>
				<div className="relative w-full h-3">
					<div
						style={{
							background: `linear-gradient(to right, ${minColor}, ${midColor}, ${maxColor})`,
						}}
						className="w-full h-3"
					/>
					<div className="absolute top-0 left-0 w-full h-3 bg-black opacity-10" />
				</div>
				<div className="flex flex-row justify-between px-2">
					<div
						className={`h-1 bg-${textColorClass} bg-opacity-90`}
						style={{ width: "1px" }}
					/>
					<div
						className={`h-1 bg-${textColorClass} bg-opacity-90`}
						style={{ width: "1px" }}
					/>
					<div
						className={`h-1 bg-${textColorClass} bg-opacity-90`}
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
