"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import { useRef, useState, useEffect } from "react";
import Map, { GeolocateControl } from "react-map-gl";
import type { MapRef } from "react-map-gl";
import { GeoJsonPosition } from "@/data/Geo";
import { MemberData } from "@/data/Member";
import { MemberMarker } from "./MemberMarker";

interface MapboxMapProps {
  selectedMembers: MemberData[];
}

export default function MapboxMap({ selectedMembers }: MapboxMapProps) {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const mapRef = useRef<MapRef | null>(null);

  const [isMapReady, setIsMapReady] = useState<boolean>(false);
  const [viewport, setViewport] = useState({});

  // TODO: put in map util
  const flyToLocation = ({ location }: { location: GeoJsonPosition }) => {
    mapRef.current?.flyTo({
      center: location,
      zoom: 5,
      essential: true,
      speed: 0.5,
    });
  };

  // set map starting location
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
          {selectedMembers &&
            selectedMembers.map((selectedMember) =>
              selectedMember.position ? (
                <MemberMarker
                  selectedMember={selectedMember}
                  key={selectedMember.sarMemberId}
                />
              ) : null
            )}
        </Map>
      )}
    </div>
  );
}
