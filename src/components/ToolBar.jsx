import { useState } from "react";
import styled from "styled-components";

import { LuMousePointer2 } from "react-icons/lu";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";

const PING_NORMAL =
  "https://res.cloudinary.com/dj5kb9v78/image/upload/v1771434276/assets/pinguino1_era4wq.png";
const PING_HOVER =
  "https://res.cloudinary.com/dj5kb9v78/image/upload/v1771434276/assets/pinguino2_t101hd.png";
const PING_ACTIVE =
  "https://res.cloudinary.com/dj5kb9v78/image/upload/v1771434276/assets/pinguino3_n7pbmh.png";

export function ToolBar({ herramienta, setHerramienta, onClear }) {
  const [pingSrc, setPingSrc] = useState(PING_NORMAL);

  const handleKeyDown = (e) => {
    if (e.key === "1") {
      setHerramienta(1);
    }
    if (e.key === "2") {
      setHerramienta(2);
    }
    if (e.key === "3") {
      setHerramienta(3);
    }
  };

  return (
    <Container>
      <h2>Herramientas</h2>
      <div className="toolbar-content">
        <button
          className={herramienta === 1 ? "active" : ""}
          onClick={() => setHerramienta(1)}
          onKeyDown={handleKeyDown}
        >
          <LuMousePointer2 />
        </button>
        <button
          className={herramienta === 2 ? "active" : ""}
          onClick={() => setHerramienta(2)}
          onKeyDown={handleKeyDown}
        >
          <FaEdit id="SvgEdit" />
        </button>
        <button
          className={herramienta === 3 ? "active" : ""}
          onClick={() => setHerramienta(3)}
          onKeyDown={handleKeyDown}
        >
          <MdDeleteForever />
        </button>

        <img
          src={pingSrc}
          alt="Limpiar todo"
          onMouseEnter={() => setPingSrc(PING_HOVER)}
          onMouseLeave={() => setPingSrc(PING_NORMAL)}
          onClick={() => {
            onClear();
            setPingSrc(PING_ACTIVE);
            setTimeout(() => setPingSrc(PING_NORMAL), 600);
          }}
        />
      </div>
    </Container>
  );
}

const Container = styled.div`
  position: sticky;
  top: 110px;
  flex-shrink: 0;
  padding: 22px 16px;
  box-sizing: border-box;
  background: rgba(2, 14, 26, 0.75);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(79, 195, 247, 0.18);
  border-top: 2px solid #4fc3f7;
  display: flex;
  flex-direction: column;
  gap: 20px;
  font-family: "Syne", sans-serif;

  h2 {
    margin: 0;
    font-family: "Space Mono", monospace;
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #4fc3f7;
    text-align: center;
    padding-bottom: 16px;
    border-bottom: 1px solid rgba(79, 195, 247, 0.15);
  }

  .toolbar-content {
    display: flex;
    flex-direction: column;
    gap: 5px;
    align-items: center;

    button {
      width: 100%;
      margin: 0;
      padding: 10px 14px;
      box-sizing: border-box;
      background: transparent;
      border: 1px solid rgba(79, 195, 247, 0.12);
      border-left: 2px solid transparent;
      color: #6a9ab8;
      font-family: "Syne", sans-serif;
      font-size: 0.83rem;
      font-weight: 600;
      letter-spacing: 0.04em;
      text-align: left;
      cursor: pointer;
      transition:
        border-color 0.18s ease,
        border-left-color 0.18s ease,
        color 0.18s ease,
        background 0.18s ease,
        padding-left 0.18s ease;

      display: flex;
      justify-content: center;
      align-items: center;
    }

    svg {
      width: 40px;
      height: 40px;
      display: flex;
    }

    #SvgEdit {
      height: 30px;
    }

    button:hover {
      border-left-color: #4fc3f7;
      border-color: rgba(79, 195, 247, 0.28);
      background: rgba(79, 195, 247, 0.06);
      color: #e8f4ff;
      padding-left: 20px;
    }

    button:active {
      background: rgba(79, 195, 247, 0.13);
      color: #ffffff;
    }

    button.active {
      border-left-color: #4fc3f7;
      border-color: rgba(79, 195, 247, 0.35);
      background: rgba(79, 195, 247, 0.1);
      color: #ffffff;
      padding-left: 20px;
    }

    img {
      margin-top: 12px;
      width: 50px;
      cursor: pointer;
      transition:
        transform 0.2s ease,
        filter 0.2s ease;
      filter: drop-shadow(0 0 0px rgba(79, 195, 247, 0));
    }

    img:hover {
      transform: scale(1.1) rotate(-5deg);
      filter: drop-shadow(0 0 8px rgba(79, 195, 247, 0.55));
    }

    img:active {
      transform: scale(0.93);
    }
  }
`;
