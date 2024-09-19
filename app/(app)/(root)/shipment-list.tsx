import useAuth from "@/hooks/useAuth";
import { router } from "expo-router";
import { Text, View } from "react-native";


export default function ShipmentList() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text
        onPress={() => {
        }}
      >
        ShipmentList
      </Text>
    </View>
  );
}
