import React from "react";
import { SafeAreaView, StyleSheet, TouchableOpacity, View } from "react-native";
import Text from "@components/Text";
import { normBaseW } from "@utils/normalizeSize";
import Iconify from "@components/Iconify";
import hexToRgba from "hex-to-rgba";
import AccountHeader from "@components/AccountHeader";
import { Avatar } from "react-native-paper";
import { imagePath } from "@utils/file";
import { ScrollView } from "react-native-gesture-handler";
import colors from "@/constants/colors";
import useAuth from "@/hooks/useAuth";
import { router } from "expo-router";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.common.white,
  },
  wrapper: {
    flex: 1,
  },
  accountContainer: {
    paddingHorizontal: 32,
    paddingBottom: 8,
  },
  contentWrapper: {
    flex: 1,
    paddingTop: normBaseW(24),
    alignItems: "center",
  },
  textCenter: {
    textAlign: "center",
  },
  infoTextContainer: {
    marginBottom: 24,
    flexGrow: 1,
    flex: 1,
    width: "100%",
    paddingHorizontal: 24,
  },
  infoTextWrapper: {
    backgroundColor: hexToRgba(colors.warning.main, 0.08),
    borderRadius: 8,
    padding: 16,
    gap: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrapper: {
    minWidth: 32,
  },
  infoText: {
    color: colors.warning.dark,
  },
  userInfoWrapper: {
    alignItems: "center",
  },
  userInfoTextWrapper: {
    paddingTop: 8,
    alignItems: "center",
  },
  menuWrapper: {
    width: "100%",
    paddingTop: 32,
    paddingBottom: 104,
  },
  menuItemWrapper: {
    paddingTop: 8,
    width: "100%",
  },
});

export default function Profile() {
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    router.replace('/landing')
  }

  const userImageUri = user?.profileImage
    ? { uri: imagePath(user.profileImage.filename || "") }
    : require("@assets/images/user-duotone-large.png");

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.wrapper}>
        <AccountHeader style={styles.accountContainer} />
        <ScrollView>
          <View style={styles.contentWrapper}>
            {user?.status === "pending" && <PendingApproval />}
            <View style={styles.userInfoWrapper}>
              <Avatar.Image
                size={normBaseW(108)}
                source={userImageUri}
                style={{
                  backgroundColor: colors.common.white,
                  borderColor: colors.divider,
                  borderWidth: 1,
                  borderStyle: "dashed",
                }}
              />
              <View style={styles.userInfoTextWrapper}>
                <Text varient="h5">{user?.fullname}</Text>
                <Text varient="body2" color="secondary">
                  {user?.username}
                </Text>
              </View>
            </View>
            <View style={[styles.menuWrapper]}>
              <Text
                varient="caption"
                color="secondary"
                style={[{ paddingHorizontal: 32 }]}
              >
                ตั้งค่าโปรไฟล์
              </Text>
              <View style={styles.menuItemWrapper}>
                <Item
                  label="ข้อมูลส่วนตัว"
                  onPress={() => {}} // navigation.navigate("ProfileInfo")
                />
                <Item
                  label="ข้อมูลเอกสาร"
                  onPress={() => {}} // navigation.navigate("ProfileInfo")
                />
                <Item
                  label="งานขนส่ง/แจ้งเตือน"
                  onPress={() => {}} // navigation.navigate("ProfileNotification")
                />
              </View>
              <Text
                varient="caption"
                color="secondary"
                style={[{ paddingHorizontal: 32, paddingTop: 16 }]}
              >
                ข้อกำหนด
              </Text>
              <View style={styles.menuItemWrapper}>
                <Item
                  label="ข้อกำหนดการให้บริการ"
                  onPress={() => {}} // navigation.navigate("ProfileTerm")
                />
              </View>
              <View
                style={{
                  alignItems: "flex-start",
                  paddingHorizontal: 32,
                  paddingTop: 16,
                }}
              >
                <TouchableOpacity onPress={handleLogout}>
                  <Text
                    varient="body2"
                    style={{ width: normBaseW(64), color: colors.error.main }}
                  >
                    ลงชื่อออก
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function PendingApproval() {
  return (
    <View style={styles.infoTextContainer}>
      <View style={styles.infoTextWrapper}>
        <Iconify
          icon="iconoir:warning-circle-solid"
          size={18}
          color={colors.warning.dark}
          style={styles.iconWrapper}
        />
        <Text varient="body2" style={styles.infoText}>
          บัญชีของคุณรอการตรวจสอบจากผู้ดูแล
        </Text>
      </View>
    </View>
  );
}

const itemStyled = StyleSheet.create({
  wrapper: {
    width: "100%",
    paddingVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 32,
  },
});

interface ItemProps {
  label: string;
  onPress: Function;
}

function Item({ onPress, label }: ItemProps) {
  function handleOnPress() {
    onPress();
  }
  return (
    <TouchableOpacity onPress={handleOnPress}>
      <View style={itemStyled.wrapper}>
        <Text varient="body1">{label}</Text>
        <Iconify
          icon="mi:chevron-right"
          size={24}
          color={colors.text.primary}
        />
      </View>
    </TouchableOpacity>
  );
}
