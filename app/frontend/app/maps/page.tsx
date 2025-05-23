"use client";

import { useState, useEffect } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import {MapCameraChangedEvent, MapCameraProps} from '@vis.gl/react-google-maps';


import Navbar from '../components/Navbar';

const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

function getDistanceInMiles(lat1, lon1, lat2, lon2) {
  const R = 3958.8; // Radius of the Earth in miles
  const toRadians = angle => angle * (Math.PI / 180);

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

async function findChaseAtms(position: Position): Promise<PlacesResponse> {
  var { lat, lng } = position;
  // round to 3 decimal places
  lat = Math.round(lat * 1000) / 1000;
  lng = Math.round(lng * 1000) / 1000;
  const url = `${process.env.NEXT_PUBLIC_API_URL}/accounts/nearbysearch_proxy?location=${lat},${lng}&radius=3000&type=atm&keyword=chase`;

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  console.log("Response from API:", response);
  const json = await response.json();
  console.log("HEREEEE", json);
  return json;
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
  const [findAtmResponse, setFindAtmResponse] = useState([]);
  const [shouldShowSidebar, setShouldShowSidebar] = useState(false);
  const [mapCamera, setMapCamera] = useState<Position | null>(null);

  useEffect(() => {
    console.log("Getting user location...");
    if (navigator.geolocation) {
      console.log("Getting user location...2");
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          console.log("Getting user location...3");
          const { latitude, longitude } = pos.coords;
          // round to 3 decimal places
          const userPosition = { lat: latitude, lng: longitude };
          setPosition(userPosition);

          // Fetch ATM locations
          console.log("Getting user location...4");
          const atmData = await findChaseAtms(userPosition);
          setFindAtmResponse(atmData.results);
          console.log("atmData: ", atmData);
          console.log("atmData.results: ", atmData.results);
          console.log("atmData type", typeof atmData.results);
          console.log("findAtmResponse: ", findAtmResponse);

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
    <>
  <APIProvider apiKey={key}>
    <Navbar />
    <div className="flex justify-center items-center h-[calc(100vh-64px)] bg-gray-100 p-4">
      <div className="flex w-3/4 h-3/4 bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Map Section */}
        <div className="flex-1">
          <Map zoom={15} defaultCenter={position} mapId="3e43149384fef289" onCameraChanged={
            (ev: MapCameraChangedEvent) => {
            // console.log('camera changed', ev.detail)
            console.log('camera changed', ev.detail)
            setMapCamera({
              lat: ev.detail.center.lat,
              lng: ev.detail.center.lng,
            });

            const distanceFromCameraToUser = getDistanceInMiles(
              ev.detail.center.lat,
              ev.detail.center.lng,
              position.lat,
              position.lng
            );

            if (distanceFromCameraToUser > 5) {
              setShouldShowSidebar(true);
            } else {
              setShouldShowSidebar(false);
            }
          }}>
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
    </div>
  </APIProvider>

  {/* Sidebar Outside APIProvider */}
  <div className="absolute top-20 right-8 w-80 bg-white rounded-xl shadow-lg p-4 overflow-y-auto max-h-[calc(100vh-100px)]">
  <h1 className="text-2xl font-bold mb-4">Nearby ATMs</h1>
  <div className="flex flex-col gap-2">
    {findAtmResponse.map((atm, index) => (
      <button
        key={index}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        onClick={() => {
          setSelectedAtm({ lat: atm.geometry.location.lat, lng: atm.geometry.location.lng });
        }}
      >
        {atm.vicinity}
      </button>
    ))}
    </div>
  </div>
  
  {shouldShowSidebar && (
  <div className="absolute bottom-20 left-8 w-80 bg-white rounded-xl shadow-lg p-4 overflow-y-auto max-h-[calc(100vh-100px)]">
    <button
      className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
      onClick={async () => {
          const atmData = await findChaseAtms(mapCamera);
          setFindAtmResponse(atmData.results);
          console.log("atmData: ", atmData);
          console.log("atmData.results: ", atmData.results);
          console.log("atmData type", typeof atmData.results);
          console.log("findAtmResponse: ", findAtmResponse);

          const atmLocations = atmData.results.map((atm) => atm.geometry.location);
          console.log("ATM LOCATIONS");
          console.log(atmLocations);
          setAtms(atmLocations);

          setPosition(mapCamera);
          setShouldShowSidebar(false);
      }}>
        Search Again
    </button>
  </div>
  )}
</>


  );
}
