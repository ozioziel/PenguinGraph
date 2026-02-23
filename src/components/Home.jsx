import "./Home.css"
import { useNavigate } from "react-router-dom";
export default function Home() {
    const navigate = useNavigate()

    const goToAlgoritmos = () => {
        navigate("/algorithms")
  };
  return (
    <section id="home">
      <div className="video-bg">
        
      <video autoPlay loop muted>
      <source src="https://res.cloudinary.com/dj5kb9v78/video/upload/v1771434311/assets/intro_tu8teq.mp4" type="video/mp4" />

      Bienvenido
      </video>
      </div>
      <div className="content">
        <h1>BIENVENIDO</h1>
        <p>Docente: Ph.D. Vicente Yamil Cárdenas Miguel</p>
        <p>Estudiante: Oziel Rodman Ramos Torrez</p>

        <div>
          <button className="btn-white" onClick={()=> goToAlgoritmos()}> Ingresar </button>
        </div>
        <br /><br /><br /> <br />
        <p>Asignatura: [MAT-36] ANÁLISIS DE ALGORITMOS </p>
        <p>2026</p>
      </div>
    </section>
  );
}
