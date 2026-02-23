import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { Nodo } from "./Nodo";
import { Arista } from "./Arista";
import { EditMenu } from "./EditMenu";

const existeAristaContraria = (aristas, from, to) =>
  aristas.some((ar) => ar.from === to && ar.to === from);

export function Graph({ herramienta, setHerramienta, clearFlag }) {
  const [nodos, setNodos] = useState([]);
  const [aristas, setAristas] = useState([]);
  const [nodo_seleccionado, setNodo_seleccionado] = useState(null);

  const [weight_input, setWeight_input] = useState(null);
  const [weight_value, setWeight_value] = useState("1");
  const inputRef = useRef(null);

  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0 });

  const [editMenu, setEditMenu] = useState(null);

  // ── Crear nodo ──
  const handleDoubleClick = (e) => {
    if (weight_input || editMenu) return;
    if (herramienta !== 1) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - offset.x;
    const y = e.clientY - rect.top - offset.y;

    setNodos((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        x,
        y,
        label: `Nodo ${prev.length + 1}`,
        color: "#4fc3f7",
      },
    ]);
  };

  const handleNodeClick = (id, e) => {
    if (weight_input) return;

    if (herramienta === 2) {
      const nodo = nodos.find((n) => n.id === id);
      setEditMenu({
        tipo: "nodo",
        datos: nodo,
        posicion: {
          x: nodo.x + offset.x + 30,
          y: nodo.y + offset.y - 20,
        },
      });
      return;
    }

    // Herramienta 3 — Eliminar
    if (herramienta === 3) {
      setNodos((prev) => prev.filter((n) => n.id !== id));
      setAristas((prev) => prev.filter((ar) => ar.from !== id && ar.to !== id));
      return;
    }

    // Herramienta 1 — Crear arista
    if (nodo_seleccionado === null) {
      setNodo_seleccionado(id);
    } else {
      const yaExiste = aristas.some(
        (ar) => ar.from === nodo_seleccionado && ar.to === id,
      );
      if (yaExiste) {
        setNodo_seleccionado(null);
        return;
      }

      const nodoA = nodos.find((n) => n.id === nodo_seleccionado);
      const nodoB = nodos.find((n) => n.id === id);
      const midX = nodo_seleccionado === id ? nodoA.x : (nodoA.x + nodoB.x) / 2;
      const midY =
        nodo_seleccionado === id ? nodoA.y - 80 : (nodoA.y + nodoB.y) / 2;

      setWeight_input({ from: nodo_seleccionado, to: id, x: midX, y: midY });
      setWeight_value("1");
      setNodo_seleccionado(null);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  // ClICK ARISTA
  const handleAristaClick = (arista, posicion) => {
    if (herramienta === 3) {
      setAristas((prev) =>
        prev.filter((ar) => !(ar.from === arista.from && ar.to === arista.to)),
      );
      return;
    }
    if (herramienta === 2) {
      setEditMenu({
        tipo: "arista",
        datos: arista,
        posicion,
      });
    }

    return;
  };

  // ── Guardar edicion ──
  const handleGuardarEdit = (datoActualizado) => {
    if (editMenu.tipo === "nodo") {
      setNodos((prev) =>
        prev.map((n) => (n.id === datoActualizado.id ? datoActualizado : n)),
      );
    } else {
      setAristas((prev) =>
        prev.map((ar) =>
          ar.from === datoActualizado.from && ar.to === datoActualizado.to
            ? datoActualizado
            : ar,
        ),
      );
    }
    setEditMenu(null);
  };

  const handleMouseDown = (e) => {
    if (weight_input || editMenu) return;
    if (e.target.closest("[data-nodo]")) return;
    setIsPanning(true);
    panStart.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
  };

  const handleMouseMove = (e) => {
    if (!isPanning) return;
    setOffset({
      x: e.clientX - panStart.current.x,
      y: e.clientY - panStart.current.y,
    });
  };

  const handleMouseUp = () => setIsPanning(false);
  const handleMouseLeave = () => setIsPanning(false);

  const handleClear = () => {
    setNodos([]);
    setAristas([]);
    setNodo_seleccionado(null);
    setWeight_input(null);
    setWeight_value("1");
    setOffset({ x: 0, y: 0 });
    setEditMenu(null);
  };

  useEffect(() => {
    handleClear();
  }, [clearFlag]);

  // ── Peso ──
  const confirmarPeso = () => {
    if (weight_value.trim() !== "") {
      setAristas((prev) => [
        ...prev,
        {
          from: weight_input.from,
          to: weight_input.to,
          weight: parseFloat(weight_value) || 1,
        },
      ]);
    }
    setWeight_input(null);
    setWeight_value("1");
  };

  const cancelarPeso = () => {
    setWeight_input(null);
    setWeight_value("1");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") confirmarPeso();
    if (e.key === "Escape") cancelarPeso();
  };

  return (
    <Container
      data-graph
      onDoubleClick={handleDoubleClick}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      $isPanning={isPanning}
    >
      <Toolbar>
        <ClearButton onClick={handleClear} disabled={nodos.length === 0}>
          Limpiar Todo
        </ClearButton>
      </Toolbar>

      <Canvas $offsetX={offset.x} $offsetY={offset.y}>
        <SvgCanvas>
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <polygon points="0 0, 10 3, 0 6" fill="black" />
            </marker>
          </defs>

          {aristas.map((ar, index) => (
            <Arista
              key={index}
              ar={ar}
              nodos={nodos}
              existeContraria={existeAristaContraria(aristas, ar.from, ar.to)}
              herramienta={herramienta}
              onAristaClick={handleAristaClick}
            />
          ))}
        </SvgCanvas>

        {nodos.map((node) => (
          <Nodo
            key={node.id}
            nodo={node}
            onClick={(e) => handleNodeClick(node.id, e)}
            seleccionado={node.id === nodo_seleccionado}
          />
        ))}

        {weight_input && (
          <WeightContainer $x={weight_input.x} $y={weight_input.y}>
            <span>Peso</span>
            <input
              ref={inputRef}
              type="number"
              value={weight_value}
              onChange={(e) => setWeight_value(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <div className="WeightButtons">
              <button id="ButtonConfirmar" onClick={confirmarPeso}>
                ✓
              </button>
              <button id="ButtonCancelar" onClick={cancelarPeso}>
                ✕
              </button>
            </div>
          </WeightContainer>
        )}

        {editMenu && (
          <EditMenu
            tipo={editMenu.tipo}
            datos={editMenu.datos}
            posicion={editMenu.posicion}
            onGuardar={handleGuardarEdit}
            onCerrar={() => setEditMenu(null)}
          />
        )}
      </Canvas>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  flex: 1;
  border: 2px solid black;
  background-color: rgb(32, 64, 109);
  background-image:
    linear-gradient(to right, #000000 1px, transparent 1px),
    linear-gradient(to bottom, #000000 1px, transparent 1px);
  background-size: 40px 40px;
  overflow: hidden;
  cursor: ${({ $isPanning }) => ($isPanning ? "grabbing" : "default")};
`;

const Canvas = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: translate(
    ${({ $offsetX }) => $offsetX}px,
    ${({ $offsetY }) => $offsetY}px
  );
`;

const SvgCanvas = styled.svg`
  width: 100%;
  height: 100%;
  position: absolute;
  overflow: visible;
  top: 0;
  left: 0;
  pointer-events: none;
`;

const WeightContainer = styled.div`
  position: absolute;
  left: ${({ $x }) => $x}px;
  top: ${({ $y }) => $y}px;
  transform: translate(-50%, -50%);
  background-color: white;
  border: 2px solid #333;
  border-radius: 8px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  z-index: 10;

  span {
    font-weight: bold;
    font-size: 14px;
    color: #333;
  }

  input {
    width: 60px;
    padding: 4px 8px;
    border: 2px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
    text-align: center;
    outline: none;
    &:focus {
      border-color: #2196f3;
    }
  }

  .WeightButtons {
    display: flex;
    gap: 4px;

    #ButtonConfirmar {
      background-color: #4caf50;
      &:hover {
        background-color: #388e3c;
      }
    }
    #ButtonCancelar {
      background-color: #f44336;
      &:hover {
        background-color: #c62828;
      }
    }
    button {
      color: white;
      border: none;
      border-radius: 4px;
      width: 28px;
      height: 28px;
      font-size: 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
`;

const Toolbar = styled.div`
  position: absolute;
  bottom: 16px;
  right: 16px;
  z-index: 20;
  display: flex;
  gap: 8px;
`;

const ClearButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition:
    background-color 0.2s,
    transform 0.1s,
    opacity 0.2s;

  &:hover:not(:disabled) {
    background-color: #c62828;
    transform: translateY(-1px);
  }
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;
