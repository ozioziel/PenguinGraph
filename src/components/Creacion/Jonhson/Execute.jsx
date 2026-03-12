import { useState, useEffect, useRef } from "react";
import "./Execute.css";
import NodeAnimated from "./NodeAnimated";
import EdgeAnimated from "./EdgeAnimated";

function buildSteps(nodes, edges, startId, endId) {
  if (nodes.length === 0) return [];

  const steps = [];
  const visited = new Set();
  const visitOrder = [];
  const queue = [startId];
  visited.add(startId);

  const initDist       = Object.fromEntries(nodes.map(n => [n.id, -Infinity]));
  const initNodeStates = Object.fromEntries(nodes.map(n => [n.id, "unvisited"]));
  const initRightVals  = Object.fromEntries(nodes.map(n => [n.id, null]));
  initDist[startId] = 0;

  steps.push({
    nodeStates:  { ...initNodeStates },
    distances:   { ...initDist },
    rightVals:   { ...initRightVals },
    criticalEdges: new Set(),
    description: `Inicio en ${nodes.find(n => n.id === startId)?.name || `V${startId}`}. ES = 0. Todos los demás en -∞.`
  });

  // ── Fase 1: hacia adelante, elige suma mayor ──────────────────
  while (queue.length > 0) {
    const currentId = queue.shift();
    visitOrder.push(currentId);
    const last = steps[steps.length - 1];

    steps.push({
      nodeStates:    { ...last.nodeStates, [currentId]: "visited" },
      distances:     { ...last.distances },
      rightVals:     { ...last.rightVals },
      criticalEdges: new Set(last.criticalEdges),
      description:   `Visitando ${nodes.find(n => n.id === currentId)?.name || `V${currentId}`} — ES: ${last.distances[currentId]}.`
    });

    const neighborEdges = edges
      .filter(e => {
        if (e.type === "Dirigido") return e.from === currentId;
        return e.from === currentId || e.to === currentId;
      })
      .sort((a, b) => a.id - b.id);

    for (const edge of neighborEdges) {
      const neighborId = edge.from === currentId ? edge.to : edge.from;
      const last2      = steps[steps.length - 1];
      const newDist    = last2.distances[currentId] + (Number(edge.weight) || 0);

      if (newDist > last2.distances[neighborId]) {
        steps.push({
          nodeStates:    { ...last2.nodeStates },
          distances:     { ...last2.distances, [neighborId]: newDist },
          rightVals:     { ...last2.rightVals },
          criticalEdges: new Set(last2.criticalEdges),
          description:   `Actualizando ES de ${nodes.find(n => n.id === neighborId)?.name || `V${neighborId}`}: → ${newDist}.`
        });
      }

      if (!visited.has(neighborId)) {
        visited.add(neighborId);
        queue.push(neighborId);
      }
    }
  }

  // ── Orden topológico (Kahn) ───────────────────────────────────
  const inDegree = Object.fromEntries(nodes.map(n => [n.id, 0]));
  edges.forEach(e => {
    if (e.type === "Dirigido") {
      inDegree[e.to] = (inDegree[e.to] || 0) + 1;
    } else {
      inDegree[e.to]   = (inDegree[e.to]   || 0) + 1;
      inDegree[e.from] = (inDegree[e.from] || 0) + 1;
    }
  });

  const topoQueue = nodes.filter(n => inDegree[n.id] === 0).map(n => n.id);
  const topoOrder = [];
  const inDegreeCopy = { ...inDegree };

  while (topoQueue.length > 0) {
    const cur = topoQueue.shift();
    topoOrder.push(cur);
    edges.forEach(e => {
      let neighbor = null;
      if (e.type === "Dirigido" && e.from === cur) neighbor = e.to;
      else if (e.type !== "Dirigido" && e.from === cur) neighbor = e.to;
      else if (e.type !== "Dirigido" && e.to === cur)   neighbor = e.from;
      if (neighbor !== null) {
        inDegreeCopy[neighbor]--;
        if (inDegreeCopy[neighbor] === 0) topoQueue.push(neighbor);
      }
    });
  }

  const processOrder = topoOrder.length === nodes.length
    ? [...topoOrder].reverse()
    : [...visitOrder].reverse();

  // ── Fase 2: hacia atrás, elige resta menor ────────────────────
  const lastFwdStep = steps[steps.length - 1];
  const rightVals   = { ...lastFwdStep.rightVals };
  const finalDist   = { ...lastFwdStep.distances };

  const lastNodeId = processOrder[0];
  rightVals[lastNodeId] = finalDist[lastNodeId];

  steps.push({
    nodeStates:    { ...lastFwdStep.nodeStates, [lastNodeId]: "returning" },
    distances:     { ...lastFwdStep.distances },
    rightVals:     { ...rightVals },
    criticalEdges: new Set(),
    description:   `Regreso desde ${nodes.find(n => n.id === lastNodeId)?.name || `V${lastNodeId}`}. LS = ${rightVals[lastNodeId]}.`
  });

  for (let i = 1; i < processOrder.length; i++) {
    const nodeId   = processOrder[i];
    const lastStep = steps[steps.length - 1];
    const nodeName = nodes.find(n => n.id === nodeId)?.name || `V${nodeId}`;

    const candidates = [];

    edges.forEach(e => {
      let successorId = null;
      if (e.type === "Dirigido" && e.from === nodeId) {
        successorId = e.to;
      } else if (e.type !== "Dirigido") {
        if (e.from === nodeId) successorId = e.to;
        else if (e.to === nodeId) successorId = e.from;
      }

      if (successorId === null) return;
      if (rightVals[successorId] === null) return;

      const w      = Number(e.weight) || 0;
      const result = rightVals[successorId] - w;
      const succName = nodes.find(n => n.id === successorId)?.name || `V${successorId}`;
      candidates.push({ value: result, succName, weight: w, succLS: rightVals[successorId] });
    });

    const chosenRight = candidates.length > 0
      ? Math.min(...candidates.map(c => c.value))
      : finalDist[nodeId];

    rightVals[nodeId] = chosenRight;

    const desc = candidates.length > 1
      ? `${nodeName} — [${candidates.map(c => `${c.succLS}-${c.weight}=${c.value}`).join(", ")}] → LS = ${chosenRight}.`
      : candidates.length === 1
        ? `${nodeName} — ${candidates[0].succLS} - ${candidates[0].weight} = ${chosenRight}.`
        : `${nodeName} — LS = ${chosenRight}.`;

    steps.push({
      nodeStates:    { ...lastStep.nodeStates, [nodeId]: "returning" },
      distances:     { ...lastStep.distances },
      rightVals:     { ...rightVals },
      criticalEdges: new Set(lastStep.criticalEdges),
      description:   desc
    });
  }

  // ── Fase 3: holgura y rutas críticas ─────────────────────────
  // h = d - a - att
  // [a/b] →att→ [c/d]
  // a = ES origen, d = LS destino, att = peso arista
  const lastPhase2 = steps[steps.length - 1];
  const criticalEdges = new Set();
  const criticalNodes = new Set();

  edges.forEach(e => {
    const fromNode = nodes.find(n => n.id === e.from);
    const toNode   = nodes.find(n => n.id === e.to);
    if (!fromNode || !toNode) return;

    const a   = lastPhase2.distances[e.from];   // ES origen
    const d   = rightVals[e.to];                // LS destino
    const att = Number(e.weight) || 0;
    const h   = d - a - att;

    if (h === 0) {
      criticalEdges.add(e.id);
      criticalNodes.add(e.from);
      criticalNodes.add(e.to);
    }
  });

  // Paso final mostrando rutas críticas
  const finalNodeStates = { ...lastPhase2.nodeStates };
  criticalNodes.forEach(id => {
    finalNodeStates[id] = "critical";
  });

  steps.push({
    nodeStates:    finalNodeStates,
    distances:     { ...lastPhase2.distances },
    rightVals:     { ...rightVals },
    criticalEdges: criticalEdges,
    description:   `Rutas críticas identificadas — holgura = LS_destino - ES_origen - peso = 0.`
  });

  return steps;
}

export default function Execute({ nodes, edges, source, target }) {
  const steps      = useRef(buildSteps(nodes, edges, Number(source), Number(target)));
  const [stepIndex, setStepIndex] = useState(0);
  const [playing,   setPlaying]   = useState(false);
  const [speed,     setSpeed]     = useState(800);
  const intervalRef = useRef(null);

  const currentStep = steps.current[stepIndex] || steps.current[0];
  const totalSteps  = steps.current.length;

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setStepIndex(prev => {
          if (prev >= totalSteps - 1) { setPlaying(false); return prev; }
          return prev + 1;
        });
      }, speed);
    }
    return () => clearInterval(intervalRef.current);
  }, [playing, speed, totalSteps]);

  function handlePrev()      { setPlaying(false); setStepIndex(p => Math.max(0, p - 1)); }
  function handleNext()      { setPlaying(false); setStepIndex(p => Math.min(totalSteps - 1, p + 1)); }
  function handlePlayPause() { if (stepIndex >= totalSteps - 1) setStepIndex(0); setPlaying(p => !p); }
  function handleReset()     { setPlaying(false); setStepIndex(0); }

  if (!currentStep) return null;

  return (
    <div className="exec-wrapper">
      <div className="exec-controls">
        <button className="exec-btn" onClick={handleReset}>⏮</button>
        <button className="exec-btn" onClick={handlePrev} disabled={stepIndex === 0}>◀</button>
        <button className="exec-btn exec-btn-play" onClick={handlePlayPause}>
          {playing ? "⏸ Pausar" : "▶ Play"}
        </button>
        <button className="exec-btn" onClick={handleNext} disabled={stepIndex >= totalSteps - 1}>▶</button>
        <div className="exec-speed-wrapper">
          <span className="exec-speed-label">Velocidad</span>
          <input type="range" min={200} max={2000} step={100} value={speed}
            onChange={e => setSpeed(Number(e.target.value))} className="exec-slider" />
          <span className="exec-speed-val">{speed}ms</span>
        </div>
        <span className="exec-step-counter">Paso {stepIndex + 1} / {totalSteps}</span>
      </div>

      <div className="exec-description">{currentStep.description}</div>

      <div className="exec-canvas-wrapper">
        <svg width="2500" height="100%" style={{ display: "block" }}>
          <defs>
            <marker id="arrow-exec" markerWidth="10" markerHeight="10" refX="20" refY="3" orient="auto">
              <path d="M0,0 L0,6 L9,3 z" fill="#660000" />
            </marker>
            <marker id="arrow-critical" markerWidth="10" markerHeight="10" refX="20" refY="3" orient="auto">
              <path d="M0,0 L0,6 L9,3 z" fill="#e74c3c" />
            </marker>
          </defs>

          {edges.map(edge => {
            const fromNode = nodes.find(n => n.id === edge.from);
            const toNode   = nodes.find(n => n.id === edge.to);
            if (!fromNode || !toNode) return null;
            const isCritical = currentStep.criticalEdges?.has(edge.id) ?? false;
            return (
              <EdgeAnimated
                key={edge.id}
                edge={{ ...edge, from: fromNode, to: toNode }}
                edges={edges}
                nodes={nodes}
                isCritical={isCritical}
                distances={currentStep.distances}
                rightVals={currentStep.rightVals}
              />
            );
          })}

          {nodes.map(node => (
            <NodeAnimated
              key={node.id}
              node={node}
              state={currentStep.nodeStates[node.id] || "unvisited"}
              distValue={currentStep.distances[node.id]}
              rightValue={currentStep.rightVals[node.id]}
            />
          ))}
        </svg>
      </div>

      <div className="exec-legend">
        <span className="exec-legend-item">
          <span className="exec-legend-dot" style={{ background: "#4a90d9" }} /> Sin visitar
        </span>
        <span className="exec-legend-item">
          <span className="exec-legend-dot" style={{ background: "#27ae60" }} /> Visitado
        </span>
        <span className="exec-legend-item">
          <span className="exec-legend-dot" style={{ background: "#f0a500" }} /> Regreso
        </span>
        <span className="exec-legend-item">
          <span className="exec-legend-dot" style={{ background: "#e74c3c" }} /> Ruta crítica
        </span>
      </div>
    </div>
  );
}