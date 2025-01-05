import {
  Destination,
  EShipmentStatus,
  Shipment,
} from "@/graphql/generated/graphql";
import { StyleSheet, View } from "react-native";
import Text from "../Text";
import colors from "@constants/colors";
import Iconify from "../Iconify";
import { includes, isEmpty, map } from "lodash";
import { normalize } from "@/utils/normalizeSize";
import hexToRgba from "hex-to-rgba";
import Maps from "../Maps/Maps";
import { useMemo } from "react";
import { LatLng, Marker } from "react-native-maps";
import Direction from "../Maps/Direction";

interface IMapsProps {
  shipment: Shipment;
}

export default function MapsComponent({ shipment }: IMapsProps) {
  const destinations = useMemo(() => {
    if (!isEmpty(shipment.destinations) && shipment.destinations) {
      return shipment.destinations;
    }
    return [];
  }, [shipment.destinations]);

  const direction = useMemo<google.maps.DirectionsResult | undefined>(() => {
    if (shipment.route) {
      if (shipment.route.rawData) {
        const rawData = shipment.route.rawData;
        const direction = JSON.parse(rawData);
        return direction;
      }
    }
    return undefined;
  }, [shipment.route]);

  // if (destinations && direction) {
  //   return <ShipmentMaps destinations={destinations} direction={direction} />;
  // }
  if (
    includes(
      [EShipmentStatus.IDLE, EShipmentStatus.PROGRESSING],
      shipment?.status
    ) &&
    destinations &&
    direction
  ) {
    return <ShipmentMaps destinations={destinations} direction={direction} />;
  }
  return <MapsDone />;
}

interface ShipmentMapsProps {
  destinations: Destination[];
  direction: google.maps.DirectionsResult;
}

function ShipmentMaps({ destinations, direction }: ShipmentMapsProps) {
  return (
    <Maps>
      {map(destinations, (destination, index) => {
        const cord: LatLng = destination.location;
        if (index === 0) {
          return (
            <Marker
              tracksViewChanges={false}
              coordinate={cord}
              anchor={{ x: 0.25, y: 0.75 }}
              key={`${destination.placeId}-${index}`}
            >
              <View
                style={[
                  styles.boxIconWrapper,
                  { backgroundColor: hexToRgba(colors.master.lighter, 0.72) },
                ]}
              >
                <Iconify
                  icon="solar:box-bold-duotone"
                  size={24}
                  color={colors.primary.main}
                />
              </View>
            </Marker>
          );
        } else if (index > 0) {
          return (
            <Marker
              tracksViewChanges={false}
              coordinate={cord}
              anchor={{ x: 0.25, y: 0.75 }}
              key={`${destination.placeId}-${index}`}
            >
              <View
                style={[
                  styles.boxNumberWrapper,
                  {
                    backgroundColor: hexToRgba(colors.secondary.lighter, 0.82),
                    width: 24,
                    height: 24,
                  },
                ]}
              >
                <Text
                  varient="overline"
                  style={{ color: colors.secondary.main }}
                >
                  {index}
                </Text>
              </View>
            </Marker>
          );
        }
      })}
      {destinations && <Direction directions={direction} />}
    </Maps>
  );
}

function MapsDone() {
  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Iconify icon="logos:google-maps" size={normalize(144)} />
        <View style={styles.textsContainer}>
          <Text varient="h3" style={{ color: colors.primary.dark }}>
            เสร็จสิ้นแล้ว
          </Text>
          <Text varient="body2" color="disabled">
            งานขนส่งดำเนินการเสร็จสิ้นแล้ว
          </Text>
        </View>
      </View>
      <View style={[styles.spacing]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: hexToRgba(colors.background.default, 0.5),
  },
  wrapper: {
    flex: 2,
    gap: normalize(16),
    alignItems: "center",
    justifyContent: "center",
  },
  textsContainer: {
    gap: normalize(4),
    alignItems: "center",
    justifyContent: "center",
  },
  spacing: {
    flex: 1,
  },
  boxIconWrapper: {
    marginTop: 8,
    padding: 4,
    backgroundColor: colors.master.lighter,
    alignSelf: "flex-start",
    borderRadius: 16,
  },
  boxNumberWrapper: {
    marginTop: 8,
    width: 32,
    height: 32,
    backgroundColor: colors.secondary.lighter,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    borderRadius: 16,
  },
});
