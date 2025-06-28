import Colors from "@constants/colors";
import { ApolloError } from "@apollo/client";
import Button from "@components/Button";
import FormProvider from "@components/HookForm/FormProvider";
import RHFTextInput from "@components/HookForm/RHFTextInput";
import NavigationBar from "@components/NavigationBar";
import Text from "@components/Text";
import { YUP_VALIDATION_ERROR_TYPE } from "@constants/error";
import {
  ForgotPasswordMutation,
  useForgotPasswordMutation,
} from "@graphql/generated/graphql";
import { yupResolver } from "@hookform/resolvers/yup";
import { forEach, get } from "lodash";
import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSnackbarV2 } from "@/hooks/useSnackbar";
import { router } from "expo-router";
import { normalize } from "@/utils/normalizeSize";
import colors from "@constants/colors";
import Yup from "@utils/yup";
import Iconify from "@/components/Iconify";
import useAuth from "@/hooks/useAuth";
import hexToRgba from "hex-to-rgba";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

interface ForgotPasswordFormValue {
  phoneNumber: string;
  afterSubmit?: string;
}

export default function ForgotPasswordScreen() {
  const { requireAcceptedPolicy } = useAuth();
  const { showSnackbar, DropdownType } = useSnackbarV2();

  const [forgotPasswordRequest, { loading }] = useForgotPasswordMutation();

  const ForgotPasswordScema = Yup.object().shape({
    phoneNumber: Yup.string()
      .matches(/^(0[689]{1})+([0-9]{8})+$/, "เบอร์ติดต่อไม่ถูกต้อง")
      .min(10, "ระบุหมายเลขโทรศัพท์ไม่เกิน 10 หลัก")
      .max(10, "ระบุหมายเลขโทรศัพท์ไม่เกิน 10 หลัก")
      .required("ระบุหมายเลขโทรศัพท์"),
  });

  const defaultValues: ForgotPasswordFormValue = useMemo(() => {
    return {
      phoneNumber: "",
      afterSubmit: "",
    };
  }, []);

  const methods = useForm<ForgotPasswordFormValue>({
    resolver: yupResolver(ForgotPasswordScema) as any,
    defaultValues,
    mode: "onBlur",
  });

  const {
    watch,
    handleSubmit,
    setError,
    setFocus,
    formState: { errors },
  } = methods;

  const values = watch();

  function handleErrorForgotPassword(error: ApolloError) {
    const graphQLErrors = get(error, "graphQLErrors", []);
    if (error.graphQLErrors) {
      graphQLErrors.forEach((graphQLError) => {
        const code = get(graphQLError, "extensions.code", "") || "";
        const errors = (get(graphQLError, "extensions.errors", []) ||
          []) as any[];
        switch (code) {
          case YUP_VALIDATION_ERROR_TYPE:
            const errorlength = get(errors, "length", 0);
            if (errorlength > 0) {
              showSnackbar({
                title: "พบข้อผิดพลาด",
                message: `ไม่สามารถบันทึกได้ พบ ${errorlength} ข้อผิดพลาด`,
                type: DropdownType.Warn,
              });
            }
            forEach(errors, ({ path, ...message }) => setError(path, message));
            setFocus(get(errors, "0.path", ""));
            break;
          default:
            console.log(graphQLError);
            setError("afterSubmit", {
              message: error.message || "เกิดข้อผิดพลาด กรุณาลองใหม่",
            });
            break;
        }
      });
    } else {
      console.log("error: ", error);
      setError("afterSubmit", {
        message: error.message || "เกิดข้อผิดพลาด กรุณาลองใหม่",
      });
    }
  }

  function handleForgotPasswordSuccess(data: ForgotPasswordMutation) {
    const param = JSON.stringify({
      phoneNumber: values.phoneNumber,
      countdown: data.forgotPassword?.countdown,
    });

    router.push({
      pathname: "/forgot-password/new-password",
      params: { param },
    });
  }

  async function onSubmit(values: ForgotPasswordFormValue) {
    forgotPasswordRequest({
      variables: { username: values.phoneNumber },
      onCompleted: handleForgotPasswordSuccess,
      onError: handleErrorForgotPassword,
    });
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.wrapper}>
        <NavigationBar />
        <KeyboardAwareScrollView style={styles.contentContainer}>
          <View style={styles.headerWrapper}>
            <Iconify
              icon="solar:question-square-bold-duotone"
              color={colors.primary.main}
              size={normalize(64)}
            />
            <Text varient="h3" style={{ paddingTop: normalize(8) }}>
              ลืมรหัสผ่าน
            </Text>
            <Text varient="body2" color="secondary">
              ถ้าหากคุณลืมรหัสผ่าน คุณสามารถส่งคำขอเปลี่ยนรหัสผ่านได้ที่นี่
            </Text>
          </View>
          <FormProvider methods={methods} containerStyle={styles.inputWrapper}>
            <RHFTextInput name="phoneNumber" label="เบอร์ติดต่อ*" />
            {errors.afterSubmit && errors.afterSubmit.message && (
              <View style={styles.errorContainer}>
                <Iconify
                  icon="ic:twotone-error"
                  width={24}
                  color={colors.error.dark}
                />
                <Text style={styles.errorText}>
                  {errors.afterSubmit.message}
                </Text>
              </View>
            )}
            <View style={styles.actionWrapper}>
              <Button
                fullWidth
                title="ส่งข้อมูล"
                size="large"
                onPress={handleSubmit(onSubmit)}
                loading={loading}
              />
            </View>
          </FormProvider>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.common.white,
  },
  wrapper: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: normalize(24),
  },
  headerWrapper: {
    // paddingHorizontal: normalize(16),
    paddingBottom: normalize(16),
    paddingTop: normalize(44),
  },
  inputWrapper: {
    // paddingHorizontal: normalize(16),
  },
  actionWrapper: {
    paddingVertical: normalize(32),
  },
  helperText: {
    marginTop: normalize(8),
    paddingLeft: normalize(12),
  },
  errorContainer: {
    backgroundColor: hexToRgba(colors.error.main, 0.1),
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flex: 1,
    gap: 8,
  },
  errorText: {
    color: colors.error.darker,
    flexWrap: "wrap",
  },
});
