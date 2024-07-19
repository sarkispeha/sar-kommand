"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import { useRef, useState, useEffect } from "react";
import Map, { GeolocateControl } from "react-map-gl";
import type { MapRef } from "react-map-gl";
import { useQuery } from "@tanstack/react-query";

// for reference https://github.com/visgl/react-map-gl/tree/master?tab=readme-ov-file
// https://www.youtube.com/watch?v=er2YwsForF0

const getIssPosition = async () => {
  const response = await fetch(
    "https://api.wheretheiss.at/v1/satellites/25544",
    { method: "GET" }
  );
  const data = await response.json();
  await console.log("GETTING ISS", data);
  return { latitude: data.latitude, longitude: data.longitude };
};

export default function MapboxMap() {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const [lat, setLat] = useState<number>(46.8);
  const [lng, setLng] = useState<number>(-113.99);

  const mapRef = useRef<MapRef | null>(null);

  const [isMapReady, setIsMapReady] = useState<boolean>(false);
  const [isRefetching, setIsRefetching] = useState<boolean>(false);
  const [viewport, setViewport] = useState({});
  const query = useQuery({
    queryKey: ["issPosition"],
    queryFn: getIssPosition,
    refetchInterval: isRefetching ? 6000 : false,
  });

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

  const toggleTrackIssHandler = async () => {
    setIsRefetching(!isRefetching);
  };
  return (
    <div>
      Should be a map here
      <button onClick={flyToLoloHandler} style={{ border: "1px solid #000" }}>
        Go to Lolo Pass
      </button>
      <button
        onClick={toggleTrackIssHandler}
        style={{ border: "1px solid #000" }}
      >
        ISS location
      </button>
      <p>
        {`Latitude: ${query.data?.latitude} Longitude: ${query.data?.longitude}`}
      </p>
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
