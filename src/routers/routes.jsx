import { Routes, Route } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";

import { AlgoritmoPage } from "../pages/AlgoritmoPage";
import { HomePage } from "../pages/HomePage";
import { GrafoPage } from "../pages/GrafoPage";

export function MyRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/algorithms" element={<AlgoritmoPage />} />
        <Route path="/graph" element={<GrafoPage />} />
      </Route>
    </Routes>
  );
}
