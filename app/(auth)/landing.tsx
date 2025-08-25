import Button from "@/components/Button";
import SplashScreen from "@/components/SplashScreen";
import Text from "@/components/Text";
import useAuth from "@/hooks/useAuth";
import Colors from "@constants/colors";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { Fragment, useEffect } from "react";
import { View, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  requestBackgroundPermissionsAsync,
  requestForegroundPermissionsAsync,
} from "expo-location";

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.common.white,
    flex: 1,
  },
  wrapper: {
    flexDirection: "column",
    alignItems: "flex-start",
    flex: 1,
  },
  imageWrapper: {
    flex: 1,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  image: {
    flex: 1,
    left: 0,
    right: 0,
    width: "100%",
    alignSelf: "center",
    borderRadius: 32,
  },
  buttonWrapper: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    width: "100%",
    gap: 12,
  },
  textWrapper: {
    flex: 1,
    gap: 4,
    paddingHorizontal: 24,
  },
});

export default function Landing() {
  const { isAuthenticated, isInitialized } = useAuth();
  function handleRegister() {
    router.push("/register");
  }
  function handleLogin() {
    router.push("/login");
  }

  useEffect(() => {
    mapsPermissionRequest();
  }, []);

  async function mapsPermissionRequest() {
    console.log("Request notification permisssion!");
    try {
      const { status: foregroundStatus } =
        await requestForegroundPermissionsAsync();
      if (foregroundStatus !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }
      const { status: backgroundStatus } =
        await requestBackgroundPermissionsAsync();
      if (backgroundStatus !== "granted") {
        console.log("Background location permission not granted");
        return false;
      }
    } catch (err) {
      console.log("initial error");
      console.warn(err);
    }
  }

  if (isAuthenticated || !isInitialized) {
    // router.replace("/(app)/(root)");
    return <SplashScreen />;
  }

  return (
    <Fragment>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.container}>
        <View style={styles.imageWrapper}>
          <Image
            style={styles.image}
            source={require("@assets/images/landing_p1.jpg")}
          />
        </View>
        <View style={styles.wrapper}>
          <View style={styles.textWrapper}>
            <Text varient="h2">{`ยินดีต้อนรับสู่, Movemate`}</Text>
            <Text varient="body2" color="secondary">
              {`ดูและจัดการสินค้าที่คุณส่งได้ง่ายดาย \nทุกรายการมีรายละเอียด`}
            </Text>
          </View>
          <View style={styles.buttonWrapper}>
            <Button
              fullWidth
              varient="contained"
              title="สมัครสมาชิก"
              size="large"
              onPress={handleRegister}
            />
            <Button
              fullWidth
              varient="outlined"
              color="inherit"
              title="เข้าสู่ระบบ"
              size="large"
              onPress={handleLogin}
            />
          </View>
        </View>
      </SafeAreaView>
    </Fragment>
  );
}
