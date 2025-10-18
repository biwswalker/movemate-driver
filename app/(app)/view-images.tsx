import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { SafeAreaView } from "react-native-safe-area-context";
import NavigationBar from "@/components/NavigationBar";

export default function ViewImageScreen() {
  const { back } = useRouter();
  const { uri } = useLocalSearchParams<{ uri: string }>();
  const backgroundColor = useThemeColor({}, "background");

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.wrapper}>
        <NavigationBar
          onBack={back}
          containerStyle={styles.navigator}
        />
        <View style={[styles.content, { backgroundColor }]}>
          {uri ? (
            <Image source={{ uri }} style={styles.image} resizeMode="contain" />
          ) : null}
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: 'stretch',
  },
  navigator: {
    paddingVertical: 24,
  },
  textCenter: {
    textAlign: "center",
  },
});
