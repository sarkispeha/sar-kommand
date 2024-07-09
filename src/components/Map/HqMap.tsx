"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import { useRef, useState, useEffect } from "react";
import Map, { GeolocateControl } from "react-map-gl";
import type { MapRef } from "react-map-gl";

// for reference https://github.com/visgl/react-map-gl/tree/master?tab=readme-ov-file
// https://www.youtube.com/watch?v=er2YwsForF0

export default function MapboxMap() {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const [lat, setLat] = useState<number>(46.8);
  const [lng, setLng] = useState<number>(-113.99);

  const mapRef = useRef<MapRef | null>(null);

  const [isMapReady, setIsMapReady] = useState<boolean>(false);
  const [viewport, setViewport] = useState({});
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setViewport({
        ...viewport,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        zoom: 15,
      });
      setIsMapReady(true);
    });
  }, []);
  const flyToLoloHandler = () => {
    mapRef.current?.flyTo({
      center: [-114.58030531385444, 46.63475261852412],
    });
  };
  return (
    <div>
      Should be a map here
      <button onClick={flyToLoloHandler} style={{ border: "1px solid #000" }}>
        Go to Lolo Pass
      </button>
      {isMapReady && (
        <Map
          ref={mapRef}
          mapboxAccessToken={mapboxToken}
          initialViewState={viewport}
          style={{ width: "100vw", height: "100vh" }}
          mapStyle="mapbox://styles/mapbox/streets-v9"
        >
          <GeolocateControl
            trackUserLocation={true}
            positionOptions={{ enableHighAccuracy: true }}
          />
        </Map>
      )}
    </div>
  );
}
