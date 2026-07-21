"use client";

import {
  GoogleMap,
  Marker,
  useLoadScript,
} from "@react-google-maps/api";

type Props = {
  liveLocation: any;
};

export default function Map({
  liveLocation,
}: Props) {

  const { isLoaded } =
    useLoadScript({
      googleMapsApiKey:
        process.env
          .NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    });

  if (!isLoaded)
    return <p>Loading Map...</p>;

  return (
    <GoogleMap
      zoom={14}
      center={
        liveLocation || {
          lat: 23.2599,
          lng: 77.4126,
        }
      }
      mapContainerClassName=
        "w-full h-[400px] rounded-2xl"
    >

      {
        liveLocation && (
          <Marker
            position={liveLocation}
          />
        )
      }

    </GoogleMap>
  );
}