import { useState, useEffect, useRef } from "react";
import Node from "./Node";
import Edge from "./Edge"
import NodePanel from "./NodePanel";
import EdgePanel from "./EdgePanel";
export default function GraphManager({herramienta}) {

  const [nodes, setNodes] = useState([]);
  const [nextIdNode, setNextIdNode] = useState(1);
  const [edges, setEdge] = useState([]);
  const [nextIdEdge, setNextIdEdge] = useState(1);

  const [edgeStartNode, setEdgeStartNode] = useState(null); 
  const [edgeSecondNode, setEdgeSecondNode] = useState(null); 
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [state_edge, setStateEdge] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const svgReference = useRef(null);
//Use effect para actualizacion de grado
useEffect(() => {
  setNodes(prevNodes =>
    prevNodes.map(node => {
      let degree = 0;

      edges.forEach(edge => {
        if (!edge.to) return;


        if (edge.type === "No Dirigido") {
          if (edge.from.id === node.id || edge.to.id === node.id) degree++;
        }

   
        if (edge.type === "Dirigido") {
          if (edge.from.id === node.id) degree++; 
          if (edge.to.id === node.id) degree++;  
        }
      });

      return { ...node, degree };
    })
  );
}, [edges]);
//Use effect para herramienta
  useEffect(() => {
    setSelectedNode(null)
    setSelectedEdge(null)
    if (herramienta !== 1) {
      setEdgeStartNode(null);
      setStateEdge(false);
      
    }

  if (herramienta === 5) {
    setNodes([]);
    setEdge([]);
    setNextIdNode(1);
    setNextIdEdge(1);
    setSelectedNode(null);
    setSelectedEdge(null);
    setEdgeStartNode(null);
    setEdgeSecondNode(null);
  }
}, [herramienta]);



  function isInsideNode(xClick, yClick, node, radius = 20) {
    const dx = xClick - node.x;
    const dy = yClick - node.y;
    return Math.sqrt(dx * dx + dy * dy) <= radius;
  }
  function isInsideEdge(xClick, yClick, edge, tolerance = 8) {
  const from = edge.from;
  const to = edge.to;
  if (!to) return false;


if (from.id === to.id) {
  const radius = 30;        
  const centerX = from.x;
  const centerY = from.y - radius; 

  const dx = xClick - centerX;
  const dy = yClick - centerY;

  const distance = Math.sqrt(dx * dx + dy * dy);


  return Math.abs(distance - radius) <= tolerance;
}

  const parallelEdges = edges.filter(
    (e) =>
      (e.from.id === from.id && e.to.id === to.id) ||
      (e.from.id === to.id && e.to.id === from.id)
  ).sort((a, b) => a.id - b.id);

  const edgeIndex = parallelEdges.findIndex((e) => e.id === edge.id);
  const totalEdges = parallelEdges.length;

  const normalizedFrom = from.id < to.id ? from : to;
  const normalizedTo = from.id < to.id ? to : from;

  const dx = normalizedTo.x - normalizedFrom.x;
  const dy = normalizedTo.y - normalizedFrom.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  const px = -dy / length;
  const py = dx / length;

  const gap = 50;
  let offsetAmount;
  if (totalEdges === 1) {
    offsetAmount = 0;
  } else if (totalEdges % 2 === 0) {
    const step = edgeIndex - (totalEdges - 1) / 2;
    offsetAmount = step * gap;
  } else {
    const step = edgeIndex - (totalEdges - 1) / 2;
    offsetAmount = step === 0 ? gap * 0.4 : step * gap;
  }

  const cpX = (from.x + to.x) / 2 + px * offsetAmount;
  const cpY = (from.y + to.y) / 2 + py * offsetAmount;

  
  const samples = 20;
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const qx = (1-t)*(1-t)*from.x + 2*(1-t)*t*cpX + t*t*to.x;
    const qy = (1-t)*(1-t)*from.y + 2*(1-t)*t*cpY + t*t*to.y;
    const dist = Math.sqrt((qx - xClick)**2 + (qy - yClick)**2);
    if (dist <= tolerance) return true;
  }

  return false;
}

  function handleCanvasClick(e) {
    console.log(herramienta)
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setSelectedEdge(null)
    setSelectedNode(null)
    if (herramienta == 1){
      
      const newNode = {
        id: nextIdNode,
        x: x,
        y: y,
        name: "",
        value: "",
        degree: 0
      };
      setNodes(prev => [...prev, newNode]);
      setNextIdNode(prev => prev + 1);

      setSelectedNode(newNode);
    }
    
    if (herramienta == 2) {
   
      const clickedNode = nodes.find(node => isInsideNode(x, y, node, 20));
      if (clickedNode && state_edge){
      console.log('click second nodo')
      const newEdge = {
        id: nextIdEdge,
        from: edgeStartNode,
        to: clickedNode,
        type: "Dirigido",
        weigth: 0
      }
      
      setEdge(prev => [...prev, newEdge]);
      setNextIdEdge(prev => prev + 1);
      setEdgeStartNode(null);
      setEdgeSecondNode(null);
      setStateEdge(false);

      setSelectedEdge(newEdge);
}
      
      else if (clickedNode && !state_edge) {
        console.log('click nodo') //Clikeaste un Nodo
        setEdgeStartNode(clickedNode);
        setStateEdge(true);
        

      }
    }
    if(herramienta === 3)
    {
      const clickedNode = nodes.find(node => isInsideNode(x, y, node, 20));
      setSelectedNode(clickedNode);
      const clickedEdge = edges.find(edge => isInsideEdge(x,y,edge,10));
      setSelectedEdge(clickedEdge);
      

    }

if (herramienta === 4) {
  const clickedNode = nodes.find(node => isInsideNode(x, y, node, 20));

  if (clickedNode) {
    console.log("Nodo clickeado id:", clickedNode.id);

    setNodes(prevNodes => prevNodes.filter(n => n.id !== clickedNode.id));
    setEdge(prevEdges =>
      prevEdges.filter(e => e.from.id !== clickedNode.id && e.to.id !== clickedNode.id)
    );

    return; 
  }

  const clickedEdge = edges.find(edge => isInsideEdge(x, y, edge));

  if (clickedEdge) {
    console.log("Arista clickeada id:", clickedEdge.id);

    
    setEdge(prevEdges => prevEdges.filter(e => e.id !== clickedEdge.id));
  }

}


    

  }


  function handleMouseMove(e) {
    if (edgeStartNode) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePos({ x, y });
    }
  }

  //repasar con ejercicios --------------------
  function updateNode(id, newData) {
  setNodes(prev =>
    prev.map(n => n.id === id ? { ...n, ...newData } : n)
  );
  setSelectedNode(prev =>
    prev ? { ...prev, ...newData } : prev
  );
}
function updateEdge(id, newData) {
  setEdge(prev =>
    prev.map(e => e.id === id ? { ...e, ...newData } : e)
  );

  setSelectedEdge(prev =>
    prev ? { ...prev, ...newData } : prev
  );
}


  

  let panelPosition = null
    if ((selectedNode || selectedEdge )&& svgReference.current) {
    const rect = svgReference.current.getBoundingClientRect();
    
    if (selectedEdge){
    
    panelPosition = {
        x: rect.left + selectedEdge.from.x,
        y: rect.top + selectedEdge.from.y
    }}
    if (selectedNode){
    
    panelPosition = {
        x: rect.left + selectedNode.x,
        y: rect.top + selectedNode.y
    }
    }
    };
  

  return (
     <>
         <div
      style={{
        width: "100%",
        overflowX: "auto",   
        overflowY: "hidden"
      }}
    >
      <svg
        ref = {svgReference}
        width="1920"
        height="800"
        style={{ background: "#e8f6ff", borderRadius: "10px" }}
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove} 
      >

              
      
                <defs>
        <marker
          id="arrow"
          markerWidth="10"
          markerHeight="10"
          refX="20"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L0,6 L9,3 z" fill="#660000" />
        </marker>
      </defs>
      {edges.map(edge => (
        <Edge
          key={edge.id}
          edge={edge}
          edges={edges}    
        />
      ))}

      {nodes.map(node => (
        <Node key={node.id} node={node} />
      ))}

      {edgeStartNode && (
        <Edge
          edge={{ from: edgeStartNode }}
          mousePos={mousePos}
          edges={[]}       
        />
      )}


       </svg> 
      <EdgePanel
        edge = {selectedEdge}
        position={panelPosition}
        onClose = {() => setSelectedEdge(null)}
        onChange = {updateEdge}

      />
      <NodePanel
        node = {selectedNode}
        position={panelPosition}
        onClose = {() => setSelectedNode(null)}
        onChange = {updateNode}
      />

      </div>
    </>
    
  );
}