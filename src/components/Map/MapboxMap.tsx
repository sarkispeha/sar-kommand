"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import { useRef, useState, useEffect } from "react";
import Map, { GeolocateControl, Marker } from "react-map-gl";
import type { MapRef } from "react-map-gl";
import { GeoJsonPosition } from "@/data/Geo";

// for reference https://github.com/visgl/react-map-gl/tree/master?tab=readme-ov-file
// https://www.youtube.com/watch?v=er2YwsForF0

interface IssDataResponse {
  data: {
    latitude: number;
    longitude: number;
  };
  isLoading: boolean;
}

interface MapboxMapProps {
  issPosition: GeoJsonPosition | null;
  isRefetching: boolean;
  isTrackingIss: boolean;
}

export default function MapboxMap({
  issPosition,
  isRefetching,
  isTrackingIss,
}: MapboxMapProps) {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const mapRef = useRef<MapRef | null>(null);

  const [isMapReady, setIsMapReady] = useState<boolean>(false);
  const [viewport, setViewport] = useState({});

  useEffect(() => {
    console.log(
      "USE EFFECT, IS REFETCHING :",
      isRefetching,
      " IS TRACKING :",
      isTrackingIss
    );
    if (issPosition && isRefetching && isTrackingIss) {
      flyToLocation({
        location: { lat: issPosition.lat, lng: issPosition.lng },
      });
    }
  }, [issPosition]);

  const flyToLocation = ({ location }: { location: GeoJsonPosition }) => {
    mapRef.current?.flyTo({ center: location, zoom: 5 });
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
      <p style={{ border: "1px solid #000" }}>
        ISS location Tracking: {isRefetching ? "Enabled" : "Disabled"}
      </p>
      <p>{`Latitude: ${issPosition?.lat} Longitude: ${issPosition?.lng}`}</p>
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
          {issPosition && (
            <Marker
              longitude={issPosition?.lng}
              latitude={issPosition?.lat}
              color="red"
            />
          )}
        </Map>
      )}
    </div>
  );
}
