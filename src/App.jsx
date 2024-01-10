import "./App.css";
import PrivateRoutes from "./components/PrivateRoutes";
import LoginPage from "./pages/LoginPage";
import Room from "./pages/Room";
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./utils/AuthContext";
import RegisterPage from "./pages/RegisterPage";

function App() {
  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<PrivateRoutes />}>
            <Route path="/" element={<Room />} />
          </Route>
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
