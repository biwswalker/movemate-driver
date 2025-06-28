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
  useVerifyResetPasswordMutation,
  VerifyResetPasswordMutation,
} from "@graphql/generated/graphql";
import { yupResolver } from "@hookform/resolvers/yup";
import { forEach, get } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSnackbarV2 } from "@/hooks/useSnackbar";
import { router, useLocalSearchParams } from "expo-router";
import { normalize } from "@/utils/normalizeSize";
import { TextInput } from "react-native-paper";
import colors from "@constants/colors";
import Yup from "@utils/yup";
import Iconify from "@/components/Iconify";
import { encryption } from "@/utils/crypto";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import OTPInput from "@/components/OTPInput";

interface NewPasswordParrams {
  phoneNumber: string;
  countdown: string;
}

interface NewPasswordFormValue {
  code: string;
  password: string;
  confirmPassword: string;
  afterSubmit?: string;
}

export default function NewPasswordScreen() {
  const { showSnackbar, DropdownType } = useSnackbarV2();
  const searchParam = useLocalSearchParams<{ param: string }>();
  const params = JSON.parse(searchParam.param) as NewPasswordParrams;

  const phoneNumber = params?.phoneNumber;
  const firstCountdown = params?.countdown;

  const [countdown, setCountdown] = useState(0);
  const [isCounting, setIsCounting] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);
  const [openConfirmPassword, setOpenConfirmPassword] = useState(false);

  const [resendOTPRequest, { loading: resentLoading }] =
    useForgotPasswordMutation();
  const [verifyResetPassword, { loading: verifyLoading }] =
    useVerifyResetPasswordMutation();

  useEffect(() => {
    if (firstCountdown) {
      handleStartCountingdown(new Date(firstCountdown || ""));
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCounting && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setIsCounting(false);
    }
    return () => clearTimeout(timer);
  }, [countdown, isCounting]);

  function handleStartCountingdown(target: Date) {
    const endTime = target.getTime();
    const currentTime = Date.now();
    const countdownTime = Math.floor((endTime - currentTime) / 1000);
    if (countdownTime > 0) {
      setTimeout(() => {
        setCountdown(countdownTime);
        setIsCounting(true);
      }, 56);
    }
  }

  // eslint-disable-next-line react/no-unstable-nested-components
  const PassworHelperText = (error: boolean) => {
    return (
      <View style={styles.helperText}>
        <Text
          varient="caption"
          style={[error && { color: colors.error.main }]}
          color="secondary"
        >
          • รหัสผ่านความยาวจำนวน 8 ตัวขึ้นไป
        </Text>
        <Text
          varient="caption"
          style={[error && { color: colors.error.main }]}
          color="secondary"
        >
          • สามารถระบุตัวอักษรภาษาอังกฤษและตัวเลข
        </Text>
      </View>
    );
  };

  const ConfirmPassworHelperText = (error: boolean) => {
    return (
      <View style={styles.helperText}>
        <Text
          varient="caption"
          style={[error && { color: colors.error.main }]}
          color="secondary"
        >
          • รหัสผ่านต้องตรงกันกับต้นฉบับ
        </Text>
        <Text
          varient="caption"
          style={[error && { color: colors.error.main }]}
          color="secondary"
        >
          • รหัสผ่านความยาวจำนวน 8 ตัวขึ้นไป
        </Text>
        <Text
          varient="caption"
          style={[error && { color: colors.error.main }]}
          color="secondary"
        >
          • สามารถระบุตัวอักษรภาษาอังกฤษและตัวเลข
        </Text>
      </View>
    );
  };

  const NewPasswordScema = Yup.object().shape({
    code: Yup.string()
      .required("กรุณาระบุโค้ด 6 หลัก")
      .min(6, "กรุณาระบุโค้ด 6 หลัก"),
    password: Yup.string()
      .matches(
        /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
        "รหัสผ่านสามารถระบุตัวเลขและตัวอักษร ห้ามมีสัญลักษณ์"
      )
      .min(8, "รหัสผ่านจำเป็นต้องมี 8 ตัวขึ้นไป")
      .required("รหัสผ่านสามารถระบุตัวเลขและตัวอักษร ห้ามมีสัญลักษณ์"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "รหัสผ่านไม่ตรงกัน")
      .matches(
        /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
        "รหัสผ่านสามารถระบุตัวเลขและตัวอักษร ห้ามมีสัญลักษณ์"
      )
      .min(8, "รหัสผ่านจำเป็นต้องมี 8 ตัวขึ้นไป")
      .required("รหัสผ่านสามารถระบุตัวเลขและตัวอักษร ห้ามมีสัญลักษณ์"),
  });

  const defaultValues: NewPasswordFormValue = useMemo(() => {
    return {
      code: "",
      password: "",
      confirmPassword: "",
      afterSubmit: "",
    };
  }, []);

  const methods = useForm<NewPasswordFormValue>({
    resolver: yupResolver(NewPasswordScema) as any,
    defaultValues,
    mode: "onBlur",
  });

  const {
    handleSubmit,
    setError,
    clearErrors,
    setFocus,
    watch,
    setValue,
    formState: { errors },
  } = methods;

  const values = watch();

  function handleError(error: ApolloError) {
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
            showSnackbar({
              title: "พบข้อผิดพลาด",
              message: error.message || "เกิดข้อผิดพลาด กรุณาลองใหม่",
              type: DropdownType.Warn,
            });
        }
      });
    } else {
      console.log("error: ", error);
      showSnackbar({
        title: "พบข้อผิดพลาด",
        message: error.message || "เกิดข้อผิดพลาด กรุณาลองใหม่",
        type: DropdownType.Warn,
      });
    }
  }

  function handleNewPasswordSuccess(data: VerifyResetPasswordMutation) {
    console.log('/forgot-password/success ----->')
    router.push("/forgot-password/success");
  }

  function handleResentOTPSuccess(data: ForgotPasswordMutation) {
    handleStartCountingdown(
      new Date(get(data, "forgotPassword.countdown", ""))
    );
  }

  function onResentOTP() {
    resendOTPRequest({
      variables: { username: phoneNumber },
      onCompleted: handleResentOTPSuccess,
      onError: handleError,
    });
  }

  async function onSubmit(values: NewPasswordFormValue) {
    const encryptedPassword = encryption(values.password || "");
    verifyResetPassword({
      variables: {
        username: phoneNumber,
        password: encryptedPassword,
        code: values.code,
      },
      onCompleted: handleNewPasswordSuccess,
      onError: handleError,
    });
  }

  const eyeIcon = (state: boolean) =>
    state
      ? require("@/assets/images/eye-duotone.png")
      : require("@/assets/images/eyeclose-duotone.png");

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.wrapper}>
        <NavigationBar />
        <KeyboardAwareScrollView style={styles.contentContainer}>
          <View style={styles.headerWrapper}>
            <Iconify
              icon="solar:lock-password-unlocked-bold-duotone"
              color={colors.primary.main}
              size={normalize(44)}
            />
            <Text varient="h3" style={{ paddingTop: normalize(8) }}>
              เปลี่ยนรหัสผ่าน
            </Text>
            <Text varient="body2" color="secondary">
              เมื่อคุณได้รับ SMS จาก MovemateTH แล้วนำรหัส 6
              ตัวมายืนยันที่นี่ได้เลย
            </Text>
          </View>
          <FormProvider methods={methods} containerStyle={styles.inputWrapper}>
            {/* <RHFTextInput name="code" label="รหัส*" /> */}
            <View style={{ paddingBottom: normalize(16) }}>
              <Text
                varient="body2"
                color="secondary"
                style={{ paddingBottom: normalize(4) }}
              >
                โค้ด 6 หลัก
              </Text>
              <OTPInput
                style={{
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                }}
                code={values.code}
                onChangeText={(text, isReady) => {
                  setValue("code", text);
                  if (isReady) {
                    clearErrors("code");
                  }
                }}
                maxLength={6}
              />
              {errors.code && errors.code.message && (
                <Text
                  varient="caption"
                  style={{ color: colors.error.main, paddingTop: normalize(8) }}
                >
                  {errors.code.message}
                </Text>
              )}
            </View>

            <RHFTextInput
              name="password"
              label="รหัสผ่าน*"
              secureTextEntry={!openPassword}
              helperText={PassworHelperText}
              right={
                <TextInput.Icon
                  icon={eyeIcon(openPassword)}
                  forceTextInputFocus={false}
                  color={colors.text.secondary}
                  onPress={() => setOpenPassword(!openPassword)}
                />
              }
            />
            <RHFTextInput
              name="confirmPassword"
              label="ยืนยันรหัสผ่าน*"
              secureTextEntry={!openConfirmPassword}
              helperText={ConfirmPassworHelperText}
              right={
                <TextInput.Icon
                  icon={eyeIcon(openConfirmPassword)}
                  forceTextInputFocus={false}
                  color={colors.text.secondary}
                  onPress={() => setOpenConfirmPassword(!openConfirmPassword)}
                />
              }
            />
            <View style={styles.actionWrapper}>
              <Button
                fullWidth
                title="เปลี่ยนรหัสผ่าน"
                size="large"
                color="master"
                onPress={handleSubmit(onSubmit)}
                loading={verifyLoading}
              />
              <Button
                varient="text"
                fullWidth
                disabled={verifyLoading || isCounting}
                loading={resentLoading}
                title={
                  isCounting
                    ? `ส่งอีกครั้งใน ${countdown} วินาที`
                    : "ส่งอีกครั้ง"
                }
                size="large"
                onPress={onResentOTP}
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
  },
  headerWrapper: {
    paddingHorizontal: normalize(16),
    paddingBottom: normalize(16),
    paddingTop: normalize(8),
  },
  inputWrapper: {
    paddingHorizontal: normalize(16),
  },
  actionWrapper: {
    gap: normalize(12),
    paddingVertical: normalize(32),
  },
  helperText: {
    marginTop: normalize(8),
    paddingLeft: normalize(12),
  },
});
