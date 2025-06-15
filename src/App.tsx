// src/App.tsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./services/firebase";
import Login from "./pages/Login";
import ProtectedApp from "./components/ProtectedApp";

export default function App() {
  const [user, loading] = useAuthState(auth);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        Carregando...
      </div>
    );

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/*"
          element={user ? <ProtectedApp /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </Router>
  );
}
