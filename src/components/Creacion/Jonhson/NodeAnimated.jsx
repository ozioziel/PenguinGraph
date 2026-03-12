export default function NodeAnimated({ node, state, distValue, rightValue }) {
const fill   = state === "critical"   ? "#e74c3c"
               : state === "visited"    ? "#27ae60"
               : state === "returning"  ? "#f0a500"
               : "#4a90d9";
  const stroke = state === "critical"   ? "#a93226"
               : state === "visited"    ? "#1a7a40"
               : state === "returning"  ? "#c07800"
               : "#1a4a8a";
  const halfW = 25, boxH = 22;
  const boxY = node.y + 24;

  const leftLabel = state === "visited" || state === "returning"
    ? (distValue === Infinity ? "∞" : String(distValue))
    : "-";

  const rightLabel = state === "returning" && rightValue !== null
    ? String(rightValue)
    : "-";

  return (
    <g>
      <circle cx={node.x} cy={node.y} r={20} fill={fill} stroke={stroke} strokeWidth={2.5} />
      <text x={node.x} y={node.y + 5} textAnchor="middle" fill="white" fontSize={12} fontWeight="bold">
        {node.name || node.id}
      </text>

      <rect x={node.x - halfW} y={boxY} width={50} height={boxH} fill="white" stroke={stroke} strokeWidth={1.5} rx={3} />
      <line x1={node.x} y1={boxY} x2={node.x} y2={boxY + boxH} stroke={stroke} strokeWidth={1.5} />

      <text x={node.x - halfW / 2} y={boxY + 15} textAnchor="middle"
        fill={state === "visited" ? "#1a7a40" : state === "returning" ? "#c07800" : "#888"}
        fontSize={11} fontWeight="bold">
        {leftLabel}
      </text>

      <text x={node.x + halfW / 2} y={boxY + 15} textAnchor="middle"
        fill={state === "returning" ? "#c07800" : "#888"}
        fontSize={11} fontWeight="bold">
        {rightLabel}
      </text>
    </g>
  );
}