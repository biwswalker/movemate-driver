import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { normalize } from "@/utils/normalizeSize";
import Iconify from "./Iconify";
import Button from "./Button";
import colors from "@/constants/colors";
import { router } from "expo-router";
import useAuth from "@/hooks/useAuth";
import { EUserStatus } from "@/graphql/generated/graphql";

interface UsersHeader {
  containerStyle?: StyleProp<ViewStyle>;
}

export default function UsersHeader({ containerStyle }: UsersHeader) {
  const { user } = useAuth();
  function handleOnManage() {
    router.push("/employee/employees");
  }
  return (
    <View style={[containerStyle, styles.container]}>
      <View style={styles.wrapper}>
        <Button
          disabled={user?.status !== EUserStatus.ACTIVE}
          onPress={handleOnManage}
          fullWidth
          style={{ padding: 0 }}
          size="medium"
          color="info"
          varient="soft"
          title="จัดการคนขับรถ"
          StartIcon={
            <Iconify
              icon="typcn:user"
              color={
                user?.status !== EUserStatus.ACTIVE
                  ? colors.text.disabled
                  : colors.info.dark
              }
            />
          }
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
