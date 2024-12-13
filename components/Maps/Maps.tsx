import React, {
  useEffect,
  useState,
  PropsWithChildren,
  useRef,
  createContext,
  useContext,
  Fragment,
} from "react";
import { Platform, StyleSheet } from "react-native";
import MapView, {
  AnimatedRegion,
  FitToOptions,
  LatLng,
  PROVIDER_GOOGLE,
  PROVIDER_DEFAULT,
  Region,
} from "react-native-maps";
import {
  getCurrentPositionAsync,
  requestForegroundPermissionsAsync,
} from "expo-location";

const DEFAULT_LATITUDE = 13.6693446;
const DEFAULT_LONGITUDE = 100.6058064;

interface MapContextProps {
  fitToCoordinates: (coordinates?: LatLng[], options?: FitToOptions) => void;
}

export const MapsContext = createContext<MapContextProps | null>(null);

interface MapProps extends PropsWithChildren {}

export default function Map({ children }: MapProps) {
  const mapRef = useRef<MapView>(null);
  const [notgranted, setGranted] = useState(false);
  const [region, setRegion] = useState<Region | AnimatedRegion>();

  useEffect(() => {
    const requestLocationPermission = async () => {
      console.log("Request notification permisssion!");
      try {
        const { status } = await requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("Permission to access location was denied");
          return;
        }
        await getCurrentLocation();
      } catch (err) {
        console.log("initial error");
        console.warn(err);
      }
    };

    const getCurrentLocation = async () => {
      setGranted(true);
      const location = await getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    };

    requestLocationPermission();
  }, []);

  function fitToCoordinates(coordinates?: LatLng[], options?: FitToOptions) {
    if (mapRef.current) {
      mapRef.current.fitToCoordinates(coordinates, options);
    }
  }

  if (!notgranted) {
    return <Fragment />;
  }

  return (
    <MapsContext.Provider value={{ fitToCoordinates }}>
      <MapView
        ref={mapRef}
        style={[StyleSheet.absoluteFillObject]}
        initialRegion={{
          latitude: DEFAULT_LATITUDE,
          longitude: DEFAULT_LONGITUDE,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        provider={
          Platform.OS === "android" ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
        }
      >
        {children}
      </MapView>
    </MapsContext.Provider>
  );
}

export const useMaps = () => {
  const context = useContext(MapsContext);
  if (!context)
    throw new Error("useMapsContext context must be use inside MapProvider");
  return context;
};
