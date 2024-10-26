import ButtonIcon from "@components/ButtonIcon";
import Text, { FONT_NAME } from "@components/Text";
import React, { useMemo } from "react";
import {
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { Iconify } from "react-native-iconify";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import RenderHtml, {
  defaultSystemFonts,
  MixedStyleDeclaration,
  MixedStyleRecord,
} from "react-native-render-html";
import { normalize } from "@utils/normalizeSize";
import {
  SettingDriverPolicies,
  useGetDriverPoliciesInfoQuery,
} from "@graphql/generated/graphql";
import colors from "@constants/colors";
import { router } from "expo-router";
import useSnackbar from "@/hooks/useSnackbar";
import { ActivityIndicator } from "react-native-paper";

const styles = StyleSheet.create({
  superContainer: {
    flex: 1,
    backgroundColor: colors.common.white,
  },
  container: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
    gap: 16,
  },
  headerWrapper: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    position: "relative",
  },
  headerText: {
    textAlign: "center",
    flex: 1,
  },
  headerActionWrapper: {
    width: normalize(40),
    position: "absolute",
    right: normalize(16),
  },
  contentWrapper: {
    paddingBottom: 16,
  },
  loadingWrapper: {
    paddingVertical: normalize(32),
  },
  checkboxWrapper: {
    paddingBottom: 32,
    pointerEvents: "auto",
  },
  scrollViewWrapper: {
    paddingHorizontal: normalize(16),
  },
  actionWrapper: {
    paddingBottom: normalize(64),
  },
  checkboxTextWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 4,
    flexWrap: "wrap",
  },
  underlineText: {
    textDecorationLine: "underline",
  },
});

export default function ProfilePolicy() {
  const { showSnackbar } = useSnackbar();
  const insets = useSafeAreaInsets();
  const isPresented = router.canGoBack();
  const { width } = useWindowDimensions();

  const { data, loading } = useGetDriverPoliciesInfoQuery({
    onError: (error: Error) => {
      console.log("error: ", error.message);
      showSnackbar({ message: error.message, varient: "warning" });
    },
  });

  const policy = useMemo<SettingDriverPolicies | undefined>(
    () => data?.getDriverPoliciesInfo || undefined,
    [data]
  );

  function onClosePrivacyPolicy(_event: NativeSyntheticEvent<any>) {
    if (isPresented) {
      router.dismiss();
    }
  }

  const baseStyle: MixedStyleDeclaration = {
    fontFamily: FONT_NAME.PROMPT_REGULAR,
    lineHeight: normalize(24),
    fontSize: normalize(16),
    color: colors.text.primary,
  };

  const tagStyle: MixedStyleRecord = {
    strong: { fontFamily: FONT_NAME.PROMPT_BOLD },
    em: { fontFamily: FONT_NAME.PROMPT_ITALIC },
  };

  const systemFonts = [...defaultSystemFonts, FONT_NAME.PROMPT_REGULAR];

  return (
    <View style={styles.superContainer}>
      <SafeAreaView style={[styles.container, { paddingTop: insets.top / 2 }]}>
        <View style={styles.wrapper}>
          <View style={styles.headerWrapper}>
            <Text style={styles.headerText} varient="h6">
              {`ข้อกำหนดหารให้บริการ\nและนโยบายส่วนตัว`}
            </Text>
            <View style={styles.headerActionWrapper}>
              <ButtonIcon
                onPress={onClosePrivacyPolicy}
                varient="text"
                color="inherit"
              >
                {({ color }) => (
                  <Iconify icon="mi:close" size={24} color={color} />
                )}
              </ButtonIcon>
            </View>
          </View>
          <ScrollView style={styles.scrollViewWrapper}>
            <View style={styles.contentWrapper}>
              {loading && (
                <View style={styles.loadingWrapper}>
                  <ActivityIndicator
                    size="small"
                    color={colors.text.secondary}
                  />
                </View>
              )}
              {policy && (
                <RenderHtml
                  contentWidth={width}
                  source={{
                    html: policy.driverPolicies || "",
                  }}
                  tagsStyles={tagStyle}
                  baseStyle={baseStyle}
                  systemFonts={systemFonts}
                />
              )}
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}
