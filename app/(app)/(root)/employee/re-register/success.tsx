import React, { useEffect } from "react";
import Text from "@components/Text";
import Button from "@components/Button";
import { Image, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Iconify } from "react-native-iconify";
import { normalize } from "@utils/normalizeSize";
import { router } from "expo-router";
import colors from "@constants/colors";
import useAuth from "@/hooks/useAuth";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.common.white,
  },
  headerWrapper: {
    paddingHorizontal: normalize(16),
  },
  rowWrapper: {
    flexDirection: "row",
  },
  sectionContainer: {
    marginTop: normalize(32),
    paddingHorizontal: normalize(16),
  },
  titleText: {
    color: colors.primary.darker,
    marginTop: normalize(48),
    marginBottom: normalize(16),
  },
  textCenter: {
    textAlign: "center",
  },
  subTitleText: {
    marginTop: normalize(24),
  },
  emailText: {
    color: colors.primary.darker,
  },
  actionWrapper: {
    marginTop: normalize(32),
  },
  secureImage: {
    height: normalize(180),
    alignSelf: "center",
    resizeMode: "contain",
  },
  actionTextWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: normalize(16),
    gap: normalize(4),
  },
  textButton: {
    color: colors.info.main,
    textAlign: "justify",
  },
});

export default function ReRegisterSuccessScreen() {
  const { refetchMe } = useAuth();
  const subtitle = `ขอบคุณสำหรับการสมัครสมาชิกเราจะดำเนินการตรวจสอบบัญชีของท่าน`;
  const subtitle2 = `คุณจะได้รับข้อความแจ้งเตือนสถานะการสมัครสมาชิก\nผ่านทาง Notification ภายใน 1-3 วันทำการ`;

  useEffect(() => {
    refetchMe();
  }, []);

  function handleGoToLanding() {
    router.replace("/employee/employees");
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.sectionContainer}>
        <Image
          style={styles.secureImage}
          source={require("@assets/images/registered_success.png")}
        />
        <Text varient="h3" style={[styles.titleText, styles.textCenter]}>
          ขอบคุณที่ร่วมสมัคร
        </Text>
        <Text varient="caption" color="secondary" style={styles.textCenter}>
          {subtitle}
        </Text>
        <Text
          varient="caption"
          color="secondary"
          style={[styles.subTitleText, styles.textCenter]}
        >
          {subtitle2}
        </Text>
        <View style={styles.actionWrapper}>
          <Button
            fullWidth
            size="large"
            varient="soft"
            title="กลับสู่หน้าหลัก"
            onPress={handleGoToLanding}
            EndIcon={
              <Iconify
                icon="flowbite:arrow-right-outline"
                size={24}
                color={colors.primary.dark}
              />
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
