import { useState } from "react";
import { db, auth } from "../services/firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useAuthState } from "react-firebase-hooks/auth";
import "leaflet/dist/leaflet.css";
import toast from "react-hot-toast";
import L from "leaflet";

import customMarker from "../assets/icons/dangerous.png";

const modernIcon = new L.Icon({
  iconUrl: customMarker,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
  shadowUrl: undefined,
});

function LocationPicker({
  setLocation,
}: {
  setLocation: (coords: [number, number]) => void;
}) {
  useMapEvents({
    click(e) {
      setLocation([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

export default function ReportForm() {
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("infraestrutura");
  const [anonymous, setAnonymous] = useState(true);
  const [contactNumber, setContactNumber] = useState("");
  const [location, setLocation] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(false);
  const [user] = useAuthState(auth);

  const categoryLabels: Record<string, string> = {
    infraestrutura: "Infraestrutura",
    seguranca: "Segurança",
    agua: "Água",
    energia: "Energia",
    outros: "Outros",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "ocorrencias"), {
        description,
        category: categoryLabels[category],
        anonymous,
        contactNumber: contactNumber || null,
        location,
        createdAt: Timestamp.now(),
        user: anonymous
          ? null
          : {
              name: user?.displayName || "",
              email: user?.email || "",
              uid: user?.uid,
            },
      });

      toast.success("Ocorrência registrada com sucesso!");

      setDescription("");
      setCategory("infraestrutura");
      setAnonymous(true);
      setContactNumber("");
      setLocation(null);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao registrar ocorrência.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-18 px-4 w-full max-w-5xl mx-auto">
      <h2 className="text-4xl font-extrabold text-gray-800 mb-10 tracking-tight relative">
        Registrar Ocorrência
        <span className="absolute left-0 -bottom-2 w-16 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"></span>
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8 z-9999">
        {/* Categoria */}
        <div className="flex flex-col gap-4">
          <label className="text-lg font-medium text-gray-700">Categoria</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 bg-white/60 backdrop-blur-sm text-gray-800 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="infraestrutura">Infraestrutura</option>
            <option value="seguranca">Segurança</option>
            <option value="agua">Água</option>
            <option value="energia">Energia</option>
            <option value="outros">Outros</option>
          </select>
        </div>

        {/* Descrição */}
        <div className="flex flex-col gap-4">
          <label className="text-lg font-medium text-gray-700">
            Descrição do problema
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descreva o problema..."
            required
            rows={4}
            className="w-full p-4 text-gray-800 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-white/60 backdrop-blur-sm"
          />
        </div>

        {/* Anônimo */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={anonymous}
            onChange={(e) => setAnonymous(e.target.checked)}
            className="accent-blue-600 scale-125"
          />
          <label className="text-gray-700 text-base select-none">
            Enviar como denúncia anônima
          </label>
        </div>

        {/* Número de contato */}
        <div className="flex flex-col gap-2">
          <label className="text-lg font-medium text-gray-700">
            Número de contato (opcional)
          </label>
          <input
            type="tel"
            value={contactNumber}
            onChange={(e) => {
              let raw = e.target.value.replace(/\D/g, "");

              if (raw.length > 11) raw = raw.slice(0, 11);

              let formatted = "";

              if (raw.length >= 1) {
                formatted += `(${raw.slice(0, 2)}`;
              }
              if (raw.length >= 3) {
                formatted += `) ${raw[2]}`;
              }
              if (raw.length >= 4) {
                formatted += ` ${raw.slice(3, 7)}`;
              }
              if (raw.length >= 8) {
                formatted += `-${raw.slice(7, 11)}`;
              }

              setContactNumber(formatted);
            }}
            placeholder="(11) 9 9999-9999"
            className="w-full p-3 text-gray-800 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/60 backdrop-blur-sm"
          />
        </div>

        {/* Mapa */}
        <div className="rounded-xl overflow-hidden border border-gray-300 shadow-sm">
          <MapContainer
            center={[-5.091944, -42.803056]}
            zoom={13}
            className="h-64 w-full"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationPicker setLocation={setLocation} />
            {location && <Marker position={location} icon={modernIcon} />}
          </MapContainer>
        </div>

        {/* Botão */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-3 rounded-full text-white font-semibold tracking-wide shadow-md transition mb-4
              ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90"
              }
            `}
          >
            {loading ? "Enviando..." : "Registrar Ocorrência"}
          </button>
        </div>
      </form>
    </div>
  );
}
