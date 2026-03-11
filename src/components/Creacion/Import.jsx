import { useRef, useState } from "react";
import "./Import.css";

export default function Import({ onImport, onClose }) {

  const fileRef = useRef();
  const [fileName, setFileName] = useState(null);

  function handleFileChange() {
    const file = fileRef.current.files[0];
    setFileName(file ? file.name : null);
  }

  function handleImport() {
    const file = fileRef.current.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);

        if (data.nodes && data.edges) {
          onImport(data);
          onClose();
        } else {
          alert("El archivo no tiene un formato válido.");
        }

      } catch {
        alert("Error al leer el archivo JSON.");
      }
    };

    reader.readAsText(file);
  }

  return (
    <div className="import-overlay">
      <div className="import-modal">

        <h3>Importar Grafo</h3>

        <input
          className="import-file"
          type="file"
          accept=".json"
          ref={fileRef}
          onChange={handleFileChange}
        />

        {fileName && (
          <p className="import-file-info">
            📄 Archivo seleccionado: <strong>{fileName}</strong>
          </p>
        )}

        <button
          className="import-load"
          onClick={handleImport}
          disabled={!fileName}
        >
          Cargar
        </button>

        <button
          className="import-cancel"
          onClick={onClose}
        >
          Cancelar
        </button>

      </div>
    </div>
  );
}