import { useState } from "react";
import "./Panel.css";
import Execute from "./Execute";

export default function Panel({ nodes, edges, onClose }) {
  const [source, setSource] = useState("");
  const [target, setTarget] = useState("");
  const [executed, setExecuted] = useState(false);

  const getNodeName = (n) => n.name || `V${n.id}`;

  return (
    <div className="johnson-overlay">
      <div className="johnson-modal">

        <div className="johnson-header">
          <h2 className="johnson-title">Algoritmo de Johnson</h2>
          <button className="johnson-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="johnson-selectors">
          <div className="johnson-field">
            <label className="johnson-label">Nodo inicial</label>
            <select className="johnson-select" value={source}
              onChange={e => { setSource(e.target.value); setExecuted(false); }}>
              <option value="">-- Seleccionar --</option>
              {nodes.map(n => <option key={n.id} value={n.id}>{getNodeName(n)}</option>)}
            </select>
          </div>

          <div className="johnson-field">
            <label className="johnson-label">Nodo final</label>
            <select className="johnson-select" value={target}
              onChange={e => { setTarget(e.target.value); setExecuted(false); }}>
              <option value="">-- Seleccionar --</option>
              {nodes.map(n => <option key={n.id} value={n.id}>{getNodeName(n)}</option>)}
            </select>
          </div>

          <button
            className={`johnson-confirm-btn ${!source || !target ? "johnson-confirm-disabled" : ""}`}
            disabled={!source || !target}
            onClick={() => setExecuted(true)}
          >
            Ejecutar →
          </button>
        </div>

        {!executed ? (
          <div className="johnson-canvas-wrapper">
            <svg width="2500" height="100%" className="johnson-svg">
              <defs>
                <marker id="arrow-johnson" markerWidth="10" markerHeight="10" refX="20" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L9,3 z" fill="#660000" />
                </marker>
              </defs>
              {edges.map(edge => {
                const fromNode = nodes.find(n => n.id === edge.from);
                const toNode   = nodes.find(n => n.id === edge.to);
                if (!fromNode) return null;
                return (
                  <EdgeStatic
                    key={edge.id}
                    edge={{ ...edge, from: fromNode, to: toNode }}
                    edges={edges}
                    nodes={nodes}
                  />
                );
              })}
              {nodes.map(node => (
                <NodeStatic key={node.id} node={node} />
              ))}
            </svg>
          </div>
        ) : (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <Execute nodes={nodes} edges={edges} source={source} target={target} />
          </div>
        )}

      </div>
    </div>
  );
}

// ── NodeStatic ────────────────────────────────────────────────────

function NodeStatic({ node }) {
  const boxW = 50, boxH = 22, halfW = 25;
  const boxY = node.y + 24;
  return (
    <g>
      <circle cx={node.x} cy={node.y} r={20} fill="#4a90d9" stroke="#1a4a8a" strokeWidth={2} />
      <text x={node.x} y={node.y + 5} textAnchor="middle" fill="white" fontSize={12} fontWeight="bold">
        {node.name || node.id}
      </text>
      <rect x={node.x - halfW} y={boxY} width={boxW} height={boxH} fill="white" stroke="#1a4a8a" strokeWidth={1.5} rx={3} />
      <line x1={node.x} y1={boxY} x2={node.x} y2={boxY + boxH} stroke="#1a4a8a" strokeWidth={1.5} />
      <text x={node.x - halfW / 2} y={boxY + 15} textAnchor="middle" fill="#1a1a2e" fontSize={11} fontWeight="bold">0</text>
      <text x={node.x + halfW / 2} y={boxY + 15} textAnchor="middle" fill="#1a1a2e" fontSize={11} fontWeight="bold">0</text>
    </g>
  );
}

// ── EdgeStatic ────────────────────────────────────────────────────

function EdgeStatic({ edge, edges, nodes }) {
  const from = edge.from;
  const to   = edge.to;
  if (!from || !to) return null;

  const hValue = 0;
  const isLoop     = from.id === to.id;
  const isDirected = edge.type === "Dirigido";
  const markerEnd  = isDirected ? "url(#arrow-johnson)" : undefined;
  const badgeW = 42, badgeH = 18;

  if (isLoop) {
    const radius = 30;
    const cx = from.x, cy = from.y - radius;
    const badgeX = cx + radius + 6, badgeY = cy + 2;
    return (
      <g>
        <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#660000" strokeWidth={2} markerEnd={markerEnd} />
        {edge.weight !== 0 && <text x={badgeX} y={cy - 8} fill="#333" fontSize={11}>{edge.weight}</text>}
        <rect x={badgeX} y={badgeY - badgeH / 2} width={badgeW} height={badgeH} rx={4} fill="#2c6fad" />
        <text x={badgeX + badgeW / 2} y={badgeY + 5} textAnchor="middle" fill="white" fontSize={11} fontWeight="bold">h = {hValue}</text>
      </g>
    );
  }

  const parallelEdges = edges
    .filter(e => {
      const f = nodes.find(n => n.id === e.from);
      const t = nodes.find(n => n.id === e.to);
      if (!f || !t) return false;
      return (e.from === from.id && e.to === to.id) || (e.from === to.id && e.to === from.id);
    })
    .sort((a, b) => a.id - b.id);

  const edgeIndex  = parallelEdges.findIndex(e => e.id === edge.id);
  const totalEdges = parallelEdges.length;
  const nFrom = from.id < to.id ? from : to;
  const nTo   = from.id < to.id ? to   : from;
  const dx = nTo.x - nFrom.x, dy = nTo.y - nFrom.y;
  const len = Math.sqrt(dx*dx + dy*dy);
  const px = -dy/len, py = dx/len;
  const gap = 50;
  let off = 0;
  if (totalEdges === 1) off = 0;
  else if (totalEdges % 2 === 0) off = (edgeIndex - (totalEdges-1)/2) * gap;
  else { const s = edgeIndex - (totalEdges-1)/2; off = s === 0 ? gap*0.4 : s*gap; }

  const cpX = (from.x+to.x)/2 + px*off;
  const cpY = (from.y+to.y)/2 + py*off;
  const pathD = `M ${from.x} ${from.y} Q ${cpX} ${cpY} ${to.x} ${to.y}`;
  const t = 0.5;
  const lX = (1-t)*(1-t)*from.x + 2*(1-t)*t*cpX + t*t*to.x;
  const lY = (1-t)*(1-t)*from.y + 2*(1-t)*t*cpY + t*t*to.y;

  return (
    <g>
      <path d={pathD} fill="none" stroke="#660000" strokeWidth={2} markerEnd={markerEnd} />
      {edge.weight !== 0 && (
        <text x={lX} y={lY - 16} textAnchor="middle" fill="#333" fontSize={11}>{edge.weight}</text>
      )}
      <rect x={lX - badgeW/2} y={lY - badgeH/2} width={badgeW} height={badgeH} rx={4} fill="#2c6fad" />
      <text x={lX} y={lY + 5} textAnchor="middle" fill="white" fontSize={11} fontWeight="bold">h = {hValue}</text>
    </g>
  );
}