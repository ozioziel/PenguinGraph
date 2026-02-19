import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">Analisis de Algoritmos</div>

      <ul className="nav-links">
        <li><a href="#home">Inicio</a></li>
        <li><a href="#algoritmo">Algoritmos</a></li>
        <li><a href="#grafo">Grafo</a></li>
      </ul>
    </nav>
  );
}
