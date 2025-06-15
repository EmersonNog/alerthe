import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { collection, getDocs } from "firebase/firestore";
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

const modernIcon = new L.Icon({
  iconUrl: customMarker,
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
    name: string;
    email: string;
  };
}

export default function MapView() {
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([]);

  useEffect(() => {
    const load = async () => {
      const querySnapshot = await getDocs(collection(db, "ocorrencias"));
      const data: Ocorrencia[] = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...(doc.data() as Omit<Ocorrencia, "id">) });
      });
      setOcorrencias(data);
    };

    load();
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex grow w-full">
        <div className="w-full">
          <div className="flex-grow h-full w-full">
            <MapContainer
              center={[-5.091944, -42.803056]}
              zoom={12}
              zoomControl={false}
              className="h-full w-full rounded shadow"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <ZoomControl position="bottomright" />
              {ocorrencias.map((oc) =>
                oc.location ? (
                  <Marker key={oc.id} position={oc.location} icon={modernIcon}>
                    <Popup>
                      <strong>{oc.category}</strong>
                      <br />
                      {!oc.anonymous && (
                        <>
                          <hr className="my-1" />
                          <small>👤 {oc.user?.name}</small>
                        </>
                      )}
                      {oc.imageUrl && (
                        <>
                          <hr className="my-1" />
                          <img
                            src={oc.imageUrl}
                            alt="ocorrência"
                            className="w-32 h-auto"
                          />
                        </>
                      )}
                    </Popup>
                  </Marker>
                ) : null
              )}
            </MapContainer>
          </div>
        </div>
      </main>
    </div>
  );
}
