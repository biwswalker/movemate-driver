import React, { useState } from "react";
import Text from "@components/Text";
import NavigationBar from "@components/NavigationBar";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { find, get } from "lodash";
import FlexImage from "react-native-flex-image";
import UploadButton from "@components/UploadButton";
import Button from "@components/Button";
import {
  OtpRequestMutation,
  useGetVehicleTypeByIdQuery,
  useOtpRequestMutation,
} from "@graphql/generated/graphql";
import { ApolloError } from "@apollo/client";
import Iconify from "@components/Iconify";
import hexToRgba from "hex-to-rgba";
import { BANKPROVIDER } from "@constants/values";
import colors from "@constants/colors";
import { router, useLocalSearchParams } from "expo-router";
import { IndividualRegisterParam } from "./types";

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

export default function RegisterIndividualPreviewScreen() {
  const [error, setError] = useState("");

  const searchParam = useLocalSearchParams<{ param: string }>();
  const params = JSON.parse(searchParam.param) as IndividualRegisterParam;
  const detail = get(params, "detail", undefined);
  const documents = get(params, "documents", undefined);

  const [otpRequest, { loading }] = useOtpRequestMutation();
  const { data: vehicleType } = useGetVehicleTypeByIdQuery({
    variables: { id: detail?.serviceVehicleType || "" },
  });

  function onSuccessRequestOTP(data: OtpRequestMutation) {
    const param = JSON.stringify(
      Object.assign(params, {
        otp: data.otpRequest,
      })
    );
    router.push({ pathname: "/register/verify-otp", params: { param } });
  }

  function onErrorRequestOTP(error: ApolloError) {
    setError(error.message);
  }

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
          {detail?.serviceVehicleType && vehicleType && (
            <View style={styles.detailWrapper}>
              <Text varient="body2" color="disabled">
                ประเภทรถที่ให้บริการ
              </Text>
              <Text varient="body1">
                {get(vehicleType, "getVehicleTypeById.name", "")}
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
            {documents?.copyVehicleRegistration && (
              <UploadButton
                label="สำเนาทะเบียนรถ"
                file={documents.copyVehicleRegistration}
              />
            )}
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
            title="ยืนยันการสมัคร"
            loading={loading}
            onPress={onRequestOTP}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
