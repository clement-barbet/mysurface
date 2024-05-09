"use client";
import dynamic from "next/dynamic";
//import { ForceGraph3D } from "react-force-graph";
import { UnrealBloomPass } from "./utils/UnrealBloomPass";
import * as THREE from "three";
import React, { useRef, useEffect, useState } from "react";
import ColorLegend from "./ColorLegend";

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
					: window.innerWidth - 230;
			setDimensions({
				width,
				height: window.innerHeight - 135,
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
	const hue = 25 / 360;
	const saturation = 1;
	const baseLightness = 0.4;

	// 	hsl(29, 100%, 47%) accent color orange
	// hsl(189, 59%, 48%) accent color blue
	const getNodeColor = (node) => {
		const normalizedSize = (node.val - minSize) / (maxSize - minSize);
		const lightness = baseLightness + normalizedSize * 0.5; // Bigger = light
		const color = new THREE.Color().setHSL(hue, saturation, lightness);
		return color.getStyle();
	};

	useEffect(() => {
		if (fgRef.current && !bloomApplied) {
			const bloomPass = new UnrealBloomPass(
				new THREE.Vector2(dimensions.width, dimensions.height),
				2,
				1,
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
		<div className="bg-black w-full">
			<ForceGraph3D
				ref={fgRef}
				backgroundColor="#000000"
				graphData={graphData}
				nodeLabel="id"
				nodeColor={getNodeColor}
				width={dimensions.width}
				height={dimensions.height}
				nodeOpacity={0.8}
				nodeResolution={50}
				linkOpacity={0.02}
				linkWidth={0.2}
				linkColor={() => "#ffffff"}
			/>
			<ColorLegend
				minVal={minSize}
				maxVal={maxSize}
				hue={hue}
				saturation={saturation}
				baseLightness={baseLightness}
			/>
		</div>
	);
};

export default GraphNode3D;
