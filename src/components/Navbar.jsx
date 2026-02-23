import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Container>
      <Logo>
        <NavLink to="/">
          <span className="logo-icon">⚙️</span>
          Análisis de Algoritmos
        </NavLink>
      </Logo>

      <HamburgerButton
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span className={menuOpen ? "open" : ""} />
        <span className={menuOpen ? "open" : ""} />
        <span className={menuOpen ? "open" : ""} />
      </HamburgerButton>

      <NavLinks $isOpen={menuOpen}>
        <li>
          <NavLink to="/" end onClick={() => setMenuOpen(false)}>
            Inicio
          </NavLink>
        </li>
        <li>
          <NavLink to="/algorithms" onClick={() => setMenuOpen(false)}>
            Algoritmos
          </NavLink>
        </li>
        <li>
          <NavLink to="/graph" onClick={() => setMenuOpen(false)}>
            Grafo
          </NavLink>
        </li>
      </NavLinks>
    </Container>
  );
}

const Container = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
  background: linear-gradient(135deg, #0b1d2a 0%, #102f44 100%);
  color: #e6f7ff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  z-index: 100;
  border-bottom: 1px solid rgba(127, 223, 255, 0.1);
`;

const Logo = styled.div`
  font-size: 1.3rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: #bfe9ff;
  display: flex;
  align-items: center;
  gap: 10px;
  user-select: none;

  .logo-icon {
    font-size: 1.5rem;
  }
  a {
    text-decoration: none;
    color: inherit;
  }
`;

const NavLinks = styled.ul`
  list-style: none;
  display: flex;
  gap: 8px;
  margin: 0;
  padding: 0;

  a {
    text-decoration: none;
    color: #a8d8ea;
    font-weight: 500;
    font-size: 0.95rem;
    padding: 8px 16px;
    border-radius: 8px;
    transition: all 0.25s ease;
    position: relative;
    letter-spacing: 0.5px;

    &:hover {
      color: #7fdfff;
      background: rgba(127, 223, 255, 0.08);
      text-shadow: 0 0 10px rgba(127, 223, 255, 0.5);
    }

    /* ✨ Estilo para el link ACTIVO */
    &.active {
      color: #7fdfff;
      background: rgba(127, 223, 255, 0.12);
      box-shadow: inset 0 0 0 1px rgba(127, 223, 255, 0.25);

      &::after {
        content: "";
        position: absolute;
        bottom: 2px;
        left: 16px;
        right: 16px;
        height: 2px;
        background: linear-gradient(90deg, transparent, #7fdfff, transparent);
        border-radius: 2px;
      }
    }
  }

  /* 📱 Responsive: menú hamburguesa */
  @media (max-width: 600px) {
    flex-direction: column;
    position: absolute;
    top: 64px;
    left: 0;
    width: 100%;
    background: #0b1d2a;
    padding: ${({ $isOpen }) => ($isOpen ? "16px 0" : "0")};
    max-height: ${({ $isOpen }) => ($isOpen ? "300px" : "0")};
    overflow: hidden;
    transition: all 0.3s ease;
    border-bottom: ${({ $isOpen }) =>
      $isOpen ? "1px solid rgba(127,223,255,0.1)" : "none"};
    gap: 4px;

    a {
      padding: 12px 24px;
      border-radius: 0;
      width: 100%;
    }
  }
`;

const HamburgerButton = styled.button`
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 24px;
  height: 18px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;

  span {
    display: block;
    height: 2px;
    width: 100%;
    background: #bfe9ff;
    border-radius: 2px;
    transition: all 0.3s ease;

    &.open:nth-child(1) {
      transform: translateY(8px) rotate(45deg);
    }
    &.open:nth-child(2) {
      opacity: 0;
    }
    &.open:nth-child(3) {
      transform: translateY(-8px) rotate(-45deg);
    }
  }

  @media (max-width: 600px) {
    display: flex;
  }
`;
