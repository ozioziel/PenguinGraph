export default function Edge({ edge, mousePos, edges }) {
  if (!edge) return null;

  const fromNode = edge.from;
  const toNode = edge.to;

  if (!fromNode) return null;


  if (!toNode && mousePos) {
    return (
      <line
        x1={fromNode.x}
        y1={fromNode.y}
        x2={mousePos.x}
        y2={mousePos.y}
        stroke="#003366"
        strokeWidth="2"
        strokeDasharray="6"
        markerEnd={edge.type === "Dirigido" ? "url(#arrow)" : undefined}
      />
    );
  }

  if (!toNode) return null;


  if (fromNode.id === toNode.id) {
    const loopEdges = edges
      ? edges
          .filter((e) => e.from.id === fromNode.id && e.to.id === fromNode.id)
          .sort((a, b) => a.id - b.id)
      : [];
    const loopIndex = loopEdges.findIndex((e) => e.id === edge.id);

    const baseRadius = 40;
    const radius = baseRadius + loopIndex * 35;


    
    const offset = -10;
    const startX = fromNode.x + offset;
    const startY = fromNode.y - offset;
    const endX = fromNode.x - offset;
    const endY = fromNode.y - offset;

    const cp1X = fromNode.x - radius;
    const cp1Y = fromNode.y - radius * 2;
    const cp2X = fromNode.x + radius;
    const cp2Y = fromNode.y - radius * 2;

    const pathData = `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;


    const t = 0.5;
    const curveCenterX = fromNode.x; 
    const curveCenterY =
      (1-t)*(1-t)*(1-t) * startY +
      3*(1-t)*(1-t)*t * cp1Y +
      3*(1-t)*t*t * cp2Y +
      t*t*t * endY;

    const rectWidth = 40;
    const rectHeight = 24;

    return (
      <>
        <path
          d={pathData}
          stroke="#660000"
          strokeWidth="2"
          fill="transparent"
          markerEnd={edge.type === "Dirigido" ? "url(#arrow)" : undefined}
        />
        {edge.weight !== undefined && (
          <>
            <rect
              x={curveCenterX - rectWidth / 2}
              y={curveCenterY - rectHeight / 2}
              width={rectWidth}
              height={rectHeight}
              fill="white"
              stroke="red"
              strokeWidth={2}
              rx={4}
            />
            <text
              x={curveCenterX}
              y={curveCenterY}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="black"
              fontSize="12"
              fontWeight="bold"
            >
              {edge.weight}
            </text>
          </>
        )}
        {edge.name && (
          <text
            x={curveCenterX}
            y={curveCenterY - rectHeight / 2 - 5} 
            textAnchor="middle"
            dominantBaseline="middle"
            fill="black"
            fontSize="12"
          >
            {edge.name}
          </text>
        )}
      </>
    );
  }


  const parallelEdges = edges
    ? edges
        .filter(
          (e) =>
            (e.from.id === fromNode.id && e.to.id === toNode.id) ||
            (e.from.id === toNode.id && e.to.id === fromNode.id)
        )
        .sort((a, b) => a.id - b.id)
    : [];

  const edgeIndex = parallelEdges.findIndex((e) => e.id === edge.id);
  const totalEdges = parallelEdges.length;


  const normalizedFrom = fromNode.id < toNode.id ? fromNode : toNode;
  const normalizedTo = fromNode.id < toNode.id ? toNode : fromNode;

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

  const cpX = (fromNode.x + toNode.x) / 2 + px * offsetAmount;
  const cpY = (fromNode.y + toNode.y) / 2 + py * offsetAmount;

  const pathData = `M ${fromNode.x} ${fromNode.y} Q ${cpX} ${cpY} ${toNode.x} ${toNode.y}`;

  const curveCenterX = 0.25 * fromNode.x + 0.5 * cpX + 0.25 * toNode.x;
  const curveCenterY = 0.25 * fromNode.y + 0.5 * cpY + 0.25 * toNode.y;

  const paddingX = 6;
  const paddingY = 4;
  const textWidth = String(edge.weight ?? "").length * 8 || 16;
  const textHeight = 15;

  return (
    <>
      <path
        d={pathData}
        stroke="#660000"
        strokeWidth="2"
        fill="transparent"
        markerEnd={edge.type === "Dirigido" ? "url(#arrow)" : undefined}
      />

      {edge.weight !== undefined && (
        <>
          <rect
            x={curveCenterX - textWidth / 2 - paddingX}
            y={curveCenterY - textHeight / 2 - paddingY}
            width={textWidth + 2 * paddingX}
            height={textHeight + 2 * paddingY}
            fill="white"
            stroke="red"
            strokeWidth={2}
            rx={4}
          />
          <text
            x={curveCenterX}
            y={curveCenterY}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="black"
            fontSize={textHeight}
            fontWeight="bold"
          >
            {edge.weight}
          </text>
        </>
      )}

      {edge.name && (
        <text
          x={curveCenterX}
          y={curveCenterY - 20}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#000"
          fontSize="14"
        >
          {edge.name}
        </text>
      )}
    </>
  );
}