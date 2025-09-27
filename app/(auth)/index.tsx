import Button from "@/components/Button";
import Text from "@/components/Text";
import Colors from "@constants/colors";
import useAuth from "@/hooks/useAuth";
import { Redirect, router } from "expo-router";
import React, { Fragment } from "react";
import { View, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Colors.common.white,
    flexDirection: "column",
    alignItems: "center",
    padding: 24,
  },
  imageWrapper: {
    flex: 1,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    flex: 1,
    left: 0,
    right: 0,
    width: "100%",
    alignSelf: "center",
  },
  buttonWrapper: {
    marginTop: 24,
    paddingVertical: 16,
    width: "100%",
  },
  description: {
    textAlign: "center",
  },
});

export default function GetStarted() {
  const { isFirstLaunch } = useAuth();

  function handleGetStarted() {
    router.replace("/landing");
  }

  if (!isFirstLaunch) {
    return <Redirect href="/landing" />;
  }

  return (
    <Fragment>
      <View style={styles.imageWrapper}>
        <Image
          style={styles.image}
          source={require("@/assets/images/getstarted_p1.jpg")}
        />
      </View>
      <SafeAreaView edges={["bottom"]}>
        <View style={styles.wrapper}>
          <Text varient="h2">ร่วมงานกับเรา</Text>
          <Text
            varient="body2"
            style={[styles.description, { color: Colors.text.secondary }]}
          >
            {`Movemate เป็นธุรกิจในการจองรถขนส่งแบบเหมาคัน\nใช้งานสะดวกเพราะมีเทคโนโลยีมารองรับ\nใช้งานง่ายไม่ซับซ้อน`}
          </Text>
          <View style={styles.buttonWrapper}>
            <Button
              fullWidth
              varient="contained"
              title="เริ่มเลย"
              size="large"
              onPress={handleGetStarted}
            />
          </View>
        </View>
      </SafeAreaView>
    </Fragment>
  );
}
