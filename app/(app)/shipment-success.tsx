import Button from "@/components/Button";
import Iconify from "@/components/Iconify";
import Text from "@/components/Text";
import colors from "@constants/colors";
import { normalize } from "@/utils/normalizeSize";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { BackHandler, Image, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ShipmentSeccess() {
  const searchParam = useLocalSearchParams<{ trackingNumber: string }>();

  useEffect(() => {
    const backAction = () => {
      handleOnClose();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);

  function handleOnClose() {
    router.dismissAll();
    router.replace("/shipment");
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.wrapper}>
        <Image
          style={styles.image}
          source={require("@assets/images/shipment_success.png")}
        />
        <Text varient="h3" style={[styles.titleText, styles.textCenter]}>
          การส่งสำเร็จ
        </Text>
        <Text varient="body2" color="secondary" style={[styles.textCenter]}>
          ขอบคุณสำหรับการส่งสินค้า
        </Text>
        <Text
          varient="subtitle1"
          style={[styles.trackingNumber, styles.textCenter]}
        >
          {searchParam.trackingNumber}
        </Text>
        <Text varient="body2" color="secondary" style={[styles.textCenter]}>
          อย่างปลอดภัย
        </Text>
        <Text
          varient="body2"
          color="secondary"
          style={[styles.descriptionText, styles.textCenter]}
        >
          หากคุณมีคำถามเพิ่มเติมเกี่ยวกับการจัดส่ง
        </Text>
        <Text varient="body2" color="secondary" style={[styles.textCenter]}>
          โปรดอย่าลังเลที่จะติดต่อเรา เรายินดีที่จะช่วยเสมอ
        </Text>
        <View style={styles.actionsWrapper}>
          <Button
            varient="soft"
            size="large"
            title="กลับสู่หน้าการขนส่ง"
            fullWidth
            onPress={handleOnClose}
            EndIcon={
              <Iconify
                icon="flowbite:arrow-right-outline"
                color={colors.primary.dark}
              />
            }
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  wrapper: {
    flex: 1,
    paddingTop: normalize(32),
  },
  textCenter: {
    textAlign: "center",
  },
  titleText: {
    paddingTop: normalize(32),
    paddingBottom: normalize(8),
    color: colors.primary.darker,
  },
  descriptionText: {
    paddingTop: normalize(24),
  },
  trackingNumber: {
    color: colors.primary.dark,
  },
  actionsWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: normalize(24),
    paddingHorizontal: normalize(16),
    width: "100%",
  },
  image: {
    height: normalize(156),
    alignSelf: "center",
    resizeMode: "contain",
  },
});
