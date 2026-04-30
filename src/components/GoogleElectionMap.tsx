import { memo, useState, useCallback, useMemo } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, HeatmapLayer } from "@react-google-maps/api";
import { INDIA_STATES, NATIONAL_AVERAGE_TURNOUT } from "@/data/indiaElectionData";
import type { StateInfo } from "@/types/civic";
import { Loader2 } from "lucide-react";

interface GoogleElectionMapProps {
  selectedState: StateInfo | null;
  onSelectState: (state: StateInfo | null) => void;
}

const STATE_COORDINATES: Record<string, { lat: number; lng: number }> = {
  AP: { lat: 15.9129, lng: 79.74 },
  AR: { lat: 28.218, lng: 94.7278 },
  AS: { lat: 26.2006, lng: 92.9376 },
  BR: { lat: 25.0961, lng: 85.3131 },
  CG: { lat: 21.2787, lng: 81.8661 },
  GA: { lat: 15.2993, lng: 74.124 },
  GJ: { lat: 22.2587, lng: 71.1924 },
  HR: { lat: 29.0588, lng: 76.0856 },
  HP: { lat: 31.1048, lng: 77.1734 },
  JH: { lat: 23.6102, lng: 85.2799 },
  KA: { lat: 15.3173, lng: 75.7139 },
  KL: { lat: 10.8505, lng: 76.2711 },
  MP: { lat: 23.4725, lng: 77.9479 },
  MH: { lat: 19.7515, lng: 75.7139 },
  MN: { lat: 24.6637, lng: 93.9063 },
  ML: { lat: 25.467, lng: 91.3662 },
  MZ: { lat: 23.1645, lng: 92.9376 },
  NL: { lat: 26.1584, lng: 94.5624 },
  OD: { lat: 20.9517, lng: 85.0985 },
  PB: { lat: 31.1471, lng: 75.3412 },
  RJ: { lat: 27.0238, lng: 74.2179 },
  SK: { lat: 27.533, lng: 88.5122 },
  TN: { lat: 11.1271, lng: 78.6569 },
  TS: { lat: 18.1124, lng: 79.0193 },
  TR: { lat: 23.9408, lng: 91.9882 },
  UP: { lat: 26.8467, lng: 80.9462 },
  UK: { lat: 30.0668, lng: 79.0193 },
  WB: { lat: 22.9868, lng: 87.855 },
  JK: { lat: 33.7782, lng: 76.5762 },
  LA: { lat: 34.1526, lng: 77.5771 },
  DL: { lat: 28.6139, lng: 77.209 },
  PY: { lat: 11.9416, lng: 79.8083 },
  AN: { lat: 11.7401, lng: 92.6586 },
  CH: { lat: 30.7333, lng: 76.7794 },
  DN: { lat: 20.1809, lng: 73.0169 },
  LD: { lat: 10.5667, lng: 72.6417 }
};

const mapContainerStyle = {
  width: "100%",
  height: "500px",
  borderRadius: "1rem",
};

const center = {
  lat: 22.5937,
  lng: 78.9629,
};

const options = {
  disableDefaultUI: true,
  zoomControl: true,
  styles: [
    {
      featureType: "all",
      elementType: "labels.text.fill",
      stylers: [{ color: "#ffffff" }, { weight: "0.1" }]
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#001b3e" }]
    },
    {
      featureType: "landscape",
      elementType: "geometry",
      stylers: [{ color: "#1e293b" }]
    },
    {
        featureType: "administrative",
        elementType: "geometry.stroke",
        stylers: [{ color: "#334155" }, { weight: 1 }]
    }
  ],
};

const GoogleElectionMap = memo(function GoogleElectionMap({ selectedState, onSelectState }: GoogleElectionMapProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
    libraries: ["visualization"],
  });

  const [hoveredStateCode, setHoveredStateCode] = useState<string | null>(null);

  const heatmapData = useMemo(() => {
    return INDIA_STATES.map((state) => {
      const coords = STATE_COORDINATES[state.code];
      if (!coords) return null;
      return {
        location: new google.maps.LatLng(coords.lat, coords.lng),
        weight: state.voterTurnout,
      };
    }).filter(Boolean) as google.maps.visualization.WeightedLocation[];
  }, []);

  const onMarkerClick = useCallback((code: string, name: string) => {
    if (selectedState?.code === code) {
      onSelectState(null);
    } else {
      onSelectState({ name, code });
    }
  }, [selectedState, onSelectState]);

  if (loadError) {
    return (
      <div className="civic-card p-8 text-center text-destructive font-sans">
        Error loading Google Maps. Please check your API key.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center bg-muted rounded-2xl animate-pulse">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <section className="py-16 px-4" aria-labelledby="google-map-heading">
      <div className="container max-w-5xl mx-auto">
        <div className="text-center mb-8">
            <span className="civic-badge-info mb-3 inline-block">🗺️ Live Visualization</span>
            <h2 id="google-map-heading" className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Interactive India Election Map
            </h2>
            <p className="text-muted-foreground font-sans max-w-lg mx-auto">
            Explore state-wise voter turnout and historical trends using real geospatial data.
            </p>
        </div>

        <div className="relative civic-card p-0 overflow-hidden shadow-2xl border-accent/20">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={5}
            center={center}
            options={options}
          >
            {heatmapData.length > 0 && (
                <HeatmapLayer
                    data={heatmapData}
                    options={{
                        radius: 50,
                        opacity: 0.6,
                        gradient: [
                            "rgba(0, 255, 255, 0)",
                            "rgba(0, 255, 255, 1)",
                            "rgba(0, 191, 255, 1)",
                            "rgba(0, 127, 255, 1)",
                            "rgba(0, 63, 255, 1)",
                            "rgba(0, 0, 255, 1)",
                            "rgba(0, 0, 223, 1)",
                            "rgba(0, 0, 191, 1)",
                            "rgba(0, 0, 159, 1)",
                            "rgba(0, 0, 127, 1)",
                            "rgba(63, 0, 91, 1)",
                            "rgba(127, 0, 63, 1)",
                            "rgba(191, 0, 31, 1)",
                            "rgba(255, 0, 0, 1)"
                        ]
                    }}
                />
            )}

            {INDIA_STATES.map((state) => {
              const coords = STATE_COORDINATES[state.code];
              if (!coords) return null;
              const isSelected = selectedState?.code === state.code;

              return (
                <Marker
                  key={state.code}
                  position={coords}
                  onClick={() => onMarkerClick(state.code, state.name)}
                  onMouseOver={() => setHoveredStateCode(state.code)}
                  onMouseOut={() => setHoveredStateCode(null)}
                  icon={{
                    path: google.maps.SymbolPath.CIRCLE,
                    fillColor: isSelected ? "#3b82f6" : "#64748b",
                    fillOpacity: 0.8,
                    strokeWeight: isSelected ? 3 : 1,
                    strokeColor: "#ffffff",
                    scale: isSelected ? 12 : 8,
                  }}
                />
              );
            })}

            {hoveredStateCode && (
              <InfoWindow
                position={STATE_COORDINATES[hoveredStateCode]}
                options={{ pixelOffset: new google.maps.Size(0, -15) }}
              >
                <div className="p-2 text-slate-900 font-sans">
                  <h4 className="font-bold text-sm">{INDIA_STATES.find(s => s.code === hoveredStateCode)?.name}</h4>
                  <p className="text-xs">Turnout: {INDIA_STATES.find(s => s.code === hoveredStateCode)?.voterTurnout}%</p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>

          {/* Map Overlay for Statistics */}
          <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-md p-4 rounded-xl border border-accent/20 shadow-lg font-sans max-w-[200px]">
            <h5 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">National Stats</h5>
            <div className="space-y-2">
                <div>
                    <p className="text-2xl font-bold text-foreground">{NATIONAL_AVERAGE_TURNOUT}%</p>
                    <p className="text-[10px] text-muted-foreground">Avg. Voter Turnout</p>
                </div>
                <div className="w-full bg-muted h-1 rounded-full overflow-hidden">
                    <div className="bg-accent h-full" style={{ width: `${NATIONAL_AVERAGE_TURNOUT}%` }} />
                </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-6 font-sans">
          Geospatial visualization powered by Google Maps Platform. Markers represent state capitals/centers.
        </p>
      </div>
    </section>
  );
});

export default GoogleElectionMap;
