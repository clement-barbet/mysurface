import React from 'react';
import T from "@/components/translations/translation";

interface NodeInfoProps {
  currentNode: {
    name: string;
    value: string;
    group: string;
    action: string;
  };
}

const NodeInfo: React.FC<NodeInfoProps> = ({ currentNode }) => {
  return (
    <div className="absolute bottom-0 left-0 text-light_gray p-2 flex gap-x-4 text-sm">
      <div className="hidden md:block">
        <p>
          <b><T tkey="results.graph.labels.name" /></b>: <T tkey={currentNode.name} />
        </p>
        <p>
          <b><T tkey="results.graph.labels.value" /></b>:  <T tkey={currentNode.value} />
        </p>
      </div>
      <div>
        <p>
          <b><T tkey="results.graph.labels.group" /></b>:  <T tkey={currentNode.group} />
        </p>
        <p>
          <b><T tkey="results.graph.labels.action" /></b>:  <T tkey={currentNode.action} />
        </p>
      </div>
    </div>
  );
};

export default NodeInfo;