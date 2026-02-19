export default function Node({ node }) {

  const radius = 20
  const offsetLabel = 10
  return (
    <>
    <circle
      cx={node.x}
      cy={node.y}
      r={radius}
      fill="#4da6ff"
      stroke="#003366"
      strokeWidth="2"
    />
    <text
      x = {node.x}
      y={node.y + radius + offsetLabel}
      textAnchor="middle"
      dominantBaseline="hanging"
      fill="black"
      fontSize={12}
      fontWeight="bold"
    >
        [{node.id}] {node.name}
    </text>

    <text
      x = {node.x}
      y = {node.y}
      textAnchor = "middle"
      dominantBaseline="middle"
      fill = "black"
      fontSize={16}
      fontWeight="bold"
    >
      {node.value}
    </text>
    </>
  );
}
