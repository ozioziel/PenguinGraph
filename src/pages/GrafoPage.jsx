import { useState } from "react";

import { Graph } from "../components/Graph";
import { ToolBar } from "../components/ToolBar";
import styled from "styled-components";

export function GrafoPage() {
  // 1 -> moverse, 2 -> editar nodo o arista, 3 -> eliminar nodo o arista en especifico
  const [herramienta, setHerramienta] = useState(1);
  return (
    <Container>
      <ToolBar herramienta={herramienta} setHerramienta={setHerramienta} />
      <Graph herramienta={herramienta} setHerramienta={setHerramienta} />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;
