import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import "./algoritmo.css";
const slides = [
  {
    id: 0,
    type: "hero",
  },
  {
    id: 1,
    title: "¿Qué es un Grafo?",
    icon: "⬡",
    content: (
      <>
        <p className="slide-lead">
          Un grafo es una representación matemática de un conjunto de objetos
          —llamados <strong>vértices</strong> o nodos— unidos por enlaces
          llamados <strong>aristas</strong> o arcos.
        </p>
        <div className="formula-box">
          <span className="formula-label">Definición formal</span>
          <span className="formula">G = (V, E)</span>
          <span className="formula-desc">
            <em>V</em> — conjunto finito de vértices &nbsp;|&nbsp; <em>E</em> —
            conjunto de aristas
          </span>
        </div>
        <div className="tags-row">
          {[
            "No dirigido",
            "Dirigido (Dígrafo)",
            "Ponderado",
            "Multigrafo",
            "Hipergrafo",
          ].map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>
      </>
    ),
  },
  {
    id: 2,
    title: "Propiedades Fundamentales",
    icon: "◈",
    content: (
      <>
        <div className="props-grid">
          <div className="prop-card">
            <span className="prop-icon">◎</span>
            <h3>Grado d(v)</h3>
            <p>
              Número de aristas que inciden en un vértice. En dígrafos se divide
              en grado de <em>entrada</em> y de <em>salida</em>.
            </p>
          </div>
          <div className="prop-card">
            <span className="prop-icon">⤢</span>
            <h3>Conectividad</h3>
            <p>
              Un grafo es <em>conexo</em> si existe al menos un camino entre
              cualquier par de vértices.
            </p>
          </div>
          <div className="prop-card">
            <span className="prop-icon">⟳</span>
            <h3>Ciclos y Caminos</h3>
            <p>
              Un <em>camino elemental</em> no repite vértices. Un{" "}
              <em>ciclo hamiltoniano</em> recorre todos los vértices exactamente
              una vez.
            </p>
          </div>
          <div className="prop-card">
            <span className="prop-icon">≅</span>
            <h3>Isomorfismo</h3>
            <p>
              Dos grafos son isomorfos si tienen la misma estructura subyacente,
              aunque se dibujen diferente.
            </p>
          </div>
          <div className="prop-card">
            <span className="prop-icon">⊡</span>
            <h3>Planaridad</h3>
            <p>
              Capacidad de dibujar un grafo en un plano sin que sus aristas se
              crucen. Vital en diseño de circuitos.
            </p>
          </div>
          <div className="prop-card">
            <span className="prop-icon">⬡</span>
            <h3>Regularidad</h3>
            <p>
              Un grafo es <em>regular</em> cuando todos sus vértices tienen el
              mismo grado.
            </p>
          </div>
        </div>
      </>
    ),
  },
  {
    id: 3,
    title: "Ecuaciones Matemáticas",
    icon: "∑",
    content: (
      <>
        <div className="eq-list">
          <div className="eq-item">
            <div className="eq-name">Lema del Apretón de Manos</div>
            <div className="eq-formula">∑ d(v) = 2|E|</div>
            <div className="eq-desc">
              La suma de los grados de todos los vértices es igual al doble del
              número de aristas. El número de vértices con grado impar siempre
              es par.
            </div>
          </div>
          <div className="eq-item">
            <div className="eq-name">Fórmula de Euler — Grafos Planares</div>
            <div className="eq-formula">V − E + F = 2</div>
            <div className="eq-desc">
              Para un grafo conexo y planar: <em>V</em> vértices, <em>E</em>{" "}
              aristas y <em>F</em> caras guardan siempre esta relación
              constante.
            </div>
          </div>
          <div className="eq-item">
            <div className="eq-name">Aristas en un Grafo Completo Kₙ</div>
            <div className="eq-formula">|E| = n(n − 1) / 2</div>
            <div className="eq-desc">
              Cuando cada vértice está conectado con todos los demás, el número
              de aristas crece combinatoriamente.
            </div>
          </div>
          <div className="eq-item">
            <div className="eq-name">Grado Medio de la Red</div>
            <div className="eq-formula">⟨k⟩ = 2L / N</div>
            <div className="eq-desc">
              Compara la densidad de conexiones entre redes de distinto tamaño.{" "}
              <em>L</em> = aristas, <em>N</em> = nodos.
            </div>
          </div>
        </div>
      </>
    ),
  },
  {
    id: 4,
    title: "Importancia en el Mundo Real",
    icon: "◉",
    content: (
      <>
        <p className="slide-lead">
          Los grafos modelan prácticamente cualquier sistema con entidades
          interconectadas, transformando industrias enteras.
        </p>
        <div className="importance-grid">
          <div className="imp-card">
            <span className="imp-icon">🚚</span>
            <h3>Logística y Transporte</h3>
            <p>
              Optimización de rutas de entrega con Dijkstra y Floyd-Warshall:
              −8% en tiempo de trayecto y −5% en costos operativos.
            </p>
          </div>
          <div className="imp-card">
            <span className="imp-icon">🌐</span>
            <h3>Redes Sociales</h3>
            <p>
              Cada usuario es un nodo, cada interacción una arista. Permite
              identificar influencers, comunidades y recomendar conexiones.
            </p>
          </div>
          <div className="imp-card">
            <span className="imp-icon">🔒</span>
            <h3>Detección de Fraude</h3>
            <p>
              Ciclos de dinero entre cuentas se detectan como ciclos en grafos
              de transacciones financieras.
            </p>
          </div>
          <div className="imp-card">
            <span className="imp-icon">🧬</span>
            <h3>Biología y Medicina</h3>
            <p>
              Modelado de conexiones neuronales, propagación de enfermedades y
              análisis de ecosistemas.
            </p>
          </div>
        </div>
      </>
    ),
  },
  {
    id: 5,
    title: "¿Qué es un Algoritmo?",
    icon: "⊳",
    content: (
      <>
        <p className="slide-lead">
          Un algoritmo es un conjunto{" "}
          <strong>finito, ordenado y preciso</strong> de instrucciones lógicas
          que transforma una <em>entrada</em> en una <em>salida</em> para
          resolver un problema específico.
        </p>
        <div className="algo-chars">
          <div className="char">
            <span className="char-num">01</span>
            <span className="char-title">Finitud</span>
            <span className="char-desc">
              Inicio y fin claros, número limitado de pasos.
            </span>
          </div>
          <div className="char">
            <span className="char-num">02</span>
            <span className="char-title">Definición</span>
            <span className="char-desc">
              Mismas entradas → siempre el mismo resultado.
            </span>
          </div>
          <div className="char">
            <span className="char-num">03</span>
            <span className="char-title">Precisión</span>
            <span className="char-desc">
              Instrucciones en orden lógico estricto.
            </span>
          </div>
          <div className="char">
            <span className="char-num">04</span>
            <span className="char-title">Eficiencia</span>
            <span className="char-desc">
              Optimiza tiempo de CPU y uso de memoria.
            </span>
          </div>
        </div>
        <div className="algo-types">
          <span className="algo-tag">BFS — Anchura</span>
          <span className="algo-tag">DFS — Profundidad</span>
          <span className="algo-tag">Dijkstra</span>
          <span className="algo-tag">Bellman-Ford</span>
          <span className="algo-tag">Floyd-Warshall</span>
          <span className="algo-tag">Ford-Fulkerson</span>
        </div>
      </>
    ),
  },
];

const TOTAL = slides.length;

export default function Algoritmo() {
  const [slide, setSlide] = useState(0);
  const navigate = useNavigate()
  const goToGraph = () => {
  navigate("/graph");
  };

  const next = () => setSlide((s) => Math.min(s + 1, TOTAL - 1));
  const prev = () => setSlide((s) => Math.max(s - 1, 0));

  const current = slides[slide];

  return (
    <>
      <section id="algoritmo">
        <video className="video-bg" autoPlay loop muted playsInline>
          <source
            src="https://res.cloudinary.com/dj5kb9v78/video/upload/v1771434686/fondo_rspv7w.mp4"
            type="video/mp4"
          />
        </video>

        {/* Counter */}
        <span className="counter">
          {String(slide + 1).padStart(2, "0")} /{" "}
          {String(TOTAL).padStart(2, "0")}
        </span>

        {/* Arrows */}
        {slide > 0 && (
          <button className="arrow left" onClick={prev}>
            ◀
          </button>
        )}
        {slide < TOTAL - 1 && (
          <button className="arrow right" onClick={next}>
            ▶
          </button>
        )}

        {/* Dots */}
        <div className="dots">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`dot ${i === slide ? "active" : ""}`}
              onClick={() => setSlide(i)}
            />
          ))}
        </div>

        {/* Slide track */}
        <div
          className="slide-track"
          style={{ transform: `translateX(-${slide * 100}vw)` }}
        >
          {/* SLIDE 0 — HERO */}
          <div className="slide-panel">
            <div className="hero-content">
              <h1>PenguinGraph</h1>
              <p className="hero-sub">
                Teoría de Grafos &amp; Algoritmos — Visualización Interactiva
              </p>
              <div className="hero-btns">
                <button className="btn-primary" onClick={goToGraph}>
                  Comenzar a crear
                </button>
                <button className="btn-secondary" onClick={next}>
                  Aprender Más
                </button>
              </div>
            </div>
          </div>

          {/* SLIDES 1–5 */}
          {slides.slice(1).map((s) => (
            <div key={s.id} className="slide-panel">
              <div className="slide-inner">
                <div className="slide-header">
                  <span className="slide-icon">{s.icon}</span>
                  <h2>{s.title}</h2>
                </div>
                {s.content}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
