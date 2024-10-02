import { get, isEmpty, map } from "lodash";
import React, { useEffect } from "react";
import { LatLng, Polyline } from "react-native-maps";
import { useMaps } from "./Maps";
import colors from "@/constants/colors";

interface DirectionsProps {
  directions: google.maps.DirectionsResult;
  routeIndex?: number;
}

export default function Direction({
  directions,
  routeIndex = 0,
}: DirectionsProps) {
  const { fitToCoordinates } = useMaps();
  const coordinatesRawFormGoogle = get(
    directions,
    `routes.${routeIndex}.overview_path`,
    []
  );
  const coordinates = map(coordinatesRawFormGoogle, (cord) => {
    const latitude = get(cord, "lat", 0);
    const longitude = get(cord, "lng", 0);
    return { latitude, longitude };
  }) as LatLng[];

  useEffect(() => {
    if (coordinates && !isEmpty(coordinates)) {
      fitToCoordinates(coordinates, {
        edgePadding: { top: 28, right: 28, bottom: 28, left: 28 },
        animated: true,
      });
    }
  }, [directions]);

  if (!coordinates || isEmpty(coordinates)) {
    return <></>;
  }

  return (
    <Polyline
      coordinates={coordinates}
      strokeWidth={4}
      strokeColor={colors.error.main}
    />
  );
}
