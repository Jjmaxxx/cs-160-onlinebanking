"use client";

import { useState, useEffect } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from "@vis.gl/react-google-maps";

import Navbar from '../components/Navbar';

const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

async function findChaseAtms(position: Position): Promise<PlacesResponse> {
  const { lat, lng } = position;
  const url = `http://localhost:12094/nearbysearch_proxy?location=${lat},${lng}&radius=1000&type=atm&keyword=chase`;
  
  const response = await fetch(url);
  const json = await response.json();
  console.log("HEREEEE", json);
  return JSON.parse(json);
}

interface Position {
  lat: number;
  lng: number;
}

interface PlaceResult {
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

interface PlacesResponse {
  results: PlaceResult[];
}

export default function Intro() {
  const [position, setPosition] = useState<Position | null>(null);
  const [atms, setAtms] = useState<Position[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedAtm, setSelectedAtm] = useState<Position | null>(null);

  useEffect(() => {
    console.log("Getting user location...");
    if (navigator.geolocation) {
      console.log("Getting user location...2");
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          console.log("Getting user location...3");
          const { latitude, longitude } = pos.coords;
          const userPosition = { lat: latitude, lng: longitude };
          setPosition(userPosition);

          // Fetch ATM locations
          console.log("Getting user location...4");
          const atmData = await findChaseAtms(userPosition);
          console.log("atmData: ", atmData);
          console.log("atmData.results: ", atmData.results);

          const atmLocations = atmData.results.map((atm) => atm.geometry.location);
          console.log("ATM LOCATIONS");
          console.log(atmLocations);
          setAtms(atmLocations);
        },
        (error) => {
          console.error("Error getting location:", error);
          const defaultPosition = { lat: 53.54, lng: 10 }; // Default to Hamburg
          setPosition(defaultPosition);
          findChaseAtms(defaultPosition).then((atmData) => {
            setAtms(atmData.results.map((atm) => atm.geometry.location));
          });
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      const defaultPosition = { lat: 53.54, lng: 10 };
      setPosition(defaultPosition);
      findChaseAtms(defaultPosition).then((atmData) => {
        setAtms(atmData.results.map((atm) => atm.geometry.location));
      });
    }
  }, []);

  if (!position) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <APIProvider apiKey={key}>
      <Navbar />
      <div className="flex justify-center items-center h-[calc(100vh-64px)] bg-gray-100 p-4">
        <div className="w-3/4 h-3/4 bg-white rounded-xl shadow-lg overflow-hidden">
          <Map zoom={15} center={position} mapId="3e43149384fef289">
            {/* User Location Marker */}
            <AdvancedMarker position={position} onClick={() => setOpen(true)}>
              <Pin background="grey" borderColor="green" glyphColor="purple" />
            </AdvancedMarker>

            {open && (
              <InfoWindow position={position} onCloseClick={() => setOpen(false)}>
                <p>I'm here!</p>
              </InfoWindow>
            )}

            {/* ATM Markers */}
            {atms.map((atm, index) => (
              <AdvancedMarker
                key={index}
                position={atm}
                onClick={() => setSelectedAtm(atm)}
              >
                <Pin background="blue" borderColor="blue" glyphColor="" />
              </AdvancedMarker>
            ))}

            {selectedAtm && (
              <InfoWindow position={selectedAtm} onCloseClick={() => setSelectedAtm(null)}>
                <p>Chase ATM</p>
              </InfoWindow>
            )}
          </Map>
        </div>
      </div>
    </APIProvider>
  );
}
