import { auth } from "../services/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import googleLogo from "../assets/icons/google.svg";

export default function Login() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) navigate("/");
  }, [user, loading, navigate]);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch {
      alert("Falha ao fazer login.");
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="relative flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
      {/* Glow de fundo */}
      <div className="absolute w-[400px] h-[400px] sm:w-[500px] sm:h-[500px] bg-blue-100 rounded-full -top-20 -left-20 opacity-20 blur-3xl animate-pulse" />
      <div className="absolute w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] bg-orange-200 rounded-full -bottom-16 -right-16 opacity-10 blur-2xl animate-pulse" />

      {/* Card de login */}
      <div className="animate-fadeIn bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl px-6 py-8 sm:px-8 sm:py-10 w-full max-w-sm sm:max-w-md text-center">
        <h1 className="text-4xl sm:text-5xl font-[Righteous] text-gray-800 mb-2 tracking-tight">
          <span className="text-gray-800">Aler</span>
          <span className="text-orange-600">THE</span>
        </h1>
        <p className="text-gray-600 mb-8 text-sm sm:text-base">
          Acesse com sua conta Google
        </p>

        <button
          onClick={handleLogin}
          className="flex items-center justify-center w-full gap-3 px-4 py-3 bg-white border border-gray-300 rounded-lg shadow hover:shadow-lg hover:ring-2 hover:ring-blue-200 transition duration-200"
        >
          <img
            src={googleLogo}
            alt="Logo do Google"
            className="w-5 h-5 mr-1 drop-shadow-sm"
          />
          <span className="text-gray-800 text-sm sm:text-base font-medium tracking-wide">
            Entrar com Google
          </span>
        </button>

        <p className="mt-8 text-xs text-gray-400">
          © {currentYear} AlerTHE • v1.0
        </p>
      </div>
    </div>
  );
}
