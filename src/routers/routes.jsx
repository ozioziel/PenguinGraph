import { Routes, Route } from "react-router-dom";
import Grafo from "../components/Grafo";
import Algoritmo from "../components/Algortimo-Paneles/Algoritmo";
import Home from "../components/Home";
import { MainLayout } from "../components/MainLayout";

export function MyRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/algorithms" element={<Algoritmo />} />
        <Route path="/graph" element={<Grafo />} />
      </Route>
    </Routes>
  );
}
