import { NavLink } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">Analisis de Algoritmos</div>

      <ul className="nav-links">
        <li>
          <NavLink to="/">Inicio</NavLink>
        </li>
        <li>
          <NavLink to="/algorithms">Algoritmos</NavLink>
        </li>
        <li>
          <NavLink to="/graph">Grafo</NavLink>
        </li>
      </ul>
    </nav>
  );
}
