import React from "react";
import { scalePow } from "d3";

const ColorLegend = ({ minSize, maxSize, ranges }) => {
	const midSize = (minSize + maxSize) / 2;
	const colorScale = scalePow<string>()
		.exponent(3)
		.domain([minSize, midSize, maxSize])
		.range(ranges);

	const minColor = colorScale(minSize);
	const midColor = colorScale(midSize);
	const maxColor = colorScale(maxSize);

	return (
		<div className="color-legend pb-1 w-full flex justify-end pe-1 bg-black text-dark_gray text-opacity-90">
			<div className="w-1/3">
				<p className="text-xs pb-0.5">Influence level:</p>
				<div className="relative w-full h-3">
					<div
						style={{
							background: `linear-gradient(to right, ${minColor}, ${midColor}, ${maxColor})`,
						}}
						className="w-full h-3"
					/>
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
					<span>{minSize.toFixed(2)}</span>
					<span>{midSize.toFixed(2)}</span>
					<span>{maxSize.toFixed(2)}</span>
				</div>
			</div>
		</div>
	);
};

export default ColorLegend;
