import { Route, Routes, Navigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material";
import Space from "./pages/Space";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import useAuth from "./hooks/useAuth";

function App() {
  const { auth } = useAuth();

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <Routes>
          {auth && (
            <>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="project/:projectId" element={<Space />} />
            </>
          )}

          {!auth && (
            <>
              <Route path="/" element={<Login />} />
              <Route path="register" element={<Register />} />
            </>
          )}

          <Route
            path="*"
            element={<Navigate to={auth ? "/dashboard" : "/"} />}
          />
        </Routes>
      </ThemeProvider>
    </>
  );
}

export default App;
