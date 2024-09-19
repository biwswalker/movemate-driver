import React from "react";
import Text from "@components/Text";
import RHFUploadButton from "@components/HookForm/RHFUploadButton";
import FormProvider from "@components/HookForm/FormProvider";
import NavigationBar from "@components/NavigationBar";
import Button from "@components/Button";
import Yup from "@utils/yup";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { isEmpty } from "lodash";
import { fData } from "@utils/number";
import { IndividualDriverFormValue } from "./individual";
import { router, useLocalSearchParams } from "expo-router";

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
  rowWrapper: {
    flexDirection: "row",
    gap: 8,
  },
  sectionContainer: {
    paddingBottom: 32,
    paddingHorizontal: 32,
  },
  documentList: {
    gap: 12,
  },
  sectionTitleWrapper: {
    paddingTop: 48,
  },
  submitStyle: {
    paddingTop: 32,
  },
});

export class RegisterUploadsFormValue implements RegisterUploadsFormValueType {
  constructor(data: RegisterUploadsFormValueType) {
    this.frontOfVehicle = data.frontOfVehicle;
    this.backOfVehicle = data.backOfVehicle;
    this.leftOfVehicle = data.leftOfVehicle;
    this.rigthOfVehicle = data.rigthOfVehicle;
    this.copyVehicleRegistration = data.copyVehicleRegistration;
    this.copyIDCard = data.copyIDCard;
    this.copyDrivingLicense = data.copyDrivingLicense;
    this.copyBookBank = data.copyBookBank;
    this.copyHouseRegistration = data.copyHouseRegistration;
    this.insurancePolicy = data.insurancePolicy;
    this.criminalRecordCheckCert = data.criminalRecordCheckCert;
  }

  frontOfVehicle: FileInput;
  backOfVehicle: FileInput;
  leftOfVehicle: FileInput;
  rigthOfVehicle: FileInput;
  copyVehicleRegistration: FileInput;
  copyIDCard: FileInput;
  copyDrivingLicense: FileInput;
  copyBookBank: FileInput;
  copyHouseRegistration: FileInput;
  insurancePolicy: FileInput;
  criminalRecordCheckCert: FileInput;
}

export const MAX_FILE_SIZE = 2 * 1000 * 1000;
const MAXIMUM_FILE_SIZE_TEXT = `ขนาดไฟล์ไม่เกิน ${fData(MAX_FILE_SIZE)}`;

export default function RegisterUploadsScreen() {
  const searchParam = useLocalSearchParams<{ param: string }>();
  const params = JSON.parse(searchParam.param) as IndividualDriverFormValue;

  const RegisterUploadSchema = Yup.object().shape({
    frontOfVehicle: Yup.mixed()
      .test("require-file", "อัพโหลดรูปด้านหน้ารถ", (value) => !isEmpty(value))
      .maxFileSize(MAXIMUM_FILE_SIZE_TEXT)
      .required("อัพโหลดรูปด้านหน้ารถ"),
    backOfVehicle: Yup.mixed()
      .test("require-file", "อัพโหลดรูปด้านหลังรถ", (value) => !isEmpty(value))
      .maxFileSize(MAXIMUM_FILE_SIZE_TEXT)
      .required("อัพโหลดรูปด้านหลังรถ"),
    leftOfVehicle: Yup.mixed()
      .test(
        "require-file",
        "อัพโหลดรูปด้านข้างซ้ายรถ",
        (value) => !isEmpty(value)
      )
      .maxFileSize(MAXIMUM_FILE_SIZE_TEXT)
      .required("อัพโหลดรูปด้านข้างซ้ายรถ"),
    rigthOfVehicle: Yup.mixed()
      .test(
        "require-file",
        "อัพโหลดรูปด้านข้างขวารถ",
        (value) => !isEmpty(value)
      )
      .maxFileSize(MAXIMUM_FILE_SIZE_TEXT)
      .required("อัพโหลดรูปด้านข้างขวารถ"),
    copyVehicleRegistration: Yup.mixed()
      .test(
        "require-file",
        "อัพโหลดเอกสารสำเนาทะเบียนรถ",
        (value) => !isEmpty(value)
      )
      .maxFileSize(MAXIMUM_FILE_SIZE_TEXT)
      .required("อัพโหลดเอกสารสำเนาทะเบียนรถ"),
    copyIDCard: Yup.mixed()
      .test(
        "require-file",
        "อัพโหลดสำเนาบัตรประชาชน",
        (value) => !isEmpty(value)
      )
      .maxFileSize(MAXIMUM_FILE_SIZE_TEXT)
      .required("อัพโหลดสำเนาบัตรประชาชน"),
    copyDrivingLicense: Yup.mixed()
      .test("require-file", "อัพโหลดสำเนาใบขับขี่", (value) => !isEmpty(value))
      .maxFileSize(MAXIMUM_FILE_SIZE_TEXT)
      .required("อัพโหลดสำเนาใบขับขี่"),
    copyBookBank: Yup.mixed().maxFileSize(MAXIMUM_FILE_SIZE_TEXT),
    copyHouseRegistration: Yup.mixed().maxFileSize(MAXIMUM_FILE_SIZE_TEXT),
    insurancePolicy: Yup.mixed().maxFileSize(MAXIMUM_FILE_SIZE_TEXT),
    criminalRecordCheckCert: Yup.mixed().maxFileSize(MAXIMUM_FILE_SIZE_TEXT),
  });

  const defaultValues = {
    frontOfVehicle: undefined,
    backOfVehicle: undefined,
    leftOfVehicle: undefined,
    rigthOfVehicle: undefined,
    copyVehicleRegistration: undefined,
    copyIDCard: undefined,
    copyDrivingLicense: undefined,
    copyBookBank: undefined,
    copyHouseRegistration: undefined,
    insurancePolicy: undefined,
    criminalRecordCheckCert: undefined,
  };

  const methods = useForm<RegisterUploadsFormValue>({
    resolver: yupResolver(RegisterUploadSchema) as any,
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  async function onSubmit(values: RegisterUploadsFormValue) {
    try {
      if (params && values) {
        const documents = new RegisterUploadsFormValue(values);
        const param = JSON.stringify({ detail: params, documents });
        console.log('---param---', param)
        router.push({ pathname: "/register/preview", params: { param } });
      }
    } catch (error) {
      console.log('errors: ', error);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <NavigationBar />
      <ScrollView style={styles.wrapper}>
        <View style={styles.headerWrapper}>
          <Text varient="h3">เอกสารประกอบการสมัคร</Text>
          <Text varient="body2" color="disabled">
            โปรดแนบเอกสารประกอบการสมัครให้ครบถ้วน
          </Text>
        </View>
        <FormProvider
          methods={methods}
          containerStyle={styles.sectionContainer}
        >
          <View style={styles.documentList}>
            <View style={styles.sectionTitleWrapper}>
              <Text>รูปถ่ายรถยนต์ (บังคับ)</Text>
            </View>
            <View style={styles.rowWrapper}>
              <RHFUploadButton
                name="frontOfVehicle"
                label="ด้านหน้ารถ"
                isImagePreview
              />
              <RHFUploadButton
                name="backOfVehicle"
                label="ด้านหลังรถ"
                isImagePreview
              />
            </View>
            <View style={styles.rowWrapper}>
              <RHFUploadButton
                name="leftOfVehicle"
                label="ด้านข้าง ซ้ายรถ"
                isImagePreview
              />
              <RHFUploadButton
                name="rigthOfVehicle"
                label="ด้านข้าง ขวารถ"
                isImagePreview
              />
            </View>
            <RHFUploadButton
              name="copyVehicleRegistration"
              label="สำเนาทะเบียนรถ (บังคับ)"
            />
            <RHFUploadButton
              name="copyIDCard"
              label="สำเนาบัตรประชาชน (บังคับ)"
            />
            <RHFUploadButton
              name="copyDrivingLicense"
              label="สำเนาใบขับขี่ (บังคับ)"
            />
            <RHFUploadButton name="copyBookBank" label="สำเนาหน้าบัญชีธนาคาร" />
            <RHFUploadButton
              name="copyHouseRegistration"
              label="สำเนาทะเบียนบ้าน"
            />
            <RHFUploadButton name="insurancePolicy" label="กรมธรรม์ประกันรถ" />
            <RHFUploadButton
              name="criminalRecordCheckCert"
              label="หนังสือรับรองตรวจประวัติอาชญากรรม"
            />
            <View style={styles.submitStyle}>
              <Button
                fullWidth
                size="large"
                title="ยืนยันการสมัคร"
                onPress={handleSubmit(onSubmit)}
              />
            </View>
          </View>
        </FormProvider>
      </ScrollView>
    </SafeAreaView>
  );
}
