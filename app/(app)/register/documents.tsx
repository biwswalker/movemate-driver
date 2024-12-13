import React, { Fragment, useMemo } from "react";
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
import { router, useLocalSearchParams } from "expo-router";
import { normalize } from "@/utils/normalizeSize";
import { IndividualRegisterParam, RegisterUploadsFormValue } from "./types";
import { EDriverType } from "@/graphql/generated/graphql";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
  },
  headerWrapper: {
    paddingHorizontal: normalize(16),
  },
  rowWrapper: {
    flexDirection: "row",
    gap: 8,
  },
  sectionContainer: {
    paddingBottom: normalize(32),
    paddingHorizontal: normalize(16),
  },
  documentList: {
    gap: normalize(12),
    paddingTop: normalize(24),
  },
  submitStyle: {
    paddingTop: normalize(32),
  },
});

export const MAX_FILE_SIZE = 10 * 1000 * 1000;
const MAXIMUM_FILE_SIZE_TEXT = `ขนาดไฟล์ไม่เกิน ${fData(MAX_FILE_SIZE)}`;

export default function RegisterUploadsScreen() {
  const searchParam = useLocalSearchParams<{ param: string }>();
  const params = JSON.parse(searchParam.param) as IndividualRegisterParam;

  const isBusinessRegistration =
    params.type?.driverType === EDriverType.BUSINESS;

  // TODO: Add with handle business customer registration
  const RegisterUploadSchema = Yup.object().shape({
    frontOfVehicle: Yup.mixed()
      .maxFileSize(MAXIMUM_FILE_SIZE_TEXT)
      .test("require-file", "อัพโหลดรูปด้านหน้ารถ", (value) =>
        isBusinessRegistration ? true : !isEmpty(value)
      ),
    backOfVehicle: Yup.mixed()
      .maxFileSize(MAXIMUM_FILE_SIZE_TEXT)
      .test("require-file", "อัพโหลดรูปด้านหลังรถ", (value) =>
        isBusinessRegistration ? true : !isEmpty(value)
      ),
    leftOfVehicle: Yup.mixed()
      .maxFileSize(MAXIMUM_FILE_SIZE_TEXT)
      .test("require-file", "อัพโหลดรูปด้านข้างซ้ายรถ", (value) =>
        isBusinessRegistration ? true : !isEmpty(value)
      ),
    rigthOfVehicle: Yup.mixed()
      .maxFileSize(MAXIMUM_FILE_SIZE_TEXT)
      .test("require-file", "อัพโหลดรูปด้านข้างขวารถ", (value) =>
        isBusinessRegistration ? true : !isEmpty(value)
      ),
    copyVehicleRegistration: Yup.mixed()
      .maxFileSize(MAXIMUM_FILE_SIZE_TEXT)
      .test("require-file", "อัพโหลดเอกสารสำเนาทะเบียนรถ", (value) =>
        isBusinessRegistration ? true : !isEmpty(value)
      ),
    copyIDCard: Yup.mixed()
      .maxFileSize(MAXIMUM_FILE_SIZE_TEXT)
      .test(
        "require-file",
        "อัพโหลดสำเนาบัตรประชาชน",
        (value) => !isEmpty(value)
      ),
    copyDrivingLicense: Yup.mixed()
      .maxFileSize(MAXIMUM_FILE_SIZE_TEXT)
      .test("require-file", "อัพโหลดสำเนาใบขับขี่", (value) =>
        isBusinessRegistration ? true : !isEmpty(value)
      ),
    copyBookBank: Yup.mixed()
      .maxFileSize(MAXIMUM_FILE_SIZE_TEXT)
      .test(
        "require-file",
        "อัพโหลดสำเนาหน้าบัญชีธนาคาร",
        (value) => !isEmpty(value)
      ),
    copyHouseRegistration: Yup.mixed().maxFileSize(MAXIMUM_FILE_SIZE_TEXT),
    insurancePolicy: Yup.mixed().maxFileSize(MAXIMUM_FILE_SIZE_TEXT),
    criminalRecordCheckCert: Yup.mixed().maxFileSize(MAXIMUM_FILE_SIZE_TEXT),

    businessRegistrationCertificate: Yup.mixed()
      .maxFileSize(MAXIMUM_FILE_SIZE_TEXT)
      .test("require-file", "อัพโหลดหนังสือรับรองบริษัท", (value) =>
        isBusinessRegistration ? !isEmpty(value) : true
      ),
    certificateValueAddedTaxRegistration: Yup.mixed().maxFileSize(
      MAXIMUM_FILE_SIZE_TEXT
    ),
  });

  const defaultValues = useMemo(() => {
    const documents = params?.documents;
    return {
      frontOfVehicle: documents?.frontOfVehicle || undefined,
      backOfVehicle: documents?.backOfVehicle || undefined,
      leftOfVehicle: documents?.leftOfVehicle || undefined,
      rigthOfVehicle: documents?.rigthOfVehicle || undefined,
      copyVehicleRegistration: documents?.copyVehicleRegistration || undefined,
      copyIDCard: documents?.copyIDCard || undefined,
      copyDrivingLicense: documents?.copyDrivingLicense || undefined,
      copyBookBank: documents?.copyBookBank || undefined,
      copyHouseRegistration: documents?.copyHouseRegistration || undefined,
      insurancePolicy: documents?.insurancePolicy || undefined,
      criminalRecordCheckCert: documents?.criminalRecordCheckCert || undefined,
      businessRegistrationCertificate:
        documents?.businessRegistrationCertificate || undefined,
      certificateValueAddedTaxRegistration:
        documents?.certificateValueAddedTaxRegistration || undefined,
    };
  }, [params.documents]);

  const methods = useForm<RegisterUploadsFormValue>({
    resolver: yupResolver(RegisterUploadSchema) as any,
    defaultValues,
  });

  const { handleSubmit, watch } = methods;

  async function onSubmit(values: RegisterUploadsFormValue) {
    try {
      if (params && values) {
        const documents = new RegisterUploadsFormValue(values);
        const param = JSON.stringify(Object.assign(params, { documents }));
        router.push({ pathname: "/register/preview", params: { param } });
      }
    } catch (error) {
      console.log("errors: ", error);
    }
  }

  const values = watch();

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
            {isBusinessRegistration && (
              <Fragment>
                <RHFUploadButton
                  file={values.businessRegistrationCertificate}
                  name="businessRegistrationCertificate"
                  label="หนังสือรับรองบริษัท (บังคับ)"
                />
                <RHFUploadButton
                  file={values.copyIDCard}
                  name="copyIDCard"
                  label="สำเนาบัตรประชาชน (บังคับ)"
                />
                <RHFUploadButton
                  file={values.certificateValueAddedTaxRegistration}
                  name="certificateValueAddedTaxRegistration"
                  label="ภพ 20"
                />
                <RHFUploadButton
                  file={values.copyBookBank}
                  name="copyBookBank"
                  label="สำเนาหน้าบัญชีธนาคาร (บังคับ)"
                />
              </Fragment>
            )}
            {!isBusinessRegistration && (
              <Fragment>
                <View>
                  <Text>
                    รูปถ่ายรถยนต์{isBusinessRegistration ? "" : " (บังคับ)"}
                  </Text>
                </View>
                <View style={styles.rowWrapper}>
                  <RHFUploadButton
                    file={values.frontOfVehicle}
                    name="frontOfVehicle"
                    label="ด้านหน้ารถ"
                    isImagePreview
                    actionMenus={["CAMERA", "GALLERY"]}
                  />
                  <RHFUploadButton
                    file={values.backOfVehicle}
                    name="backOfVehicle"
                    label="ด้านหลังรถ"
                    isImagePreview
                    actionMenus={["CAMERA", "GALLERY"]}
                  />
                </View>
                <View style={styles.rowWrapper}>
                  <RHFUploadButton
                    file={values.leftOfVehicle}
                    name="leftOfVehicle"
                    label="ด้านข้าง ซ้ายรถ"
                    isImagePreview
                    actionMenus={["CAMERA", "GALLERY"]}
                  />
                  <RHFUploadButton
                    file={values.rigthOfVehicle}
                    name="rigthOfVehicle"
                    label="ด้านข้าง ขวารถ"
                    isImagePreview
                    actionMenus={["CAMERA", "GALLERY"]}
                  />
                </View>
                <RHFUploadButton
                  file={values.copyVehicleRegistration}
                  name="copyVehicleRegistration"
                  label={`สำเนาทะเบียนรถ${isBusinessRegistration ? "" : " (บังคับ)"}`}
                />
                <RHFUploadButton
                  file={values.copyIDCard}
                  name="copyIDCard"
                  label={`สำเนาบัตรประชาชน${isBusinessRegistration ? "" : " (บังคับ)"}`}
                />
                <RHFUploadButton
                  file={values.copyDrivingLicense}
                  name="copyDrivingLicense"
                  label={`สำเนาใบขับขี่${isBusinessRegistration ? "" : " (บังคับ)"}`}
                />
                <RHFUploadButton
                  file={values.copyBookBank}
                  name="copyBookBank"
                  label="สำเนาหน้าบัญชีธนาคาร (บังคับ)"
                />
              </Fragment>
            )}
            <RHFUploadButton
              file={values.copyHouseRegistration}
              name="copyHouseRegistration"
              label="สำเนาทะเบียนบ้าน"
            />
            {!isBusinessRegistration && (
              <RHFUploadButton
                file={values.insurancePolicy}
                name="insurancePolicy"
                label="กรมธรรม์ประกันรถ"
              />
            )}
            <RHFUploadButton
              file={values.criminalRecordCheckCert}
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
