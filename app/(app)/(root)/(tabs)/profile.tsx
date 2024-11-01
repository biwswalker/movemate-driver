import React from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Text from "@components/Text";
import { normalize } from "@utils/normalizeSize";
import Iconify from "@components/Iconify";
import hexToRgba from "hex-to-rgba";
import { imagePath } from "@utils/file";
import { ScrollView } from "react-native-gesture-handler";
import colors from "@constants/colors";
import useAuth from "@/hooks/useAuth";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { EUserStatus } from "@/graphql/generated/graphql";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.common.white,
  },
  wrapper: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
    paddingTop: normalize(24),
    alignItems: "center",
  },
  textCenter: {
    textAlign: "center",
  },
  infoTextContainer: {
    marginBottom: normalize(24),
    flexGrow: 1,
    flex: 1,
    width: "100%",
    paddingHorizontal: normalize(24),
  },
  infoTextWrapper: {
    backgroundColor: hexToRgba(colors.warning.main, 0.08),
    borderRadius: 8,
    padding: normalize(16),
    gap: normalize(4),
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrapper: {
    minWidth: normalize(32),
  },
  infoText: {
    color: colors.warning.dark,
  },
  userInfoWrapper: {
    alignItems: "center",
  },
  userInfoTextWrapper: {
    paddingTop: normalize(8),
    alignItems: "center",
  },
  menuWrapper: {
    width: "100%",
    paddingTop: normalize(32),
    paddingBottom: normalize(104),
  },
  menuItemWrapper: {
    width: "100%",
  },
});

export default function Profile() {
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    router.replace("/landing");
  }

  const userImageUri = user?.profileImage
    ? { uri: imagePath(user.profileImage.filename || "") }
    : require("@assets/images/user-duotone-large.png");

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.wrapper}>
        <ScrollView>
          <View style={styles.contentWrapper}>
            {user?.status === EUserStatus.PENDING && <PendingApproval />}
            <View style={styles.userInfoWrapper}>
              <Image
                source={userImageUri}
                tintColor={colors.text.secondary}
                style={{
                  width: normalize(100),
                  height: normalize(100),
                  borderRadius: normalize(50),
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
                varient="body2"
                color="secondary"
                style={[{ paddingHorizontal: normalize(16) }]}
              >
                ตั้งค่าโปรไฟล์
              </Text>
              <View style={styles.menuItemWrapper}>
                <Item
                  label="ข้อมูลส่วนตัว"
                  onPress={() => router.push('/profile-detail')}
                />
                <Item
                  label="ข้อมูลเอกสาร"
                  onPress={() => router.push('/profile-document')}
                />
                <Item
                  label="งานขนส่ง/แจ้งเตือน"
                  onPress={() => router.push('/profile-setting')}
                />
              </View>
              <Text
                varient="body2"
                color="secondary"
                style={[{ paddingHorizontal: normalize(16), paddingTop: normalize(16) }]}
              >
                ข้อกำหนด
              </Text>
              <View style={styles.menuItemWrapper}>
                <Item
                  label="ข้อกำหนดการให้บริการ"
                  onPress={() => router.push('/profile-policy')}
                />
              </View>
              <View
                style={{
                  alignItems: "flex-start",
                  paddingHorizontal: normalize(16),
                  paddingTop: normalize(16),
                }}
              >
                <TouchableOpacity onPress={handleLogout}>
                  <Text
                    varient="body1"
                    style={{ width: normalize(64), color: colors.error.main }}
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
          size={normalize(18)}
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
    paddingVertical: normalize(12),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center',
    paddingHorizontal: normalize(16),
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
          size={normalize(16)}
          color={colors.text.primary}
        />
      </View>
    </TouchableOpacity>
  );
}
