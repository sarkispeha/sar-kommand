"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import { useRef, useState, useEffect } from "react";
import Map, { GeolocateControl, Layer, Marker, Source } from "react-map-gl";
import type { CircleLayer, LineLayer, MapRef } from "react-map-gl";
import type { Feature, FeatureCollection, LineString, Position } from "geojson";
import { GeoJsonPosition } from "@/data/Geo";
import type { MemberCoord } from "@prisma/client";

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
  isTrailing: boolean;
  trailingArray: Position[];
}

export default function MapboxMap({
  issPosition,
  isRefetching,
  isTrackingIss,
  isTrailing,
  trailingArray,
}: MapboxMapProps) {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const mapRef = useRef<MapRef | null>(null);

  const [isMapReady, setIsMapReady] = useState<boolean>(false);
  const [viewport, setViewport] = useState({});
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [mobileMemberPosition, setMobileMemberPosition] =
    useState<MemberCoord | null>(null);

  useEffect(() => {
    if (issPosition && isRefetching && isTrackingIss) {
      flyToLocation({
        location: { lat: issPosition.lat, lng: issPosition.lng },
      });
    }
  }, [issPosition]);

  const flyToLocation = ({ location }: { location: GeoJsonPosition }) => {
    mapRef.current?.flyTo({
      center: location,
      zoom: 5,
      essential: true,
      speed: 0.5,
    });
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

  useEffect(() => {
    // TODO: refactor into util hook
    const eventSource = new EventSource("/api/coordinates");

    eventSource.onmessage = (event) => {
      const coordinates: MemberCoord[] = JSON.parse(event.data);
      if (coordinates.length > 0) {
        // Get the most recent coordinate
        setMobileMemberPosition(coordinates[0]);
      }
    };

    eventSource.onerror = (error) => {
      console.error("EventSource failed:", error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  // const circleJson: FeatureCollection = {
  //   type: "FeatureCollection",
  //   features: [
  //     {
  //       type: "Feature",
  //       properties: { circle: "circle" },
  //       geometry: {
  //         type: "Point",
  //         coordinates: [-114.00874412405805, 46.85408927066709],
  //       },
  //     },
  //   ],
  // };

  // const circleStyle: CircleLayer = {
  //   id: "point",
  //   type: "circle",
  //   paint: {
  //     "circle-radius": 10,
  //     "circle-color": "#007cbf",
  //   },
  // };

  const lineStyle: LineLayer = {
    id: "lineLayer",
    type: "line",
    source: "lineSource",
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-color": "red",
      "line-width": 10,
    },
  };
  const lineJson: Feature = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: trailingArray,
      // [[-114.00874412405805, 46.85408927066709],
      // [-114.00874412405805, 47.85408927066709],
      // [-114.00874412405805, 48.85408927066709],
      // [-114.00874412405805, 49.85408927066709]],
    },
  };

  return (
    <div>
      <p style={{ border: "1px solid #000" }}>
        ISS location Tracking: {isRefetching ? "Enabled" : "Disabled"}
      </p>
      <p
        onClick={() => {
          console.log("START TRACK");
          setIsTracking(!isTracking);
        }}
      >
        Check the map ref
      </p>
      <p>DRAW LINE? {isTracking ? "Enabled" : "Disabled"}</p>
      {/* <p>{`Latitude: ${issPosition?.lat} Longitude: ${issPosition?.lng}`}</p> */}
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
          {mobileMemberPosition && (
            <Marker
              longitude={mobileMemberPosition.lng}
              latitude={mobileMemberPosition.lat}
              color="blue"
            />
          )}
          <Source id="lineSource" type="geojson" data={lineJson}>
            <Layer {...lineStyle} />
          </Source>
        </Map>
      )}
    </div>
  );
}
