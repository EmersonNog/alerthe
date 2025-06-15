import { useEffect, useState } from "react";
import { collection, getCountFromServer } from "firebase/firestore";
import { db } from "../services/firebase";
import { Link } from "react-router-dom";

export default function Home() {
  const [totalOcorrencias, setTotalOcorrencias] = useState<number | null>(null);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const snapshot = await getCountFromServer(
          collection(db, "ocorrencias")
        );
        setTotalOcorrencias(snapshot.data().count);
      } catch (error) {
        console.error("Erro ao contar ocorrências:", error);
        setTotalOcorrencias(0);
      }
    };

    fetchCount();
  }, []);

  return (
    <div className="py-20 px-4 lg:pl-8 bg-gradient-to-br from-white via-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white/70 backdrop-blur rounded-2xl shadow-lg hover:shadow-xl transition p-6 border border-gray-200">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            👋 Bem-vindo ao{" "}
            <span className="text-2xl font-black tracking-tight font-[Righteous] text-white bg-gradient-to-r from-gray-800 to-orange-600 px-2 py-0.5 rounded-lg">
              <span className="text-white">Aler</span>
              <span className="text-orange-400">THE</span>
            </span>
            !
          </h2>
          <p className="mt-4 text-gray-700 leading-relaxed text-[15px] font-[Outfit]">
            Utilize o menu lateral para navegar entre os recursos do sistema.
          </p>
          <p className="mt-2 text-gray-600 text-sm font-[Outfit]">
            Você pode registrar novas ocorrências, consultar o mapa ou acessar
            os termos de uso.
          </p>

          <Link
            to="/report"
            className="inline-block mt-5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm px-5 py-2 rounded-full font-semibold shadow hover:opacity-90 transition"
          >
            + Registrar Ocorrência
          </Link>
        </div>

        {/* Resumo de Ocorrências */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-xl shadow text-blue-900 flex items-center justify-between hover:shadow-md transition">
          <div>
            <h3 className="text-xl font-semibold flex items-center gap-1">
              📊 Ocorrências Registradas
            </h3>
            <p className="text-sm mt-1 font-[Outfit]">
              Total acumulado no sistema:
            </p>
          </div>
          <span className="text-4xl font-black text-blue-700 animate-pulse">
            {totalOcorrencias !== null ? totalOcorrencias : "–"}
          </span>
        </div>

        {/* Conscientização */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-5 rounded-xl shadow-md text-yellow-900 hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">
            🔔 Uso Consciente da Plataforma
          </h3>
          <p className="text-sm leading-relaxed font-[Outfit]">
            O <strong>AlerTHE</strong> é uma ferramenta colaborativa para
            melhorar a vida urbana. Informe dados reais e relevantes ao
            registrar uma ocorrência. Evite relatos falsos ou duplicados.
          </p>
          <p className="mt-2 text-sm leading-relaxed font-[Outfit]">
            Lembre-se: <strong>respeito, responsabilidade e verdade</strong> são
            essenciais para que o sistema funcione para todos.
          </p>
        </div>
      </div>
    </div>
  );
}
