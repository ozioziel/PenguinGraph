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
  const [draggingNodeId, setDraggingNodeId] = useState(null);
  const svgReference = useRef(null);
//Use effect para actualizacion de grado
useEffect(() => {
  setNodes(prevNodes =>
    prevNodes.map(node => {
      let degree = 0;

      edges.forEach(edge => {
        if (!edge.to) return;


        if (edge.type === "No Dirigido") {
          if (edge.from === node.id || edge.to === node.id) degree++;
        }

   
        if (edge.type === "Dirigido") {
          if (edge.from === node.id) degree++; 
          if (edge.to === node.id) degree++;  
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

  if (herramienta === 6) {
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
  const from = nodes.find(n => n.id === edge.from);
  const to = nodes.find(n => n.id === edge.to);
  if (!to || !from) return false;


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
      (e.from === from.id && e.to === to.id) ||
      (e.from === to.id && e.to === from.id)
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

      // Le pasamos como valores el id del propieo Edge, el id del primer nodo y el id del segundo nodo, en este caso es cuando esta la linea punteda y debemos elejit a que nodo conectar
        const newEdge = {
          id: nextIdEdge,
          from: edgeStartNode,
          to: clickedNode.id,
          type: "Dirigido",
          weight: 0
        }
      //esto es con fines que la herramienta mover funcione correctamente
      setEdge(prev => [...prev, newEdge]);
      setNextIdEdge(prev => prev + 1);
      setEdgeStartNode(null);
      setEdgeSecondNode(null);
      setStateEdge(false);

      setSelectedEdge(newEdge);
}
      
      else if (clickedNode && !state_edge) {
        console.log('click nodo') //Clikeaste un Nodo
        setEdgeStartNode(clickedNode.id);
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

if (herramienta === 4){

}
if (herramienta === 5) {
  const clickedNode = nodes.find(node => isInsideNode(x, y, node, 20));

  if (clickedNode) {
    console.log("Nodo clickeado id:", clickedNode.id);

    setNodes(prevNodes => prevNodes.filter(n => n.id !== clickedNode.id));
    setEdge(prevEdges =>
      prevEdges.filter(e => e.from !== clickedNode.id && e.to !== clickedNode.id)
    ); //Recorremos cada id del array  y verificamos si el nodo clickeado tiene alguna arista asociada
    //Al aplicar filter nos quedamos con los nodos que tenga id distinta, lo que significa que nodo que tenga arista se elimina nodo y arista
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
  const rect = e.currentTarget.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;


  if (edgeStartNode) {
    setMousePos({ x, y });
  }


  if (draggingNodeId !== null) {
    setNodes(prev =>
      prev.map(node =>
        node.id === draggingNodeId
          ? { ...node, x, y }
          : node
      )
    );
  }
}

function handleMouseDown(e) {
  if (herramienta !== 4) return;

  const rect = e.currentTarget.getBoundingClientRect();
  const touch = e.touches ? e.touches[0] : e; 
  const x = touch.clientX - rect.left;
  const y = touch.clientY - rect.top;

  const clickedNode = nodes.find(node => isInsideNode(x, y, node, 20));
  if (clickedNode) setDraggingNodeId(clickedNode.id);
}

function handleMouseMove(e) {
  const rect = e.currentTarget.getBoundingClientRect();
  const touch = e.touches ? e.touches[0] : e;
  const x = touch.clientX - rect.left;
  const y = touch.clientY - rect.top;

  if (edgeStartNode) setMousePos({ x, y });

  if (draggingNodeId !== null) {
    setNodes(prev =>
      prev.map(node =>
        node.id === draggingNodeId ? { ...node, x, y } : node
      )
    );
  }
}

function handleMouseUp() {
  setDraggingNodeId(null);
}

  //la vida --------------------
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
    
    if (selectedEdge){ //Busca si seleccionamos algun edge, en cuyo caso busca por id, y da la posicion del panel
      const fromNode = nodes.find(n => n.id === selectedEdge.from);
      panelPosition = {
        x: rect.left + fromNode.x,
        y: rect.top + fromNode.y
      }
    }
    if (selectedNode){
    
    panelPosition = {
        x: rect.left + selectedNode.x,
        y: rect.top + selectedNode.y
    }
    }
    };
  

  return (
     <>
    <div className="svg-container">
      <svg
        ref = {svgReference}
        width="2500"
        height="100vh"
        style={{ background: "#e8f6ff", borderRadius: "10px" }}
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}//Equivalentes tactiles para celular
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
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

            
      {edges.map(edge => { //Cada vez que se re-renderiza ejecuta las funciones para encontrar el node from y el node to, para que la herramienta mover actualize aristas
        const resolvedEdge = {
          ...edge,
          from: nodes.find(n => n.id === edge.from),
          to: nodes.find(n => n.id === edge.to)
        }
        return <Edge key={edge.id} edge={resolvedEdge} edges={edges} />
      })}

      {nodes.map(node => (
        <Node key={node.id} node={node} />
      ))}

      {edgeStartNode && ( //Renderizado mientras elejimos a que nodo conectar
        <Edge
          edge={{ from: nodes.find(n => n.id === edgeStartNode) }}// le pasamos como paramtro el id del node from
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