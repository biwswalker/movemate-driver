import Colors from "@constants/colors";
import NavigationBar from "@components/NavigationBar";
import Text from "@components/Text";
import { normalize } from "@utils/normalizeSize";
import hexToRgba from "hex-to-rgba";
import React, { useEffect, useRef } from "react";
import { Fragment } from "react";
import {
  Animated,
  BackHandler,
  Dimensions,
  Easing,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { EDriverType } from "@/graphql/generated/graphql";

export default function RegisterStarted() {
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

  function handleSelectedDriverType(driverType: EDriverType) {
    router.setParams({ driverType });
    router.push({
      pathname: "/register/privacy-policy",
      params: { driverType },
    });
  }

  function handleOnClose() {
    if (router.canDismiss()) {
      router.dismissAll();
      router.replace("/(auth)/landing");
    }
  }

  return (
    <Fragment>
      <SafeAreaView style={styles.container}>
        <NavigationBar onBack={handleOnClose} />
        <View style={styles.headerWrapper}>
          <Text varient="h3">สมัครสมาชิก</Text>
          <Text varient="body2" color="disabled">
            กรุณาเลือกประเภทการสมัคร
          </Text>
        </View>
        <RegisterTypeCard onSelectDriverType={handleSelectedDriverType} />
      </SafeAreaView>
    </Fragment>
  );
}

interface RegisterTypeCardProps {
  onSelectDriverType: (driverType: EDriverType) => void;
}

function RegisterTypeCard({ onSelectDriverType }: RegisterTypeCardProps) {
  const screenWidth = Dimensions.get("screen").width;
  const translateX4WDAnim = useRef(new Animated.Value(0)).current;
  const translateXAWDAnim = useRef(new Animated.Value(0)).current;

  const startAnimation = () => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(translateX4WDAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(translateXAWDAnim, {
          toValue: 1,
          duration: 600,
          delay: 126,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.spring(translateX4WDAnim, {
          toValue: 0.96,
          useNativeDriver: true,
        }),
        Animated.spring(translateXAWDAnim, {
          toValue: 0.97,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  const translateX4WD = translateX4WDAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [screenWidth, screenWidth - normalize(212)],
  });

  const translateXAWD = translateXAWDAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [screenWidth, screenWidth - normalize(274)],
  });

  useEffect(() => {
    startAnimation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handlePressDriverType(type: EDriverType) {
    onSelectDriverType(type);
  }

  return (
    <View style={styles.contentWrapper}>
      <View style={styles.cardContainer}>
        <TouchableOpacity
          onPress={() => handlePressDriverType(EDriverType.INDIVIDUAL_DRIVER)}
        >
          <View style={styles.cardWrapper}>
            <Text varient="body1" color="disabled">
              ประเภท
            </Text>
            <Text varient="h3" style={styles.cardTitle}>
              คนขับรถส่วนบุคคล
            </Text>
          </View>
        </TouchableOpacity>
        <Animated.View
          style={[
            styles.truckImageContainer,
            {
              transform: [
                { translateY: normalize(32) },
                { translateX: translateX4WD },
              ],
            },
          ]}
        >
          <Image
            style={[styles.truckImage]}
            source={require("@assets/images/4WDThumb.png")}
          />
        </Animated.View>
      </View>
      <View style={styles.cardContainer}>
        <TouchableOpacity
          onPress={() => handlePressDriverType(EDriverType.BUSINESS)}
        >
          <View style={styles.cardWrapper}>
            <Text varient="body1" color="disabled">
              ประเภท
            </Text>
            <Text varient="h3" style={styles.cardTitle}>
              นายหน้า/บริษัท
            </Text>
          </View>
        </TouchableOpacity>
        <Animated.View
          style={[
            styles.trucksImageContainer,
            {
              transform: [
                { translateY: normalize(12) },
                { translateX: translateXAWD },
              ],
            },
          ]}
        >
          <Image
            style={styles.trucksImage}
            source={require("@assets/images/AWDThumb.png")}
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerWrapper: {
    paddingHorizontal: normalize(16),
  },
  contentWrapper: {
    marginTop: normalize(32),
    gap: 12,
  },
  cardContainer: {
    position: "relative",
    paddingBottom: normalize(32),
    paddingHorizontal: normalize(16),
  },
  cardWrapper: {
    borderWidth: 2,
    borderRadius: 16,
    borderColor: hexToRgba(Colors.master.lighter, 0.82),
    padding: 16,
    paddingBottom: normalize(72),
  },
  cardTitle: {
    color: Colors.primary.darker,
  },
  truckImageContainer: {
    pointerEvents: "none",
    position: "absolute",
  },
  truckImage: {
    pointerEvents: "none",
    position: "absolute",
    // height: normalize(124),
    width: normalize(224),
    resizeMode: "contain",
  },
  trucksImageContainer: {
    pointerEvents: "none",
    position: "absolute",
  },
  trucksImage: {
    pointerEvents: "none",
    position: "absolute",
    // height: normalize(144),
    width: normalize(364),
    resizeMode: "contain",
  },
});
