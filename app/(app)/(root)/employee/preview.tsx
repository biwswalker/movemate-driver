import React, { useMemo, useState } from "react";
import Text from "@components/Text";
import NavigationBar from "@components/NavigationBar";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { get, map, pick } from "lodash";
import UploadButton from "@components/UploadButton";
import Button from "@components/Button";
import {
  FileInput as FileInputGraph,
  EmployeeRegisterInput,
  EmployeeRegisterMutation,
  useEmployeeRegisterMutation,
  useGetVehicleTypeAvailableQuery,
  VehicleType,
} from "@graphql/generated/graphql";
import { ApolloError } from "@apollo/client";
import Iconify from "@components/Iconify";
import hexToRgba from "hex-to-rgba";
import colors from "@constants/colors";
import { router, useLocalSearchParams } from "expo-router";
import { EmployeeRegisterParam } from "./types";
import { useSnackbarV2 } from "@/hooks/useSnackbar";
import { fileUploadAPI } from "@/services/upload";

export default function RegisterIndividualPreviewScreen() {
  const { showSnackbar, DropdownType } = useSnackbarV2();
  const [error, setError] = useState("");

  const searchParam = useLocalSearchParams<{ param: string }>();
  const params = JSON.parse(searchParam.param || "{}") as EmployeeRegisterParam;
  const detail = get(params, "detail", undefined);
  const documents = get(params, "documents", undefined);

  const [employeeRegister, { loading }] = useEmployeeRegisterMutation();
  const { data: vehicleData } = useGetVehicleTypeAvailableQuery();
  const vehicleTypes = useMemo<VehicleType[]>(() => {
    if (vehicleData?.getVehicleTypeAvailable) {
      return map(vehicleData.getVehicleTypeAvailable, (vehi) => ({
        ...vehi,
        name: `${vehi.name}${vehi.isConfigured ? "" : " (ยังไม่เปิดให้บริการ)"}`,
      })) as VehicleType[];
    }
    return [];
  }, [vehicleData]);

  function onEmployeeRegisterSuccess(data: EmployeeRegisterMutation) {
    const param = JSON.stringify(data.employeeRegister);
    router.push({ pathname: "/employee/success", params: { param } });
  }

  function onEmployeeRegisterError(error: ApolloError) {
    setError(error.message);
  }

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

  async function handleSubmitEmployee() {
    try {
      if (detail && documents) {
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

        const data: EmployeeRegisterInput = {
          detail,
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
        };
        employeeRegister({
          variables: { data },
          onCompleted: onEmployeeRegisterSuccess,
          onError: onEmployeeRegisterError,
        });
      } else {
        return showSnackbar({
          title: "ข้อมูลไม่ครบถ้วน",
          message: "ไม่พบข้อมูล กรุณาใหม่อีกครั้ง",
          type: DropdownType.Warn,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <NavigationBar title="ตรวจสอบข้อมูลและเอกสาร" />
      <ScrollView style={styles.wrapper}>
        {/* <View style={styles.headerWrapper}>
          <Text varient="h3">ตรวจสอบข้อมูลและเอกสาร</Text>
          <Text varient="body2" color="disabled">
            กรุณาตรวจสอบข้อมูลของท่านและทำการแก้ไข
          </Text>
        </View> */}
        <View style={[styles.detailContainer, [{ gap: 16 }]]}>
          {detail?.firstname && detail?.lastname && (
            <View style={styles.detailWrapper}>
              <Text varient="body2" color="disabled">
                ชื่อ - นามสกุล
              </Text>
              <Text varient="body1">
                {detail.firstname} {detail.lastname}
              </Text>
            </View>
          )}
          {detail?.taxNumber && (
            <View style={styles.detailWrapper}>
              <Text varient="body2" color="disabled">
                เลขประจำตัวผู้เสียภาษี
              </Text>
              <Text varient="body1">{detail?.taxNumber}</Text>
            </View>
          )}
          {detail?.phoneNumber && (
            <View style={styles.detailWrapper}>
              <Text varient="body2" color="disabled">
                เบอร์ติดต่อ
              </Text>
              <Text varient="body1">{detail?.phoneNumber}</Text>
            </View>
          )}
          {detail?.lineId && (
            <View style={styles.detailWrapper}>
              <Text varient="body2" color="disabled">
                ไลน์ไอดี
              </Text>
              <Text varient="body1">{detail.lineId}</Text>
            </View>
          )}
          {detail?.address && (
            <View style={styles.detailWrapper}>
              <Text varient="body2" color="disabled">
                ที่อยู่
              </Text>
              <Text varient="body1">{detail.address}</Text>
              <Text varient="body1">
                ตำบล/เขต {detail.subDistrict} อำเภอ/แขวง {detail.district}{" "}
                จังหวัด {detail.province} {detail.postcode}
              </Text>
            </View>
          )}
          <View style={[styles.detailWrapper, [{ gap: 8 }]]}>
            <Text varient="body2" color="disabled">
              เอกสารที่แนบมาด้วย
            </Text>
            {documents?.copyIDCard && (
              <UploadButton
                label="สำเนาบัตรประชาชน"
                file={documents.copyIDCard}
              />
            )}
            {documents?.copyDrivingLicense && (
              <UploadButton
                label="สำเนาใบขับขี่"
                file={documents.copyDrivingLicense}
              />
            )}
            {documents?.copyVehicleRegistration && (
              <UploadButton
                label="สำเนาทะเบียนรถ"
                file={documents.copyVehicleRegistration}
              />
            )}
            {documents?.copyHouseRegistration && (
              <UploadButton
                label="สำเนาทะเบียนบ้าน"
                file={documents.copyHouseRegistration}
              />
            )}
            {documents?.criminalRecordCheckCert && (
              <UploadButton
                label="หนังสือรับรองตรวจประวัติอาชญากรรม"
                file={documents.criminalRecordCheckCert}
              />
            )}
          </View>
        </View>
        <View style={styles.actionWrapper}>
          {error && (
            <View style={styles.errorContainer}>
              <Iconify icon="ic:twotone-error" color={colors.error.dark} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
          <Button
            size="large"
            fullWidth
            title="ยืนยันการเพิ่่มคนขับ"
            loading={loading}
            onPress={handleSubmitEmployee}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
  },
  headerWrapper: {
    paddingHorizontal: 32,
  },
  detailContainer: {
    gap: 16,
    paddingTop: 48,
    paddingHorizontal: 32,
  },
  detailWrapper: {
    gap: 2,
  },
  contentRow: {
    flexDirection: "row",
    gap: 8,
  },
  flexImageStyle: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 4,
    overflow: "hidden",
    resizeMode: "cover",
  },
  actionWrapper: {
    padding: 32,
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
