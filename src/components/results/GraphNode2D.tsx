"use client";
import dynamic from "next/dynamic";
//import { ForceGraph2D } from "react-force-graph"
import React, { useEffect, useRef, useState } from "react";

interface GraphNode2DProps {
	graphData: any;
}

const ForceGraph2D = dynamic(
	() => import("react-force-graph").then((mod) => mod.ForceGraph2D),
	{ ssr: false }
);

export default function GraphNode2D({ graphData }: GraphNode2DProps) {
	const forceGraphRef = useRef(null);

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
				height: window.innerHeight - 90,
			});
		};
		resizeGraph();
		window.addEventListener("resize", resizeGraph);
		return () => {
			window.removeEventListener("resize", resizeGraph);
		};
	}, []);

	useEffect(() => {
		const forceGraphInstance = forceGraphRef.current;
		if (forceGraphInstance) {
			const linkForce = forceGraphInstance.d3Force("link");
			if (linkForce) {
				linkForce.distance((link) => link.length || 100);
				forceGraphInstance.d3ReheatSimulation();
			}
		}
	}, []);

	graphData.nodes.forEach((node) => {
		node.color = "#2C7EB5";
	});

	return (
		<ForceGraph2D
			ref={forceGraphRef}
			graphData={graphData}
			width={dimensions.width}
			height={dimensions.height}
			nodeVal={(node) => node.val}
			nodeLabel="name"
			linkWidth={0.7}
			linkOpacity={0.02}
		/>
	);
}
