import "./Home.css";

import { NavLink } from "react-router-dom";

export function HomePage() {
  return (
    <section id="home">
      <div className="video-bg">
        <video autoPlay loop muted playsInline>
          <source
            src="https://res.cloudinary.com/dj5kb9v78/video/upload/v1771434311/assets/intro_tu8teq.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      <div className="content">
        <h1>BIENVENIDO</h1>

        <div className="info-top">
          <p>Docente: Ph.D. Vicente Yamil Cárdenas Miguel</p>
          <p>Estudiantes:</p>
          <ul>
            <li>Luis Daniel Rojas Caceres</li>
            <li>Oziel Rodman Ramos Torrez</li>
            <li>Diana Tatiana Pattzy Gomez</li>
            <li>Daniel Boris Rueda Muñoz</li>
            <li>Frederick Aguirre</li>
          </ul>
        </div>

        <button className="btn-white">
          <NavLink to="/algorithms">Ingresar</NavLink>
        </button>

        <div className="info-bottom">
          <p>Asignatura: [MAT-36] ANÁLISIS DE ALGORITMOS</p>
          <p>2026</p>
        </div>
      </div>
    </section>
  );
}
