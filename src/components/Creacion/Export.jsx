import { useState } from "react";
import "./Export.css";

export default function Export({ nodes, edges, onClose }) {
  const [filename, setFilename] = useState("grafo");

  function handleExport() {
    const safeName = filename.trim() || "grafo";
    const data = JSON.stringify({ nodes, edges }, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${safeName}.json`;
    a.click();

    URL.revokeObjectURL(url);
    onClose();
  }

  return (
    <div className="export-overlay">
      <div className="export-modal">
        <h3>Exportar Grafo</h3>
        <p>Elige un nombre para el archivo:</p>

        <div className="export-filename-wrapper">
          <input
            className="export-filename-input"
            type="text"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            placeholder="nombre del archivo"
            onKeyDown={(e) => e.key === "Enter" && handleExport()}
          />
          <span className="export-filename-ext">.json</span>
        </div>

        <button
          className="export-download"
          onClick={handleExport}
        >
          Descargar
        </button>

        <button
          className="export-cancel"
          onClick={onClose}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}