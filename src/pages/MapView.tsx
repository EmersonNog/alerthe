import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import customMarker from "../assets/icons/dangerous.png";
import myMarker from "../assets/icons/my_marker.png";
import ConfirmModal from "../components/ConfirmModal";
import LoadingSpinner from "../components/LoadingSpinner";

const modernIcon = new L.Icon({
  iconUrl: customMarker,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
  shadowUrl: undefined,
});

const myIcon = new L.Icon({
  iconUrl: myMarker,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
  shadowUrl: undefined,
});

interface Ocorrencia {
  id: string;
  description: string;
  category: string;
  anonymous: boolean;
  location: [number, number];
  imageUrl?: string;
  user?: {
    uid: string;
    name: string;
    email: string;
  };
}

export default function MapView() {
  const [loading, setLoading] = useState(true);

  const [modalAberto, setModalAberto] = useState(false);
  const [idParaExcluir, setIdParaExcluir] = useState<string | null>(null);

  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([]);
  const [categoriaSelecionada, setCategoriaSelecionada] =
    useState<string>("Todas");

  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const load = async () => {
      const querySnapshot = await getDocs(collection(db, "ocorrencias"));
      const data: Ocorrencia[] = [];
      querySnapshot.forEach((docSnap) => {
        data.push({
          id: docSnap.id,
          ...(docSnap.data() as Omit<Ocorrencia, "id">),
        });
      });
      setOcorrencias(data);
      setLoading(false);
    };

    load();
  }, []);

  const todasCategorias = [
    "Infraestrutura",
    "Segurança",
    "Água",
    "Energia",
    "Outros",
  ];

  const ocorrenciasFiltradas = ocorrencias.filter((oc) =>
    categoriaSelecionada === "Todas"
      ? true
      : oc.category === categoriaSelecionada
  );

  const handleDelete = async () => {
    if (!idParaExcluir) return;

    try {
      await deleteDoc(doc(db, "ocorrencias", idParaExcluir));
      setOcorrencias((prev) =>
        prev.filter((item) => item.id !== idParaExcluir)
      );
    } catch (error) {
      console.error("Erro ao excluir:", error);
      alert("Erro ao excluir a ocorrência.");
    } finally {
      setModalAberto(false);
      setIdParaExcluir(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex grow w-full flex-col">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="relative h-full w-full">
            <div className="absolute bottom-3 left-4 z-[1000] bg-white rounded-xl shadow-md px-4 py-2 border border-gray-200 flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Categoria:
              </label>
              <div className="relative">
                <select
                  className="appearance-none w-40 text-sm px-3 py-2 rounded-lg border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  value={categoriaSelecionada}
                  onChange={(e) => setCategoriaSelecionada(e.target.value)}
                >
                  <option value="Todas">Todas</option>
                  {todasCategorias.map((categoria) => (
                    <option key={categoria} value={categoria}>
                      {categoria}
                    </option>
                  ))}
                </select>

                {/* Ícone de seta */}
                <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-500">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Mapa */}
            <MapContainer
              center={[-5.091944, -42.803056]}
              zoom={12}
              zoomControl={false}
              className="h-screen"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <ZoomControl position="bottomright" />
              {ocorrenciasFiltradas.map((oc) =>
                oc.location ? (
                  <Marker
                    key={oc.id}
                    position={oc.location}
                    icon={
                      oc.user?.uid && currentUser?.uid === oc.user.uid
                        ? myIcon
                        : modernIcon
                    }
                  >
                    <Popup>
                      <div className="text-sm space-y-2">
                        <div className="font-semibold text-blue-700">
                          {oc.category}
                        </div>

                        {!oc.anonymous && (
                          <div className="flex items-center space-x-1 text-gray-600">
                            <span role="img" aria-label="user">
                              👤
                            </span>
                            <span>{oc.user?.name}</span>
                          </div>
                        )}

                        {oc.imageUrl && (
                          <div>
                            <img
                              src={oc.imageUrl}
                              alt="ocorrência"
                              className="rounded-lg shadow w-32 h-auto border border-gray-200"
                            />
                          </div>
                        )}

                        {oc.user?.uid && currentUser?.uid === oc.user.uid && (
                          <div>
                            <button
                              onClick={() => {
                                setIdParaExcluir(oc.id);
                                setModalAberto(true);
                              }}
                              className="mt-2 inline-flex items-center gap-1 rounded-md bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 px-3 py-1 text-xs font-semibold shadow-sm transition cursor-pointer"
                            >
                              Excluir minha ocorrência
                            </button>
                          </div>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                ) : null
              )}
            </MapContainer>
          </div>
        )}

        <ConfirmModal
          isOpen={modalAberto}
          onConfirm={handleDelete}
          onCancel={() => {
            setModalAberto(false);
            setIdParaExcluir(null);
          }}
          message="Tem certeza que deseja excluir esta ocorrência? Esta ação não poderá ser desfeita."
        />
      </main>
    </div>
  );
}
