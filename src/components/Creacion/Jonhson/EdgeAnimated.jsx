export default function EdgeAnimated({ edge, edges, nodes, isCritical = false, distances = {}, rightVals = {} })  {
  const from = edge.from;
  const to   = edge.to;
  if (!from || !to) return null;

  const strokeColor = isCritical ? "#e74c3c" : "#660000";
  const strokeWidth = isCritical ? 4 : 2;
  const markerEnd   = edge.type === "Dirigido"
    ? (isCritical ? "url(#arrow-critical)" : "url(#arrow-exec)")
    : undefined;

  // ... resto igual, solo cambia stroke y strokeWidth en el path/circle

  const isLoop    = from.id === to.id;
  const isDir     = edge.type === "Dirigido";
  const esOrigen = distances[edge.from.id] ?? null;
  const lsDestino = rightVals[edge.to.id] ?? null;
  const peso = Number(edge.weight) || 0;
  const hValue = (esOrigen !== null && lsDestino !== null)
    ? lsDestino - esOrigen - peso
    : "–";
  const badgeW = 42, badgeH = 18;

  if (isLoop) {
    const radius = 30;
    const cx = from.x, cy = from.y - radius;
    const bX = cx + radius + 6, bY = cy + 2;
    return (
      <g>
        <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#660000" strokeWidth={2} markerEnd={markerEnd} />
        {edge.weight !== 0 && <text x={bX} y={cy - 8} fill="#333" fontSize={11}>{edge.weight}</text>}
        <rect x={bX} y={bY - badgeH / 2} width={badgeW} height={badgeH} rx={4} fill="#2c6fad" />
        <text x={bX + badgeW / 2} y={bY + 5} textAnchor="middle" fill="white" fontSize={11} fontWeight="bold">
          h = {hValue}
        </text>
      </g>
    );
  }

  const parallelEdges = edges
    .filter(e => (e.from === from.id && e.to === to.id) || (e.from === to.id && e.to === from.id))
    .sort((a, b) => a.id - b.id);

  const edgeIndex  = parallelEdges.findIndex(e => e.id === edge.id);
  const totalEdges = parallelEdges.length;
  const nFrom = from.id < to.id ? from : to;
  const nTo   = from.id < to.id ? to   : from;
  const dx = nTo.x - nFrom.x, dy = nTo.y - nFrom.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  const px = -dy / len, py = dx / len;
  const gap = 50;
  let off = 0;
  if (totalEdges === 1) off = 0;
  else if (totalEdges % 2 === 0) off = (edgeIndex - (totalEdges - 1) / 2) * gap;
  else { const s = edgeIndex - (totalEdges - 1) / 2; off = s === 0 ? gap * 0.4 : s * gap; }

  const cpX = (from.x + to.x) / 2 + px * off;
  const cpY = (from.y + to.y) / 2 + py * off;
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
      <rect x={lX - badgeW / 2} y={lY - badgeH / 2} width={badgeW} height={badgeH} rx={4} fill="#2c6fad" />
      <text x={lX} y={lY + 5} textAnchor="middle" fill="white" fontSize={11} fontWeight="bold">
        h = {hValue}
      </text>
    </g>
  );
}