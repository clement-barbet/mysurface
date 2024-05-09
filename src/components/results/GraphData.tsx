// app/dashboard/results/[id]/GraphData.tsx
import React from "react";

interface GraphDataProps {
  graphData: any;
}

export default function GraphData({ graphData }: GraphDataProps) {
  return (
    <div>
      <h3>Intermediate Data:</h3>
      <pre>
        <code>{JSON.stringify(graphData, null, 2)}</code>
      </pre>
    </div>
  );
}
