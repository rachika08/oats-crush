// src/components/LocationPicker.jsx
import { useState, useCallback, useRef } from "react";
import { GoogleMap, Marker, Autocomplete, useJsApiLoader } from "@react-google-maps/api";

const libraries = ["places"];
const mapContainerStyle = { width: "100%", height: "300px", borderRadius: "8px" };
const defaultCenter = { lat: 28.6139, lng: 77.2090 }; // Delhi fallback

export default function LocationPicker({ onLocationSelect }) {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    const [marker, setMarker] = useState(defaultCenter);
    const [map, setMap] = useState(null);
    const autocompleteRef = useRef(null);

    const reverseGeocode = useCallback((lat, lng) => {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            console.log("Geocode status:", status);      // ADD THIS
            console.log("Geocode results:", results);     // ADD THIS
            if (status === "OK" && results[0]) {
                const components = results[0].address_components;
                const get = (type) =>
                    components.find((c) => c.types.includes(type))?.long_name || "";

                onLocationSelect({
                    lat,
                    lng,
                    formattedAddress: results[0].formatted_address,
                    addressLine1: `${get("street_number")} ${get("route")}`.trim(),
                    city: get("locality") || get("administrative_area_level_2"),
                    state: get("administrative_area_level_1"),
                    pincode: get("postal_code"),
                });
                console.log("Sending to parent:", locationData);  // ADD THIS
                onLocationSelect(locationData);
            }
        });
    }, [onLocationSelect]);

    const handlePlaceChanged = () => {
        const place = autocompleteRef.current.getPlace();
        if (!place.geometry) return;

        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();

        setMarker({ lat, lng });
        map?.panTo({ lat, lng });
        map?.setZoom(16);
        reverseGeocode(lat, lng);
    };

    const handleMarkerDragEnd = (e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        setMarker({ lat, lng });
        reverseGeocode(lat, lng);
    };

    const handleUseCurrentLocation = () => {
        if (!navigator.geolocation) return alert("Geolocation not supported");

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                setMarker({ lat, lng });
                map?.panTo({ lat, lng });
                map?.setZoom(16);
                reverseGeocode(lat, lng);
            },
            () => alert("Unable to fetch your location")
        );
    };

    if (!isLoaded) return <div>Loading map...</div>;

    return (
        <div className="space-y-2">
            <Autocomplete
                onLoad={(ac) => (autocompleteRef.current = ac)}
                onPlaceChanged={handlePlaceChanged}
            >
                <input
                    type="text"
                    placeholder="Search for your address"
                    className="border w-full p-2 rounded"
                />
            </Autocomplete>

            <button
                type="button"
                onClick={handleUseCurrentLocation}
                className="text-sm text-brand-orange underline"
            >
                📍 Use my current location
            </button>

            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={marker}
                zoom={15}
                onLoad={(m) => setMap(m)}
            >
                <Marker position={marker} draggable onDragEnd={handleMarkerDragEnd} />
            </GoogleMap>
        </div>
    );
}