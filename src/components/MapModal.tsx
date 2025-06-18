import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import customMarker from "../assets/icons/dangerous.png";
import { useEffect, useState } from "react";

const modernIcon = new L.Icon({
  iconUrl: customMarker,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
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

export default function MapModal({
  isOpen,
  onClose,
  location,
  setLocation,
  expanded,
}: {
  isOpen: boolean;
  onClose: () => void;
  location: [number, number] | null;
  setLocation: (coords: [number, number]) => void;
  expanded: boolean;
}) {
  const [show, setShow] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );

  useEffect(() => {
    if (isOpen) {
      setShow(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([
            position.coords.latitude,
            position.coords.longitude,
          ]);
        },
        () => {
          setUserLocation(null);
        }
      );
    }
  }, [isOpen]);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-center px-2 sm:px-4 transition-all duration-300 ${
        expanded ? "lg:ml-64" : "lg:ml-20"
      }`}
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden transform transition-all duration-200 ease-out ${
          show ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-4 py-3 sm:px-5 sm:py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-700 to-blue-500">
          <h2 className="text-white text-base sm:text-lg font-semibold">
            Selecione a localização do problema
          </h2>
          <button
            onClick={handleClose}
            className="text-white text-xl sm:text-2xl font-bold transition-colors duration-200 hover:text-red-400 cursor-pointer"
            aria-label="Fechar modal"
          >
            &times;
          </button>
        </div>

        {/* Mapa */}
        <div className="flex-grow">
          <MapContainer
            center={userLocation || location || [-5.091944, -42.803056]}
            zoom={15}
            className="h-[55vh] sm:h-[60vh] w-full"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationPicker setLocation={setLocation} />
            {location && <Marker position={location} icon={modernIcon} />}
            {userLocation && (
              <Marker
                position={userLocation}
                icon={L.divIcon({
                  className: "leaflet-user-location",
                  iconSize: [16, 16],
                  iconAnchor: [8, 8],
                })}
              />
            )}
          </MapContainer>
        </div>

        {/* Rodapé */}
        <div className="p-3 sm:p-4 border-t flex justify-end bg-white">
          <button
            onClick={handleClose}
            className="px-5 py-2 sm:px-6 sm:py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm sm:text-base font-semibold shadow-md hover:opacity-90 transition"
          >
            Confirmar Localização
          </button>
        </div>
      </div>

      {/* Estilo para localização atual */}
      <style>{`
        .leaflet-user-location {
          width: 16px;
          height: 16px;
          background: #3b82f6;
          border: 2px solid white;
          border-radius: 50%;
          box-shadow: 0 0 0 rgba(59, 130, 246, 0.5);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.5);
          }
          70% {
            box-shadow: 0 0 0 15px rgba(59, 130, 246, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
          }
        }
      `}</style>
    </div>
  );
}
