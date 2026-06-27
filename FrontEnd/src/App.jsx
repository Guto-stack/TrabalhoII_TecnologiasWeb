import { useState, useMemo } from "react";
import { cn } from "./lib/utils"
import { Header } from "./Components/Header";
import { TreeCard } from "./Components/TreeCard";
import { InfoPanel } from "./Components/InfoPanel";
import { Sun, Moon, Move, Info } from "lucide-react"
import ReactFlow, { Background, Controls, ControlButton, useNodesState, useEdgesState } from 'reactflow';
import 'reactflow/dist/style.css';

const allData = {
  nodes: [
    { id: '1', label: 'Dinosauria', parentId: null, x: 500, y: 50 },
    { id: '2', label: 'Saurischia', parentId: '1', x: 300, y: 180 },
    { id: '3', label: 'Ornithischia', parentId: '1', x: 700, y: 180 },
    { id: '4', label: 'Theropoda', parentId: '2', x: 150, y: 310 },
    { id: '5', label: 'Sauropodomorpha', parentId: '2', x: 450, y: 310 },
  ]
};

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const nodeTypes = useMemo(() => ({ customCard: TreeCard }), []);

  const rootNode = allData.nodes.find(n => n.parentId === null);
  
  const [nodes, setNodes, onNodesChange] = useNodesState([{
    id: rootNode.id,
    position: { x: rootNode.x, y: rootNode.y },
    type: "customCard",
    data: { 
      label: rootNode.label, 
      period: rootNode.period,
      isExpanded: false
    },
  }]);
  
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const handleNodeClick = (event, clickedNode) => {
    if (clickedNode.data.isExpanded) {
      const getDescendants = (parentId) => {
        const childrenIds = edges.filter(e => e.source === parentId).map(e => e.target);
        return childrenIds.reduce((acc, childId) => {
          return [...acc, childId, ...getDescendants(childId)];
        }, []);
      };

      const descendantsToRemove = getDescendants(clickedNode.id);

      setNodes(prevNodes => prevNodes
        .filter(node => !descendantsToRemove.includes(node.id))
        .map(node => node.id === clickedNode.id ? { ...node, data: { ...node.data, isExpanded: false } } : node)
      );
      
      setEdges(prevEdges => prevEdges.filter(edge => !descendantsToRemove.includes(edge.target)));
    } else {
      const children = allData.nodes.filter(n => n.parentId === clickedNode.id);

      if (children.length === 0) return; 

      const newChildrenToRender = children.filter(child => !nodes.some(n => n.id === child.id));

      if (newChildrenToRender.length > 0) {
        const newNodes = newChildrenToRender.map(child => ({
          id: child.id,
          position: { x: child.x, y: child.y },
          type: 'customCard',
          data: { label: child.label, period: child.period, isExpanded: false },
        }));

        const newEdges = newChildrenToRender.map(child => ({
          id: `e-${clickedNode.id}-${child.id}`,
          source: clickedNode.id,
          target: child.id,
          type: 'step',
          style: { stroke: 'var(--paleo-border)', strokeWidth: 1.5 }
        }));

        setNodes((prevNodes) => [
          ...prevNodes.map(node => node.id === clickedNode.id ? { ...node, data: { ...node.data, isExpanded: true } } : node),
          ...newNodes
        ]);
        
        setEdges((prevEdges) => [...prevEdges, ...newEdges]);
      }
    }
  };

  const panelItems = [
    "Arraste para mover",
    "Scroll para zoom",
    "Clique no card para expandir ramo",
    <span key="info" className="flex items-center gap-1">
      Clique em <Info className="w-3 h-3 text-accent" /> para detalhes
    </span>
  ];

  return (
    <div className={cn("flex flex-col w-screen h-screen overflow-hidden bg-canvas transition-colors duration-300", isDarkMode ? "dark-theme" : "")}>
      <Header />
      
      <div className="flex-1 w-full relative">
        <ReactFlow 
            nodes={nodes} 
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={handleNodeClick}
            nodeTypes={nodeTypes}
            nodesDraggable={false}
            fitView
        >
          <Background color="var(--paleo-dot)" gap={20} size={1.5} />

          <Controls 
            showInteractive={false}
            showZoom={true}
            showFitView={true}
            className="paleo-controls"
          >
            <ControlButton onClick={() => setIsDarkMode(!isDarkMode)} title="Toggle Theme">
              {isDarkMode ? <Sun className="w-8 h-8" /> : <Moon className="w-8 h-8" />}
            </ControlButton>
          </Controls>

          <InfoPanel 
            icon={Move} 
            title="Controles" 
            items={panelItems} 
            className="top-6 right-6"
          />
        </ReactFlow>
      </div>
    </div>
  );
}

export default App;