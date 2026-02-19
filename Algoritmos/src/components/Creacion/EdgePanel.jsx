import "./panel.css"
export default function EdgePanel({edge, position, onClose, onChange}){
    if (!edge || !position) return null;
    
    return (
        <div className="panel"
            style = {{
                position: "fixed",
                left: position.x + 20,
                top: position.y + 20,
                background: "white",
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "10px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                minWidth: "180px"
            }} 
          
        >
        <h4 className="node-title">Arista {edge.id} {edge.name}</h4>

        <div className = "field" style = {{marginBottom: "8px"}}>
            <label> Nombre </label>
            <input  value = {edge.name|| ""} onChange = {(e) => onChange(edge.id, {name: e.target.value})} />
        </div>

        <div className = "field">
            <label> Peso </label>
            <input value = {edge.weight || ""} onChange={(e) => onChange(edge.id, {weight: e.target.value})} />
        </div>

        <div className = "field">
            <label> Tipo </label>
            <select className="select" value = {edge.type} onChange={(e) => onChange(edge.id, {type: e.target.value})}>
                <option value="Dirigido"> Dirigido </option>
                <option value="No Dirigido">No Dirigido</option>
            </select>
        </div>

        
        <button className="close-btn" onClick = {onClose}> cerrar </button>

        </div>
        
    );
}