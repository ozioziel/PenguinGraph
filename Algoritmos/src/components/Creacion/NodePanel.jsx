import "./Panel.css"
export default function NodePanel({node, position, onClose, onChange}){
    if (!node || !position) return null;
    
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
        <h4 className="title">Nodo {node.id} {node.name}</h4>

        <div className = "field" style = {{marginBottom: "8px"}}>
            <label> Nombre </label>
            <input value = {node.name} onChange = {(e) => onChange(node.id, {name: e.target.value})} />
        </div>

        <div className = "field">
            <label> Valor </label>
            <input value = {node.value} onChange={(e) => onChange(node.id, {value: e.target.value})} />
        </div>

        <div className = "field">
            <label>Grado </label>
            <span>{node.degree}</span>
        </div>

        
        <button className="close-btn" onClick = {onClose}> cerrar </button>

        </div>
        
    );
}