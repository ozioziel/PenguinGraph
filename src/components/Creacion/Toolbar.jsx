import { useState } from "react";
import "./Toolbar.css"

export default function ToolBar({setHerramienta}) {
  const [pingSrc, setPingSrc] = useState("https://res.cloudinary.com/dj5kb9v78/image/upload/v1771434276/assets/pinguino1_era4wq.png");
  const [minimized, setMinimized] = useState(false);

  function handleClick(herramienta){
    setHerramienta(herramienta)
  }
  function handleMouseEnter() {
    setPingSrc("https://res.cloudinary.com/dj5kb9v78/image/upload/v1771434276/assets/pinguino2_t101hd.png");
  }
  function handleMouseLeave() {
    setPingSrc("https://res.cloudinary.com/dj5kb9v78/image/upload/v1771434276/assets/pinguino1_era4wq.png");
  }

  return (
    <div className="Toolbar">
      <div className="toolbar-header">
        <h2>Herramientas</h2>
        <button className="minimize-btn" onClick={() => setMinimized(!minimized)}>
          {minimized ? "▼" : "▲"}
        </button>
      </div>

      {!minimized && (
        <div className="toolbar-content">
          <p onClick={() => handleClick(1)}>Aniadir Vertice</p>
          <p onClick={() => handleClick(2)}>Aniadir Arista</p>
          <p onClick={() => handleClick(3)}>Seleccionar</p>
          <p onClick={() => handleClick(4)}>Mover</p>
          <p onClick={() => handleClick(5)}>Eliminar</p>
          <img
            src={pingSrc}
            alt="Click aqui para eliminar todo"
            style={{ width: "50px", cursor: "pointer" }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => { handleClick(6); setPingSrc("https://res.cloudinary.com/dj5kb9v78/image/upload/v1771434276/assets/pinguino3_n7pbmh.png")}}
          />
        </div>
      )}
    </div>
  );
}