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
