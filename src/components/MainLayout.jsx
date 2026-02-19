import styled from "styled-components";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export function MainLayout() {
  return (
    <Container>
      <Navbar />
      <Main>
        <Outlet />
      </Main>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  min-width: 0;
`;
