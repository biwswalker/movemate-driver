import colors from "@/constants/colors";
import { StyleSheet, View } from "react-native";

export default function Notifications() {
  return (
    <View style={styles.container}>
      <View style={styles.wrapper}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.common.white,
  },
  wrapper: {
    flex: 1,
  },
});
