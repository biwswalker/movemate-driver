import React, { useEffect } from "react";
import Text from "@components/Text";
import Button from "@components/Button";
import { BackHandler, Image, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Iconify } from "react-native-iconify";
import { normalize } from "@utils/normalizeSize";
import { router } from "expo-router";
import colors from "@constants/colors";

export default function ResetPasswordSuccessScreen() {
  const subtitle = `คุณได้เปลี่ยนรหัสผ่านเรียบร้อยแล้ว\nคุณสามารถลงชื่อเข้าใช้ได้เลย`;

  useEffect(() => {
    const backAction = () => {
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);

  function handleGoToLogin() {
    router.navigate("/login");
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.sectionContainer}>
        <Image
          style={styles.secureImage}
          source={require("@assets/images/registered_success.png")}
        />
        <Text varient="h3" style={[styles.titleText, styles.textCenter]}>
          เปลี่ยนรหัสผ่านสำเร็จ
        </Text>
        <Text
          varient="body2"
          color="secondary"
          style={[styles.subTitleText, styles.textCenter]}
        >
          {subtitle}
        </Text>
        <View style={styles.actionWrapper}>
          <Button
            fullWidth
            size="large"
            varient="soft"
            title="ลงชื่อเข้าใช้"
            onPress={handleGoToLogin}
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
    marginTop: normalize(72),
    paddingHorizontal: normalize(16),
  },
  titleText: {
    color: colors.primary.darker,
    marginTop: normalize(48),
  },
  textCenter: {
    textAlign: "center",
  },
  subTitleText: {
    marginTop: normalize(8),
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
