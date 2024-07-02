"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import { useRef, useState } from "react";
import Map from "react-map-gl";

// for reference https://github.com/visgl/react-map-gl/tree/master?tab=readme-ov-file

export default function MapboxMap() {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  return (
    <div>
      Should be a map here
      <Map
        mapboxAccessToken={mapboxToken}
        initialViewState={{
          longitude: -114,
          latitude: 46.8,
          zoom: 14,
        }}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
      />
    </div>
  );
}
