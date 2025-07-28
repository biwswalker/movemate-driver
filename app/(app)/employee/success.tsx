import React, { useEffect } from "react";
import Text from "@components/Text";
import Button from "@components/Button";
import { BackHandler, Image, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { get } from "lodash";
import { Iconify } from "react-native-iconify";
import { normalize } from "@utils/normalizeSize";
import { router, useLocalSearchParams } from "expo-router";
import { EDriverType, RegisterPayload } from "@/graphql/generated/graphql";
import colors from "@constants/colors";

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

export default function EmployeeRegisterSuccessScreen() {
  const searchParam = useLocalSearchParams<{ param: string }>();
  const params = JSON.parse(searchParam.param) as RegisterPayload;
  const isBusinessRegisted = params.driverType === EDriverType.BUSINESS;
  const phoneNumber = get(params, "phoneNumber", "");
  const subtitleIndividual = `ขอบคุณสำหรับการสมัครสมาชิกขับรถรูปแบบ\nส่วนบุคคลกับ Movemate`;
  const subtitle2 = `คนขับจะได้รับข้อความแจ้งสถานะการสมัครสมาชิก\nผ่านทาง SMS ภายใน 1-3 วันทำการ \nโดยเราจะส่งข้อความไปยัง\n`;
  const subtitle3 = ` \nโปรดตรวจสอบข้อความของท่าน`;

  useEffect(() => {
    const backAction = () => {
      handleGoToList();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);

  function handleGoToList() {
    router.navigate("/employee/employees");
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.sectionContainer}>
        <Image
          style={styles.secureImage}
          source={require("@assets/images/registered_success.png")}
        />
        <Text varient="h3" style={[styles.titleText, styles.textCenter]}>
          เพิ่มคนขับสำเร็จ
        </Text>
        {/* <Text varient="caption" color="secondary" style={styles.textCenter}>
          {isBusinessRegisted ? subtitleBusiness : subtitleIndividual}
        </Text> */}
        <Text
          varient="caption"
          color="secondary"
          style={[styles.subTitleText, styles.textCenter]}
        >
          {subtitle2}
          <Text varient="caption" style={styles.emailText}>
            {phoneNumber}
          </Text>
          {/* {subtitle3} */}
        </Text>
        <View style={styles.actionWrapper}>
          <Button
            fullWidth
            size="large"
            varient="soft"
            title="กลับไปรายการคนขับ"
            onPress={handleGoToList}
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
