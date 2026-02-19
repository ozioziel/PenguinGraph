import GraphManager from "./Creacion/GraphManager";
import Toolbar from "./Creacion/toolbar";
import { useState } from "react";
import "./Grafo.css";

export default function Grafo() {
  const [herramienta, setHerramienta] = useState(0)
  return (

    
    <section id="grafo" className="grafo-layout">
      <div className="grafo-container">
        <Toolbar setHerramienta = {setHerramienta}/>
        <GraphManager herramienta = {herramienta} />
      </div>
    </section>
  );
}
