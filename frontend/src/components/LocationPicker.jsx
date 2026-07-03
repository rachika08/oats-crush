import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { reverseGeocode } from "../utils/geoapify";

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function ChangeMapView({ center }) {
  const map = useMap();

  map.setView(center, 16);

  return null;
}

function DraggableMarker({
  position,
  setPosition,
  onLocationSelect,
}) {
  useMapEvents({
    click: async (e) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      setPosition([lat, lng]);

      try {
        const address = await reverseGeocode(lat, lng);

        if (address) {
          onLocationSelect(address);
        }
      } catch (err) {
        console.error(err);
      }
    },
  });

  return (
    <Marker
      position={position}
      draggable={true}
      eventHandlers={{
        dragend: async (e) => {
          const marker = e.target;
          const { lat, lng } = marker.getLatLng();

          setPosition([lat, lng]);

          try {
            const address = await reverseGeocode(lat, lng);

            if (address) {
              onLocationSelect(address);
            }
          } catch (err) {
            console.error(err);
          }
        },
      }}
    />
  );
}

export default function LocationPicker({ onLocationSelect }) {
  const [position, setPosition] = useState([28.6139, 77.209]);
  const [loading, setLoading] = useState(false);

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const lat = coords.latitude;
          const lng = coords.longitude;

          setPosition([lat, lng]);

          const address = await reverseGeocode(lat, lng);

          if (address) {
            onLocationSelect(address);
          }
        } catch (err) {
          console.error(err);
          alert("Unable to fetch address.");
        } finally {
          setLoading(false);
        }
      },
      () => {
        alert("Unable to access your location.");
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium text-gray-700">
          Select Delivery Location
        </h3>

        <button
          type="button"
          onClick={handleCurrentLocation}
          disabled={loading}
          className="px-4 py-2 bg-brand-orange text-white rounded-lg text-sm hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Getting Location..." : "📍 Use Current Location"}
        </button>
      </div>

      <MapContainer
        center={position}
        zoom={15}
        scrollWheelZoom={true}
        style={{
          height: "350px",
          width: "100%",
          borderRadius: "16px",
        }}
      >
        <ChangeMapView center={position} />

        <TileLayer
          url={`https://maps.geoapify.com/v1/tile/osm-carto/{z}/{x}/{y}.png?apiKey=${
            import.meta.env.VITE_GEOAPIFY_API_KEY
          }`}
          attribution="© OpenStreetMap contributors © Geoapify"
        />

        <DraggableMarker
          position={position}
          setPosition={setPosition}
          onLocationSelect={onLocationSelect}
        />
      </MapContainer>

      <p className="text-xs text-gray-500 mt-2">
        Click anywhere on the map or drag the marker to choose your delivery location.
      </p>
    </div>
  );
}