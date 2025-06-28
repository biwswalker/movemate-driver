import React, { useMemo, useState } from "react";
import Text from "@components/Text";
import NavigationBar from "@components/NavigationBar";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { find, get, map, pick, reduce } from "lodash";
import FlexImage from "react-native-flex-image";
import UploadButton from "@components/UploadButton";
import Button from "@components/Button";
import {
  FileInput as FileInputGraph,
  EDriverType,
  useGetVehicleTypeAvailableQuery,
  VehicleType,
  useDriverReRegisterMutation,
  ReDriverDetailInput,
} from "@graphql/generated/graphql";
import { ApolloError } from "@apollo/client";
import Iconify from "@components/Iconify";
import hexToRgba from "hex-to-rgba";
import { BANKPROVIDER } from "@constants/values";
import colors from "@constants/colors";
import { router, useLocalSearchParams } from "expo-router";
import { IndividualRegisterParam } from "@/types/register";
import { fileUploadAPI } from "@/services/upload";

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

export default function RePreview() {
  const [error, setError] = useState("");

  const searchParam = useLocalSearchParams<{ param: string }>();
  const params = JSON.parse(searchParam.param) as IndividualRegisterParam;
  const detail = get(params, "detail", undefined);
  const documents = get(params, "documents", undefined);
  const isBusinessRegistration =
    params.type?.driverType === EDriverType.BUSINESS;

  const [reRegister, { loading }] = useDriverReRegisterMutation();

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

  function onReRegisterSuccess() {
    router.push("/re-register/success");
  }

  function onErrorReRegister(error: ApolloError) {
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

  async function onRequestOTP() {
    try {
      const frontOfVehicle =
        typeof documents?.frontOfVehicle === "object"
          ? ((await reformUpload(documents.frontOfVehicle)) as FileInputGraph)
          : undefined;
      const backOfVehicle =
        typeof documents?.backOfVehicle === "object"
          ? ((await reformUpload(documents.backOfVehicle)) as FileInputGraph)
          : undefined;
      const leftOfVehicle =
        typeof documents?.leftOfVehicle === "object"
          ? ((await reformUpload(documents.leftOfVehicle)) as FileInputGraph)
          : undefined;
      const rigthOfVehicle =
        typeof documents?.rigthOfVehicle === "object"
          ? ((await reformUpload(documents.rigthOfVehicle)) as FileInputGraph)
          : undefined;
      const copyVehicleRegistration =
        typeof documents?.copyVehicleRegistration === "object"
          ? ((await reformUpload(
              documents.copyVehicleRegistration
            )) as FileInputGraph)
          : undefined;
      const copyIDCard =
        typeof documents?.copyIDCard === "object"
          ? ((await reformUpload(documents.copyIDCard)) as FileInputGraph)
          : undefined;
      const copyDrivingLicense =
        typeof documents?.copyDrivingLicense === "object"
          ? ((await reformUpload(
              documents.copyDrivingLicense
            )) as FileInputGraph)
          : undefined;
      const copyBookBank =
        typeof documents?.copyBookBank === "object"
          ? await reformUpload(documents.copyBookBank)
          : undefined;
      const copyHouseRegistration =
        typeof documents?.copyHouseRegistration === "object"
          ? await reformUpload(documents.copyHouseRegistration)
          : undefined;
      const insurancePolicy =
        typeof documents?.insurancePolicy === "object"
          ? await reformUpload(documents.insurancePolicy)
          : undefined;
      const criminalRecordCheckCert =
        typeof documents?.criminalRecordCheckCert === "object"
          ? await reformUpload(documents.criminalRecordCheckCert)
          : undefined;
      const businessRegistrationCertificate =
        typeof documents?.businessRegistrationCertificate === "object"
          ? await reformUpload(documents.businessRegistrationCertificate)
          : undefined;
      const certificateValueAddedTaxRegistration =
        typeof documents?.certificateValueAddedTaxRegistration === "object"
          ? await reformUpload(documents.certificateValueAddedTaxRegistration)
          : undefined;

      const detailData: ReDriverDetailInput = {
        address: detail?.address || "",
        bank: detail?.bank,
        bankBranch: detail?.bankBranch,
        bankName: detail?.bankName,
        bankNumber: detail?.bankNumber,
        businessBranch: detail?.businessBranch,
        businessName: detail?.businessName,
        district: detail?.district || "",
        firstname: detail?.firstname,
        lastname: detail?.lastname,
        lineId: detail?.lineId,
        otherTitle: detail?.otherTitle,
        phoneNumber: detail?.phoneNumber || "",
        postcode: detail?.postcode || "",
        province: detail?.province || "",
        serviceVehicleTypes: detail?.serviceVehicleTypes || [],
        subDistrict: detail?.subDistrict || "",
        taxNumber: detail?.taxNumber || "",
        title: detail?.title || "",
      };

      reRegister({
        variables: {
          data: {
            detail: detailData,
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
              businessRegistrationCertificate,
              certificateValueAddedTaxRegistration,
            },
          },
        },
        onCompleted: onReRegisterSuccess,
        onError: onErrorReRegister,
      });
    } catch (error) {
      console.log(error);
    }
  }

  const displayBank = find(BANKPROVIDER, ["value", detail?.bank]);

  return (
    <SafeAreaView style={styles.container}>
      <NavigationBar />
      <ScrollView style={styles.wrapper}>
        <View style={styles.headerWrapper}>
          <Text varient="h3">ตรวจสอบข้อมูลและเอกสาร</Text>
          <Text varient="body2" color="disabled">
            กรุณาตรวจสอบข้อมูลของท่านและทำการแก้ไข
          </Text>
        </View>
        <View style={[styles.detailContainer, [{ gap: 16 }]]}>
          {isBusinessRegistration
            ? detail?.businessName && (
                <View style={styles.detailWrapper}>
                  <Text varient="body2" color="disabled">
                    ชื่อบริษัท
                  </Text>
                  <Text varient="body1">
                    {detail.businessName}
                    {detail.businessBranch ? ` (${detail.businessBranch})` : ""}
                  </Text>
                </View>
              )
            : detail?.firstname &&
              detail?.lastname && (
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
          {detail?.bank && (
            <View style={styles.detailWrapper}>
              <Text varient="body2" color="disabled">
                ข้อมูลธนาคร
              </Text>
              <Text varient="body1">
                ธนาคาร {displayBank && displayBank.label} สาขา{" "}
                {detail.bankBranch}
              </Text>
              {detail?.bankName && (
                <Text varient="body1">ชื่อบัญชี {detail.bankName}</Text>
              )}
              {detail?.bankNumber && (
                <Text varient="body1">เลขที่บัญชี {detail.bankNumber}</Text>
              )}
            </View>
          )}
          {detail?.serviceVehicleTypes && vehicleTypes && (
            <View style={styles.detailWrapper}>
              <Text varient="body2" color="disabled">
                ประเภทรถที่ให้บริการ
              </Text>
              <Text varient="body1">
                {reduce(
                  detail.serviceVehicleTypes,
                  (prev, curr) => {
                    const vehicle = find(vehicleTypes, ["_id", curr]);
                    if (vehicle) {
                      const vehicleName = vehicle.name;
                      return prev ? `${prev}, ${vehicleName}` : vehicleName;
                    }
                    return prev;
                  },
                  ""
                )}
              </Text>
            </View>
          )}
          <View style={[styles.detailWrapper, [{ gap: 8 }]]}>
            <Text varient="body2" color="disabled">
              เอกสารที่แนบมาด้วย
            </Text>
            <View style={styles.contentRow}>
              {documents?.frontOfVehicle && (
                <FlexImage
                  style={styles.flexImageStyle}
                  source={
                    typeof documents.frontOfVehicle === "string"
                      ? { uri: documents.frontOfVehicle }
                      : documents.frontOfVehicle
                  }
                />
              )}
              {documents?.backOfVehicle && (
                <FlexImage
                  style={styles.flexImageStyle}
                  source={
                    typeof documents.backOfVehicle === "string"
                      ? { uri: documents.backOfVehicle }
                      : documents.backOfVehicle
                  }
                />
              )}
            </View>
            <View style={styles.contentRow}>
              {documents?.leftOfVehicle && (
                <FlexImage
                  style={styles.flexImageStyle}
                  source={
                    typeof documents.leftOfVehicle === "string"
                      ? { uri: documents.leftOfVehicle }
                      : documents.leftOfVehicle
                  }
                />
              )}
              {documents?.rigthOfVehicle && (
                <FlexImage
                  style={styles.flexImageStyle}
                  source={
                    typeof documents.rigthOfVehicle === "string"
                      ? { uri: documents.rigthOfVehicle }
                      : documents.rigthOfVehicle
                  }
                />
              )}
            </View>
            {documents?.businessRegistrationCertificate && (
              <UploadButton
                label="หนังสือรับรองบริษัท"
                file={documents.businessRegistrationCertificate}
              />
            )}
            {documents?.certificateValueAddedTaxRegistration && (
              <UploadButton
                label="ภพ 20"
                file={documents.certificateValueAddedTaxRegistration}
              />
            )}
            {documents?.copyIDCard && (
              <UploadButton
                label="สำเนาบัตรประชาชน"
                file={documents.copyIDCard}
              />
            )}
            {documents?.copyVehicleRegistration && (
              <UploadButton
                label="สำเนาทะเบียนรถ"
                file={documents.copyVehicleRegistration}
              />
            )}
            {documents?.copyDrivingLicense && (
              <UploadButton
                label="สำเนาใบขับขี่"
                file={documents.copyDrivingLicense}
              />
            )}
            {documents?.copyBookBank && (
              <UploadButton
                label="สำเนาหน้าบัญชีธนาคาร"
                file={documents.copyBookBank}
              />
            )}
            {documents?.copyHouseRegistration && (
              <UploadButton
                label="สำเนาทะเบียนบ้าน"
                file={documents.copyHouseRegistration}
              />
            )}
            {documents?.insurancePolicy && (
              <UploadButton
                label="กรมธรรม์ประกันรถ"
                file={documents.insurancePolicy}
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
            title="ยืนยันการเปลี่ยนแปลงข้อมูล"
            loading={loading}
            onPress={onRequestOTP}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
