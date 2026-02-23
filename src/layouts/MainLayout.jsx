import styled from "styled-components";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

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
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
`;

const Main = styled.main`
  margin-top: 64px;
  flex: 1;
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
`;
