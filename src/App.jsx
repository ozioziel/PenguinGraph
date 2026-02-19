import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Algoritmo from "./components/Algortimo-Paneles/Algoritmo";
import Grafo from "./components/Grafo";

import { BrowserRouter } from "react-router-dom";
import { MyRoutes } from "./routers/routes";

function App() {
  return (
    <BrowserRouter>
      <MyRoutes />
    </BrowserRouter>
  );
}

export default App;
