"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import { useRef, useState, useEffect, useMemo } from "react";
import Map, { GeolocateControl } from "react-map-gl";
import type { MapRef } from "react-map-gl";
import { useQuery } from "@tanstack/react-query";
import useFetch from "@/utils/hooks/useFetch";
import { GeoJsonPosition } from "@/data/Geo";

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

interface IssDataResponse {
  data: {
    latitude: number;
    longitude: number;
  };
  isLoading: boolean;
}

export default function MapboxMap() {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const mapRef = useRef<MapRef | null>(null);

  const [isMapReady, setIsMapReady] = useState<boolean>(false);
  const [isRefetching, setIsRefetching] = useState<boolean>(false);
  const [viewport, setViewport] = useState({});

  const [issPosition, setIssPosition] = useState<GeoJsonPosition | null>(null);
  const [isTrackingIss, setIsTrackingIss] = useState<boolean>(false);

  const query = useQuery({
    queryKey: ["issPosition"],
    queryFn: async () => {
      const issData = await getIssPosition();
      setIssPosition({ lat: issData.latitude, lng: issData.longitude });
      return { latitude: issData.latitude, longitude: issData.longitude };
    },
    refetchInterval: isRefetching ? 6000 : false,
  });

  useEffect(() => {
    if (issPosition && isRefetching && isTrackingIss) {
      flyToLocation({
        location: { lat: issPosition.lat, lng: issPosition.lng },
      });
    }
  }, [issPosition]);

  const flyToLocation = ({ location }: { location: GeoJsonPosition }) => {
    mapRef.current?.flyTo({ center: location });
  };

  const toggleTrackIssHandler = async () => {
    setIsRefetching(!isRefetching);
    setIsTrackingIss(!isTrackingIss);
  };

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

  return (
    <div>
      <button style={{ border: "1px solid #000" }}>Go to Lolo Pass</button>
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
          style={{ width: "90vw", height: "90vh" }}
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
