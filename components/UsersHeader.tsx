import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { normalize } from "@/utils/normalizeSize";
import Iconify from "./Iconify";
import Button from "./Button";
import colors from "@/constants/colors";
import { router } from "expo-router";

interface UsersHeader {
  containerStyle?: StyleProp<ViewStyle>;
}

export default function UsersHeader({ containerStyle }: UsersHeader) {
  function handleOnManage() {
    router.push('/employee/employees')
  }
  return (
    <View style={[containerStyle, styles.container]}>
      <View style={styles.wrapper}>
        <Button
          onPress={handleOnManage}
          fullWidth
          style={{ padding: 0 }}
          size="medium"
          color="info"
          varient="soft"
          title="จัดการคนขับรถ"
          StartIcon={<Iconify icon="typcn:user" color={colors.info.dark} />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  titleWrapper: {
    flex: 1,
    gap: normalize(8),
    paddingLeft: normalize(8),
  },
});
