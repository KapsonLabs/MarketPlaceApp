import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Loader2, LocateFixed } from "lucide-react";
import { Button } from "@/components/ui/button";

// Fix default marker icon paths (Vite bundling)
const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export interface PickedLocation {
  lat: number;
  lng: number;
  accuracy?: number;
}

interface Props {
  value: PickedLocation | null;
  onChange: (loc: PickedLocation) => void;
}

function Recenter({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, Math.max(map.getZoom(), 15));
  }, [center, map]);
  return null;
}

function ClickHandler({ onPick }: { onPick: (loc: PickedLocation) => void }) {
  useMapEvents({
    click(e) {
      onPick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

export function LocationPicker({ value, onChange }: Props) {
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Default center: Nairobi
  const defaultCenter: [number, number] = [-1.2921, 36.8219];
  const center: [number, number] = useMemo(
    () => (value ? [value.lat, value.lng] : defaultCenter),
    [value],
  );

  function detect() {
    if (!("geolocation" in navigator)) {
      setError("Geolocation is not supported in this browser.");
      return;
    }
    setLocating(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onChange({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
        setLocating(false);
      },
      (err) => {
        setError(err.message || "Unable to get your location.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  // Auto-detect on mount if no value yet
  useEffect(() => {
    if (!value) detect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {value
            ? `Lat ${value.lat.toFixed(5)}, Lng ${value.lng.toFixed(5)}${
                value.accuracy ? ` · ±${Math.round(value.accuracy)} m` : ""
              }`
            : "Detecting your location… or tap the map to drop a pin."}
        </p>
        <Button type="button" size="sm" variant="outline" onClick={detect} disabled={locating}>
          {locating ? (
            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
          ) : (
            <LocateFixed className="mr-1 h-3 w-3" />
          )}
          Use my location
        </Button>
      </div>
      <div className="h-72 w-full overflow-hidden rounded-lg border border-border">
        <MapContainer
          center={center}
          zoom={value ? 15 : 12}
          scrollWheelZoom
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onPick={onChange} />
          {value && (
            <>
              <Recenter center={[value.lat, value.lng]} />
              <Marker
                position={[value.lat, value.lng]}
                icon={markerIcon}
                draggable
                eventHandlers={{
                  dragend: (e) => {
                    const m = e.target as L.Marker;
                    const ll = m.getLatLng();
                    onChange({ lat: ll.lat, lng: ll.lng });
                  },
                }}
              />
            </>
          )}
        </MapContainer>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
      <p className="text-[11px] text-muted-foreground">
        Tap the map or drag the pin to adjust the exact spot.
      </p>
    </div>
  );
}