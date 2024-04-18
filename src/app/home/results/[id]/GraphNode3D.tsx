"use client";

import { ForceGraph3D } from "react-force-graph";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import * as THREE from "three";
import React, { useRef, useEffect, useState } from "react";

interface GraphNode3DProps {
  graphData: any;
}

const GraphNode3D: React.FC<GraphNode3DProps> = ({ graphData }) => {
  const fgRef = useRef(null);

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
    const bloomPass = new UnrealBloomPass();
    bloomPass.strength = 0.5;
    bloomPass.radius = 0.3;
    bloomPass.threshold = 0.2;
    fgRef.current.postProcessingComposer().addPass(bloomPass);
  }, []);

  const getNodeColor = (node) => {
    const maxSize = Math.max(...graphData.nodes.map((node) => node.val));
    const minSize = Math.min(...graphData.nodes.map((node) => node.val));
    const normalizedSize = (node.val - minSize) / (maxSize - minSize);
    const hue = 0; // Red hue (0 degrees)
    const saturation = 0.8; // High saturation
    //const lightness = 0.5 - normalizedSize * 0.5; // Bigger = dark
    const lightness = 0.5 + normalizedSize * 0.4; // Bigger = light
    const color = new THREE.Color().setHSL(hue, saturation, lightness);
    return color.getStyle();
  };

  return (
    <ForceGraph3D
      ref={fgRef}
      backgroundColor="#000003"
      graphData={graphData}
      nodeLabel="id"
      // nodeAutoColorBy={getNodeColor}
      nodeColor={getNodeColor}
      width={dimensions.width}
      height={dimensions.height}
      nodeOpacity={0.5}
      nodeResolution={50}
      linkOpacity={0.02}
      linkWidth={0.5}
      linkColor={() => "#ffffff"}
    />
  );
};

export default GraphNode3D;
