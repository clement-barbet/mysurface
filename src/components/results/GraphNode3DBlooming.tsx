"use client";
import dynamic from "next/dynamic";
//import { ForceGraph3D } from "react-force-graph";
import { UnrealBloomPass } from "./utils/UnrealBloomPass";
import * as THREE from "three";
import React, { useRef, useEffect, useState } from "react";
import ColorLegend from "./ColorLegend";
import { scalePow } from "d3";

/*
const ForceGraph3D = dynamic(
	() => import("react-force-graph").then((mod) => mod.ForceGraph3D),
	{ ssr: false }
);
*/

interface GraphNode3DProps {
	graphData: any;
}

const GraphNode3D: React.FC<GraphNode3DProps> = ({ graphData }) => {
	const fgRef = useRef();
	const [ForceGraph3D, setForceGraph3D] = useState(null);
	const [bloomApplied, setBloomApplied] = useState(false);

	useEffect(() => {
		import("react-force-graph")
			.then((mod) => {
				setForceGraph3D(mod.ForceGraph3D);
			})
			.catch((error) => {
				console.error("Error loading ForceGraph3D:", error);
			});
	}, []);

	const [dimensions, setDimensions] = useState({
		width: typeof window !== "undefined" ? window.innerWidth : 0,
		height: typeof window !== "undefined" ? window.innerHeight : 0,
	});

	useEffect(() => {
		const resizeGraph = () => {
			const width =
				window.innerWidth < 768
					? window.innerWidth - 20
					: window.innerWidth - 210;
			const height =
				window.innerWidth < 768
					? window.innerHeight - 100
					: window.innerHeight - 140;
			setDimensions({
				width,
				height,
			});
		};

		resizeGraph();
		window.addEventListener("resize", resizeGraph);
		return () => {
			window.removeEventListener("resize", resizeGraph);
		};
	}, []);

	const maxSize = Math.max(...graphData.nodes.map((node) => node.val));
	const minSize = Math.min(...graphData.nodes.map((node) => node.val));

	// hsl(29, 100%, 47%) accent color orange

	/*
	const hue = 25 / 360;
	const saturation = 1;
	const baseLightness = 0.4;

	const getNodeColor = (node) => {
		const normalizedSize = (node.val - minSize) / (maxSize - minSize);
		const lightness = baseLightness + normalizedSize * 0.5; // Bigger = light
		const color = new THREE.Color().setHSL(hue, saturation, lightness);
		return color.getStyle();
					"hsl(20, 100%, 40%)",
			"hsl(40, 100%, 70%)",
			"hsl(60, 100%, 100%)",
	};
	*/

	const ranges = [
		"hsl(20, 100%, 40%)",
		"hsl(40, 100%, 70%)",
		"hsl(60, 100%, 100%)",
	];
	const colorScale = scalePow()
		.exponent(3)
		.domain([minSize, (minSize + maxSize) / 2, maxSize])
		.range(ranges);

	const getNodeColor = (node) => {
		return colorScale(node.val);
	};

	useEffect(() => {
		if (fgRef.current && !bloomApplied) {
			const bloomPass = new UnrealBloomPass(
				new THREE.Vector2(dimensions.width, dimensions.height),
				2,
				0.5,
				0
			);
			fgRef.current.postProcessingComposer().addPass(bloomPass);
			setBloomApplied(true);
		}
	}, [fgRef.current, dimensions, ForceGraph3D]);

	if (!ForceGraph3D) {
		return null;
	}

	return (
		<div className="bg-graph_bg w-full">
			<ForceGraph3D
				ref={fgRef}
				backgroundColor="#000000"
				graphData={graphData}
				nodeLabel={(node) => `${node.name} (${node.val.toFixed(2)})`}
				nodeColor={getNodeColor}
				width={dimensions.width}
				height={dimensions.height}
				nodeOpacity={0.8}
				nodeResolution={50}
				linkOpacity={0.02}
				linkWidth={0.2}
				linkColor={() => "#ffffff"}
				showNavInfo={false}
			/>
			<ColorLegend minSize={minSize} maxSize={maxSize} ranges={ranges} />
		</div>
	);
};

export default GraphNode3D;
