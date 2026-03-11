import "./AdjacencyMatrix.css";

export default function AdjacencyMatrix({ nodes, edges, onClose }) {
  if (!nodes || nodes.length === 0) {
    return (
      <div className="adjacency-panel">
        <div className="adjacency-header">
          <h3>Matriz de Adyacencia</h3>
          <button className="adjacency-close" onClick={onClose}>✕</button>
        </div>
        <p className="adjacency-empty">No hay vértices en el grafo.</p>
      </div>
    );
  }


  const n = nodes.length;


  const matrix = Array.from({ length: n }, () => Array(n).fill(0));

  edges.forEach(edge => {
    if (!edge.to) return;

    const fromIndex = nodes.findIndex(n => n.id === edge.from);
    const toIndex   = nodes.findIndex(n => n.id === edge.to);
    if (fromIndex === -1 || toIndex === -1) return;

    const peso = edge.weight !== undefined && edge.weight !== "" ? Number(edge.weight) : 1;

    if (edge.type === "Dirigido") {
      matrix[fromIndex][toIndex] += peso;
    } else {

      matrix[fromIndex][toIndex] += peso;
      if (fromIndex !== toIndex) {
        matrix[toIndex][fromIndex] += peso;
      }
    }
  });


  const rowSums    = matrix.map(row => row.reduce((a, b) => a + b, 0));
  const colSums    = matrix[0].map((_, colIdx) => matrix.reduce((sum, row) => sum + row[colIdx], 0));


  const rowCount   = matrix.map(row => row.filter(v => v !== 0).length);
  const colCount   = matrix[0].map((_, colIdx) => matrix.reduce((cnt, row) => cnt + (row[colIdx] !== 0 ? 1 : 0), 0));

  const getLabel = (node) => node.name && node.name.trim() !== "" ? node.name : `v${node.id}`;

  return (
    <div className="adjacency-panel">
      <div className="adjacency-header">
        <h3>Matriz de Adyacencia</h3>
        <button className="adjacency-close" onClick={onClose}>✕</button>
      </div>

      <div className="adjacency-scroll">
        <table className="adjacency-table">
          <thead>
            <tr>

              <th className="corner-cell"></th>
              {nodes.map(node => (
                <th key={node.id} className="col-header">{getLabel(node)}</th>
              ))}
              <th className="sum-header">Σ fila</th>
              <th className="sum-header"># fila</th>
            </tr>
          </thead>
          <tbody>
            {nodes.map((node, rowIdx) => (
              <tr key={node.id}>
                <td className="row-header">{getLabel(node)}</td>
                {matrix[rowIdx].map((val, colIdx) => (
                  <td
                    key={colIdx}
                    className={`matrix-cell ${val !== 0 ? "cell-active" : "cell-zero"} ${rowIdx === colIdx ? "cell-diagonal" : ""}`}
                  >
                    {val}
                  </td>
                ))}
                <td className="sum-cell">{rowSums[rowIdx]}</td>
                <td className="count-cell">{rowCount[rowIdx]}</td>
              </tr>
            ))}


            <tr className="summary-row">
              <td className="row-header">Σ col</td>
              {colSums.map((s, i) => (
                <td key={i} className="sum-cell">{s}</td>
              ))}
              <td className="total-cell">{rowSums.reduce((a, b) => a + b, 0)}</td>
              <td className="total-cell">—</td>
            </tr>


            <tr className="summary-row">
              <td className="row-header"># col</td>
              {colCount.map((c, i) => (
                <td key={i} className="count-cell">{c}</td>
              ))}
              <td className="total-cell">—</td>
              <td className="total-cell">{colCount.reduce((a, b) => a + b, 0)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="adjacency-legend">
        <span className="legend-item"><span className="legend-box cell-active"></span> Conexión</span>
        <span className="legend-item"><span className="legend-box cell-diagonal"></span> Diagonal</span>
        <span className="legend-item"><span className="legend-box cell-zero"></span> Sin conexión</span>
      </div>
    </div>
  );
}
