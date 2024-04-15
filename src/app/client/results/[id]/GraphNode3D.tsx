"use client";

import { ForceGraph3D } from "react-force-graph";
import React, { useRef, useEffect, useState } from "react";

interface GraphNode3DProps {
	graphData: any;
}

export default function GraphNode3D({ graphData }: GraphNode3DProps) {
	const fgRef = useRef(null);
	const [dimensions, setDimensions] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
	});

	useEffect(() => {
		const resizeGraph = () => {
			const width =
				window.innerWidth < 768
					? window.innerWidth -20
					: window.innerWidth - 210;
			setDimensions({
				width,
				height: window.innerHeight - 90,
			});
		};
		resizeGraph();
		window.addEventListener("resize", resizeGraph);
		return () => {
			window.removeEventListener("resize", resizeGraph);
		};
	}, []);

	graphData.nodes.forEach((node) => {
		node.color = "#7F9DAF";
	});

	return (
		<ForceGraph3D
			ref={fgRef}
			backgroundColor="#000003"
			graphData={graphData}
			nodeLabel="id"
			nodeAutoColorBy="group"
			width={dimensions.width}
			height={dimensions.height}
		/>
	);
}
