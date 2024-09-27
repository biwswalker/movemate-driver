import React, { useEffect, useState } from "react";
import Text from "@components/Text";
import NavigationBar from "@components/NavigationBar";
import Button from "@components/Button";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { normalize } from "@utils/normalizeSize";
import OTPInput from "@components/OTPInput";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { get, pick } from "lodash";
import {
  FileInput as FileInputGraph,
  IndividualDriverDetailInput,
  IndividualDriverRegisterMutation,
  OtpRequestMutation,
  OtpRequst,
  useIndividualDriverRegisterMutation,
  useOtpRequestMutation,
} from "@graphql/generated/graphql";
import { ApolloError } from "@apollo/client";
import { fileUpload, fileUploadAPI } from "@services/upload";
import { YUP_VALIDATION_ERROR_TYPE } from "@constants/error";
import { encryption } from "@utils/crypto";
import colors from "@/constants/colors";
import useSnackbar from "@/hooks/useSnackbar";
import { IndividualDriverFormValue } from "./individual";
import { RegisterUploadsFormValue } from "./documents";
import { router, useLocalSearchParams } from "expo-router";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.common.white,
  },
  wrapper: {
    flex: 1,
  },
  headerWrapper: {
    paddingHorizontal: normalize(16),
  },
  rowWrapper: {
    flexDirection: "row",
    gap: normalize(8),
  },
  sectionContainer: {
    padding: normalize(32),
    paddingTop: normalize(48),
    alignItems: "center",
  },
  documentList: {
    gap: 12,
  },
  secureImage: {
    width: normalize(224),
    alignSelf: "center",
    resizeMode: "contain",
  },
  textCenter: {
    textAlign: "center",
  },
  actionContainer: {
    width: `100%`,
    gap: normalize(8),
    marginTop: normalize(48),
  },
  titleWrapper: {
    marginTop: normalize(16),
  },
  backEditTextsWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  editTextButton: {
    color: colors.info.main,
    textAlign: "justify",
  },
});

interface VerifyOTPParam {
  detail: IndividualDriverFormValue;
  documents: RegisterUploadsFormValue;
  otp: OtpRequst;
}

export default function RegisterOTPVerifyScreen() {
  const [code, setCode] = useState("");
  const [pinReady, setPinReady] = useState(false);

  const searchParam = useLocalSearchParams<{ param: string }>();
  const params = JSON.parse(searchParam.param) as VerifyOTPParam;

  const [otp, setOTP] = useState(params.otp);
  const [countdown, setCountdown] = useState(0);
  const [isCounting, setIsCounting] = useState(false);

  const { showSnackbar } = useSnackbar();

  const detail = get(
    params,
    "detail",
    undefined
  ) as IndividualDriverDetailInput;
  const documents = get(params, "documents", undefined);

  const [otpRequest, { loading: resetOTPLoading }] = useOtpRequestMutation();
  const [individualRegister, { loading: individualRegisterLoading }] =
    useIndividualDriverRegisterMutation();

  async function reformUpload(
    file: FileInput
  ): Promise<FileInputGraph | undefined> {
    try {
      if (file) {
        console.log("uri: ", file);
        const response = await fileUploadAPI({
          name: file.name,
          type: file.trueType || "",
          uri: file.uri,
        });
        const responseFile = get(response, "data", undefined);
        return pick(responseFile, [
          "fileId",
          "filename",
          "mimetype",
        ]) as FileInputGraph;
      }
      return undefined;
    } catch (error: any) {
      console.error("Network error occurred during file upload:", error);
      if (error.response) {
        // Server returned a response with error details
        console.error("Response data:", error.response.data);
      } else if (error.request) {
        // No response received (network error)
        console.error(
          "Request was made but no response received:",
          JSON.stringify(error.request)
        );
      } else {
        // Some error occurred during request setup
        console.error("Error setting up the request:", error.message);
      }
      return undefined;
    }
  }

  function handleErrorRegister(error: ApolloError) {
    const graphQLErrors = get(error, "graphQLErrors", []);
    if (error.graphQLErrors) {
      graphQLErrors.forEach((graphQLError) => {
        const code = get(graphQLError, "extensions.code", "") || "";
        const errors = get(graphQLError, "extensions.errors", []) || [];
        const message = get(errors, "0.message", "");
        switch (code) {
          case YUP_VALIDATION_ERROR_TYPE:
            showSnackbar({ message: message, varient: "warning" });
            break;
          default:
            // const message = get(errors, "0.message", "");
            showSnackbar({
              message: message || "เกิดข้อผิดพลาด กรุณาลองใหม่",
              varient: "warning",
            });
            break;
        }
      });
    } else {
      console.log("error: ", error);
      showSnackbar({
        message: error.message || "เกิดข้อผิดพลาด กรุณาลองใหม่",
        varient: "warning",
      });
    }
  }

  function registerSuccess(data: IndividualDriverRegisterMutation) {
    const param = JSON.stringify(data.individualDriverRegister);
    router.push({ pathname: "/register/success", params: { param } });
  }

  async function handleConfirmPhoneNumber() {
    if (documents) {
      console.log('documents', JSON.stringify(documents))
      const encryptedPassword = encryption(detail.password || "");

      const frontOfVehicle = (await reformUpload(
        documents.frontOfVehicle
      )) as FileInputGraph;
      const backOfVehicle = (await reformUpload(
        documents.backOfVehicle
      )) as FileInputGraph;
      const leftOfVehicle = (await reformUpload(
        documents.leftOfVehicle
      )) as FileInputGraph;
      const rigthOfVehicle = (await reformUpload(
        documents.rigthOfVehicle
      )) as FileInputGraph;
      const copyVehicleRegistration = (await reformUpload(
        documents.copyVehicleRegistration
      )) as FileInputGraph;
      const copyIDCard = (await reformUpload(
        documents.copyIDCard
      )) as FileInputGraph;
      const copyDrivingLicense = (await reformUpload(
        documents.copyDrivingLicense
      )) as FileInputGraph;
      const copyBookBank = await reformUpload(documents.copyBookBank);
      const copyHouseRegistration = await reformUpload(
        documents.copyHouseRegistration
      );
      const insurancePolicy = await reformUpload(documents.insurancePolicy);
      const criminalRecordCheckCert = await reformUpload(
        documents.criminalRecordCheckCert
      );

      individualRegister({
        variables: {
          data: {
            detail: { ...detail, password: encryptedPassword },
            documents: {
              frontOfVehicle,
              backOfVehicle,
              leftOfVehicle,
              rigthOfVehicle,
              copyVehicleRegistration,
              copyIDCard,
              copyDrivingLicense,
              copyBookBank,
              copyHouseRegistration,
              insurancePolicy,
              criminalRecordCheckCert,
            },
            otp: {
              otp: code,
              phoneNumber: otp.phoneNumber,
              ref: otp.ref,
            },
          },
        },
        onCompleted: registerSuccess,
        onError: handleErrorRegister,
      });
    }
  }

  function onSuccessRequestOTP(data: OtpRequestMutation) {
    setOTP(data.otpRequest);
    handleStartCountingdown(new Date(get(data, "otpRequest.countdown", "")));
  }

  function onErrorRequestOTP(error: ApolloError) {
    showSnackbar({ message: error.message, varient: "warning" });
  }

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCounting && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setIsCounting(false);
    }
    return () => clearTimeout(timer);
  }, [countdown, isCounting]);

  async function onRequestOTP() {
    try {
      otpRequest({
        variables: {
          action: "ยืนยันหมายเลขโทรศัพท์เพื่อสมัครสมาชิกคนขับรถส่วนบุคคล", // TODO: individual / agent
          phoneNumber: detail?.phoneNumber || "",
        },
        onCompleted: onSuccessRequestOTP,
        onError: onErrorRequestOTP,
      });
    } catch (error) {
      console.log(error);
    }
  }

  function handleStartCountingdown(target: Date) {
    const endTime = target.getTime();
    const currentTime = Date.now();
    const countdownTime = Math.floor((endTime - currentTime) / 1000);

    if (countdownTime > 0) {
      setCountdown(countdownTime);
      setIsCounting(true);
    }
  }

  function handleResentCode() {
    onRequestOTP();
  }

  function handleOnEdit() {}

  return (
    <KeyboardAwareScrollView style={styles.container}>
      <SafeAreaView>
        <NavigationBar />
        <View style={styles.wrapper}>
          <View style={styles.headerWrapper}>
            <Text varient="h3">ยืนยันเบอร์โทรศัพท์</Text>
            <Text varient="body2" color="disabled">
              การยืนยันเบอร์โทรศัพท์ผ่าน OTP
            </Text>
          </View>
          <View style={styles.sectionContainer}>
            <Image
              style={styles.secureImage}
              source={require("@assets/images/secure.png")}
            />
            <Text
              varient="subtitle1"
              style={[styles.textCenter, styles.titleWrapper]}
            >
              กรอกรหัส OTP
            </Text>
            <Text varient="body2" color="disabled" style={[styles.textCenter]}>
              กรุณากรอกรหัส 6 หลักถูกส่งไปยังเบอร์ติดต่อท่าน
              <Text
                varient="body2"
                color="secondary"
                style={[styles.textCenter]}
              >
                {"\n"}
                {otp?.phoneNumber}{" "}
              </Text>
              รหัสอ้างอิง (Ref) คือ:
              <Text
                varient="body2"
                color="secondary"
                style={[styles.textCenter]}
              >
                {" "}
                {otp?.ref}
              </Text>
            </Text>
            <View style={[styles.titleWrapper]}>
              <OTPInput
                code={code}
                setPinReady={setPinReady}
                onChangeText={setCode}
                maxLength={6}
              />
            </View>
            <View style={styles.actionContainer}>
              <View style={[styles.rowWrapper, styles.backEditTextsWrapper]}>
                <Text varient="body2" color="disabled">
                  หากเบอร์ติดต่อไม่สามารถใช้ได้
                </Text>
                <TouchableOpacity onPress={handleOnEdit}>
                  <Text varient="body2" style={styles.editTextButton}>
                    แก้ไขข้อมูล
                  </Text>
                </TouchableOpacity>
              </View>
              <Button
                fullWidth
                title="ยืนยันเบอร์ติดต่อ"
                size="large"
                color="master"
                disabled={!pinReady}
                loading={individualRegisterLoading}
                onPress={handleConfirmPhoneNumber}
              />
              <Button
                varient="text"
                fullWidth
                disabled={individualRegisterLoading || isCounting}
                loading={resetOTPLoading}
                title={
                  isCounting
                    ? `ส่งอีกครั้งใน ${countdown} วินาที`
                    : "ส่งอีกครั้ง"
                }
                size="large"
                onPress={handleResentCode}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
}
