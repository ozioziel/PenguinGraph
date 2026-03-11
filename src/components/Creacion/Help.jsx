import { useState } from "react";
import "./Help.css";

const tools = [
  {
    id: 1,
    icon: "⬤",
    name: "Añadir Vértice",
    color: "#1a6fb5",
    description: "Haz clic en cualquier parte del canvas para crear un nuevo vértice. Después de crearlo, podrás editar su nombre desde el panel lateral.",
  },
  {
    id: 2,
    icon: "—",
    name: "Añadir Arista",
    color: "#0e8a6e",
    description: "Haz clic en un vértice de origen y luego en un vértice destino para conectarlos. La arista puede ser Dirigida o No Dirigida, y puede tener un peso asignado.",
  },
  {
    id: 3,
    icon: "↖",
    name: "Seleccionar",
    color: "#7c3aed",
    description: "Haz clic sobre un vértice o arista para seleccionarlo y ver/editar sus propiedades en el panel lateral (nombre, peso, tipo de arista, etc.).",
  },
  {
    id: 4,
    icon: "✥",
    name: "Mover",
    color: "#b45309",
    description: "Mantén presionado sobre un vértice y arrástralo para reposicionarlo. Las aristas conectadas se actualizarán automáticamente.",
  },
  {
    id: 5,
    icon: "✕",
    name: "Eliminar",
    color: "#dc2626",
    description: "Haz clic sobre un vértice para eliminarlo junto con todas sus aristas. Haz clic sobre una arista para eliminarla individualmente.",
  },
  {
    id: 6,
    icon: "⊞",
    name: "Matriz de Adyacencia",
    color: "#0369a1",
    description: "Abre una ventana mostrando la matriz de adyacencia del grafo actual. Refleja las conexiones entre todos los vértices.",
  },
  {
    id: 7,
    icon: "↑",
    name: "Exportar",
    color: "#065f46",
    description: "Guarda el grafo actual en formato JSON para poder cargarlo más adelante o compartirlo.",
  },
  {
    id: 8,
    icon: "↓",
    name: "Importar",
    color: "#4338ca",
    description: "Carga un grafo previamente exportado desde un archivo JSON. Reemplaza el grafo actual.",
  },
  {
    id: 10,
    icon: "X",
    name: "Limpiar Canvas",
    color: "#dc2626",
    description: "Haz clic para eliminar todos los vértices y aristas del canvas. ¡Esta acción no se puede deshacer!",
  },
];

export default function Help({ onClose }) {
  const [active, setActive] = useState(null);

  return (
    <div className="overlay" onClick={onClose}>
      <div className="panel" onClick={e => e.stopPropagation()}>


        <div className="header">
          <div className="header-left">
            <span className="header-icon">?</span>
            <div>
              <h2 className="title">Guía de Herramientas</h2>
              <p className="subtitle">Selecciona una herramienta para ver su descripción</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>


        <div className="grid">
          {tools.map(tool => (
            <div
              key={tool.id}
              className="card"
              style={{
                borderColor: active === tool.id ? tool.color : "transparent",
                background: active === tool.id ? `${tool.color}18` : "#f8fafc",
              }}
              onClick={() => setActive(active === tool.id ? null : tool.id)}
            >
              <span className="card-icon" style={{ color: tool.color }}>{tool.icon}</span>
              <span className="card-name">{tool.name}</span>

              {active === tool.id && (
                <p className="desc" style={{ borderTop: `2px solid ${tool.color}` }}>
                  {tool.description}
                </p>
              )}
            </div>
          ))}
        </div>

 
        <div className="tip">
          💡 <strong>Tip:</strong> Puedes cambiar de herramienta en cualquier momento desde el panel izquierdo.
        </div>
      </div>
    </div>
  );
}