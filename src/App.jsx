import React, { useCallback, useState, useMemo } from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  // removeElements,
  Handle,
} from "reactflow";
import { Button, Card, CardActions, CardContent } from "@mui/material";
import "reactflow/dist/style.css";
import { v4 as uuidv4 } from 'uuid';

// CustomNode component
const CustomNode = ({ id, data, size, onIncrease, onDecrease }) => {
  return (
    <Card style={{ width: size, height: size }}>
      <CardContent>{data.label}</CardContent>
      <CardActions>
        <Button size="small" onClick={() => onIncrease(id)}>
          +
        </Button>
        <Button size="small" onClick={() => onDecrease(id)}>
          -
        </Button>
      </CardActions>
      <Handle type="source" position="right" />
      <Handle type="target" position="left" />
    </Card>
  );
};

const initialNodes = [
  {
    id: "1",
    position: { x: 0, y: 0 },
    data: { label: "Start" },
    type: "custom",
    size: 50,
  },
  {
    id: "2",
    position: { x: 200, y: 0 },
    data: { label: "Data" },
    type: "custom",
    size: 50,
  },
];
const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onIncrease = (id) => {
    const newNodeId = uuidv4();
    setNodes((nds) => {
      const currentNode = nds.find((node) => node.id === id);
      const newNode = {
        id: newNodeId,
        position: { x: currentNode.position.x + 200, y: currentNode.position.y },
        data: { label: "New Node" },
        type: "custom",
        size: 50,
      };
      return [...nds, newNode];
    });

    setEdges((eds) => {
      return [
        ...eds,
        { id: `e${id}-${newNodeId}`, source: id, target: newNodeId },
      ];
    });
  };

  const onDecrease = (id) => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
    setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id));
  };

  const nodeTypes = useMemo(
    () => ({
      custom: (props) => (
        <CustomNode
          {...props}
          size={props.data.size}
          onIncrease={onIncrease}
          onDecrease={onDecrease}
        />
      ),
    }),
    []
  );

  return (
    <div style={{ width: "90vw", height: "90vh", border: "1px solid" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
      />
    </div>
  );
}
