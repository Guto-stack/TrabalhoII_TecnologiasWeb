import { useState, useEffect, useMemo, useCallback } from "react";
import { cn } from "./lib/utils";
import { Header } from "./Components/Header";
import { TreeCard } from "./Components/TreeCard";
import { InfoPanel } from "./Components/InfoPanel";
import { Sun, Moon, Move, Info, Loader2 } from "lucide-react";
import ReactFlow, { Background, Controls, ControlButton, useNodesState, useEdgesState } from 'reactflow';
import dagre from "dagre";
import 'reactflow/dist/style.css';

// Configuração do Motor Matemático Dagre
const getLayoutedElements = (nodes, edges, direction = 'TB') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  
  // nodesep: espaço horizontal entre cards / ranksep: espaço vertical entre níveis
  dagreGraph.setGraph({ rankdir: direction, nodesep: 40, ranksep: 120 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 280, height: 75 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      targetPosition: 'top',
      sourcePosition: 'bottom',
      position: {
        x: nodeWithPosition.x - 280 / 2,
        y: nodeWithPosition.y - 75 / 2,
      },
    };
  });

  return { nodes: newNodes, edges };
};

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Verifica cache
    const temaSalvo = localStorage.getItem("paleotree_tema");
    if(temaSalvo){
      return temaSalvo === "dark";
    }

    // Verifica sistema
    if(typeof window !== 'undefined' && window.matchMedia){
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [periodos, setPeriodos] = useState([]);
  const [activePeriod, setActivePeriod] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [bancoLocal, setBancoLocal] = useState({nodes: [], edges: []});

  const nodeTypes = useMemo(() => ({ customCard: TreeCard }), []);
  
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const alternarTema = () => {
    setIsDarkMode((prev) => {
      const novoTema = !prev;
      localStorage.setItem("paleotree_tema", novoTema ? "dark" : "light");
      return novoTema;
    });
  };

  // Busca os períodos geológicos
  useEffect(() => {
    fetch("http://localhost:3333/periodos")
      .then((res) => res.json())
      .then((data) => {
        setPeriodos(data);
        if(data.length > 0){
          const periodoSalvo = localStorage.getItem("paleotree_periodo_ativo");

          if(periodoSalvo && data.some(p => p.id_periodo.toString() === periodoSalvo)){
            alterarPeriodo(Number(periodoSalvo));
          } else {
            alterarPeriodo(data[0].id_periodo);
          }
        }
      })
      .catch((err) => console.error("Erro ao carregar períodos:", err));
  }, []);

  // Controla a troca de período geológico
  const alterarPeriodo = useCallback(async (idPeriodo) => {
    setIsLoading(true);
    setActivePeriod(idPeriodo);

    localStorage.setItem("paleotree_periodo_ativo", idPeriodo.toString());

    try{
      const res = await fetch(`http://localhost:3333/arvore/${idPeriodo}`);
      const data = await res.json();

      setBancoLocal(data);

      const rootNode = data.nodes.find(n => n.data.nome === "Dinosauria");

      if(rootNode){
        const initialNodes = [{
          id: rootNode.id,
          position: {x: 0, y: 0},
          type: "customCard",
          data: {
            ...rootNode.data,
            label: rootNode.data.nome,
            isExpanded: false
          }
        }];

        // Passa o nó raiz pelo Dagre para centralizá-lo corretamente
        const layouted = getLayoutedElements(initialNodes, []);
        setNodes(layouted.nodes);
        setEdges(layouted.edges);
      } else {
        setNodes([]);
        setEdges([]);
      }
    } catch(err){
      console.error("Erro ao carregar dados da árvore:", err);
    } finally {
      setIsLoading(false);
    }
  }, [setNodes, setEdges]);

  const handleNodeClick = (event, clickedNode) => {
    if(clickedNode.data.isExpanded){
      // Retorna recursivamente os nós na interface
      const getDescendants = (parentId) => {
        const childrenIds = bancoLocal.edges.filter(e => e.source === parentId).map(e => e.target);
        return childrenIds.reduce((acc, childId) => [...acc, childId, ...getDescendants(childId)], []);
      };

      const descendantsToRemove = getDescendants(clickedNode.id);

      // Filtra os nós e atualiza o estado de expansão do nó clicado
      const nextNodes = nodes
        .filter(node => !descendantsToRemove.includes(node.id))
        .map(node => node.id === clickedNode.id ? { ...node, data: { ...node.data, isExpanded: false } } : node);
      
      // Remove rigorosamente as arestas fantasmas
      const nextEdges = edges.filter(edge => !descendantsToRemove.includes(edge.target));

      // Recalcula o layout
      const layouted = getLayoutedElements(nextNodes, nextEdges);
      setNodes(layouted.nodes);
      setEdges(layouted.edges);
    } else {
      const conexoesFilhas = bancoLocal.edges.filter(e => e.source === clickedNode.id);

      if(conexoesFilhas.length === 0) return; 

      // Mapeia os IDs dos alvos para obter os objetos de nós correspondentes da API
      const listaFilhosIds = conexoesFilhas.map(e => e.target);
      const filhosParaRenderizar = bancoLocal.nodes.filter(n => listaFilhosIds.includes(n.id));

      // Filtra para garantir que não terá nós duplicados na tela
      const novosFilhosFiltrados = filhosParaRenderizar.filter(child => !nodes.some(n => n.id === child.id));

      if(novosFilhosFiltrados.length > 0){
        // Prepara os novos nós
        const newNodes = novosFilhosFiltrados.map(child => ({
          id: child.id,
          type: 'customCard',
          position: { x: 0, y: 0 },
          data: { 
            ...child.data, 
            label: child.data.nome || child.data.nomeCientifico, 
            isExpanded: false 
          }
        }));

        const newEdges = novosFilhosFiltrados.map(child => ({
          id: `e-${clickedNode.id}-${child.id}`,
          source: clickedNode.id,
          target: child.id,
          type: 'step',
          style: { stroke: 'var(--paleo-border)', strokeWidth: 1.5 }
        }));

        const nextNodes = [
          ...nodes.map(node => node.id === clickedNode.id ? { ...node, data: { ...node.data, isExpanded: true } } : node),
          ...newNodes
        ];
        const nextEdges = [...edges, ...newEdges];

        // Recalcula o layout
        const layouted = getLayoutedElements(nextNodes, nextEdges);
        setNodes(layouted.nodes);
        setEdges(layouted.edges);
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
        <div className="absolute top-6 left-6 z-10 flex flex-col gap-3 max-w-64 bg-transparent">
          <h2 className="text-text-main font-bold text-xs tracking-wider uppercase mb-1 drop-shadow-sm opacity-80 pl-1">
            Períodos Geológicos
          </h2>
          {periodos.map((periodo) => (
            <button
              key={periodo.id_periodo}
              onClick={() => alterarPeriodo(periodo.id_periodo)}
              className={cn(
                "px-5 py-3 rounded-xl font-bold text-sm text-left transition-all duration-300 shadow-md border cursor-pointer",
                activePeriod === periodo.id_periodo
                  ? "bg-header text-text-main border-accent scale-102 ring-2 ring-accent/30"
                  : "bg-node text-text-main/80 border-accent/20 hover:bg-node/90 hover:text-text-main hover:scale-102"
              )}
            >
              {periodo.nome_periodo}
              <span className="block text-xxs font-normal opacity-60 mt-0.5">
                {periodo.inicio_ma} Ma a {periodo.fim_ma} Ma
              </span>
            </button>
          ))}
        </div>

        {isLoading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-canvas/40 backdrop-blur-xs">
            <div className="flex flex-col items-center gap-2 text-header bg-node/10 p-4 rounded-xl border border-accent/20">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
              <span className="text-xs font-bold uppercase tracking-widest text-text-main/70">Atualizando Linhagem...</span>
            </div>
          </div>
        )}

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
            <ControlButton onClick={alternarTema} title="Toggle Theme">
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