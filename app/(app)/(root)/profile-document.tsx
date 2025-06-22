import Button from "@/components/Button";
import FormProvider from "@/components/HookForm/FormProvider";
import RHFUploadButton from "@/components/HookForm/RHFUploadButton";
import NavigationBar from "@/components/NavigationBar";
import Text from "@/components/Text";
import colors from "@constants/colors";
import useAuth from "@/hooks/useAuth";
import { imagePath } from "@/utils/file";
import { normalize } from "@/utils/normalizeSize";
import { fData } from "@/utils/number";
import Yup from "@/utils/yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { get, includes, isEmpty } from "lodash";
import { Fragment, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  EDriverType,
  EUserStatus,
  EUserValidationStatus,
} from "@/graphql/generated/graphql";

interface FormValue {
  frontOfVehicle: FileInput | string;
  backOfVehicle: FileInput | string;
  leftOfVehicle: FileInput | string;
  rigthOfVehicle: FileInput | string;
  copyVehicleRegistration: FileInput | string;
  copyIDCard: FileInput | string;
  copyDrivingLicense: FileInput | string;
  copyBookBank: FileInput | string;
  copyHouseRegistration: FileInput | string;
  insurancePolicy: FileInput | string;
  criminalRecordCheckCert: FileInput | string;
  businessRegistrationCertificate: FileInput | string;
  certificateValueAddedTaxRegistration: FileInput | string;
}

export const MAX_FILE_SIZE = 10 * 1000 * 1000;
const MAXIMUM_FILE_SIZE_TEXT = `ขนาดไฟล์ไม่เกิน ${fData(MAX_FILE_SIZE)}`;

export default function ProfileDocument() {
  const { user } = useAuth();

  const isApproved =
    user?.status === EUserStatus.ACTIVE &&
    user.validationStatus === EUserValidationStatus.APPROVE;

  const documents = useMemo(() => user?.driverDetail?.documents, [user]);
  const isBusinessRegistration = useMemo(() => {
    if (user?.driverDetail) {
      return includes(user.driverDetail.driverType, EDriverType.BUSINESS);
    }
    return false;
  }, [user]);

  const isOnlyBusinessDriver = useMemo(() => {
    const driverTypes = get(user, "driverDetail.driverType", []);
    if (user?.driverDetail) {
      if (driverTypes.length <= 1) {
        return includes(driverTypes, EDriverType.BUSINESS_DRIVER);
      }
    }
    return false;
  }, [user]);

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
      .test("require-file", "อัพโหลดสำเนาหน้าบัญชีธนาคาร", (value) =>
        isOnlyBusinessDriver ? true : !isEmpty(value)
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

  const defaultValues = useMemo(
    () => ({
      frontOfVehicle: documents?.frontOfVehicle
        ? imagePath(documents.frontOfVehicle.filename)
        : undefined,
      backOfVehicle: documents?.backOfVehicle
        ? imagePath(documents.backOfVehicle.filename)
        : undefined,
      leftOfVehicle: documents?.leftOfVehicle
        ? imagePath(documents.leftOfVehicle.filename)
        : undefined,
      rigthOfVehicle: documents?.rigthOfVehicle
        ? imagePath(documents.rigthOfVehicle.filename)
        : undefined,
      copyVehicleRegistration: documents?.copyVehicleRegistration
        ? imagePath(documents.copyVehicleRegistration.filename)
        : undefined,
      copyIDCard: documents?.copyIDCard
        ? imagePath(documents.copyIDCard.filename)
        : undefined,
      copyDrivingLicense: documents?.copyDrivingLicense
        ? imagePath(documents.copyDrivingLicense.filename)
        : undefined,
      copyBookBank: documents?.copyBookBank
        ? imagePath(documents.copyBookBank.filename)
        : undefined,
      copyHouseRegistration: documents?.copyHouseRegistration
        ? imagePath(documents.copyHouseRegistration.filename)
        : undefined,
      insurancePolicy: documents?.insurancePolicy
        ? imagePath(documents.insurancePolicy.filename)
        : undefined,
      criminalRecordCheckCert: documents?.criminalRecordCheckCert
        ? imagePath(documents.criminalRecordCheckCert.filename)
        : undefined,
      businessRegistrationCertificate:
        documents?.businessRegistrationCertificate
          ? imagePath(documents.businessRegistrationCertificate.filename)
          : undefined,
      certificateValueAddedTaxRegistration:
        documents?.certificateValueAddedTaxRegistration
          ? imagePath(documents.certificateValueAddedTaxRegistration.filename)
          : undefined,
    }),
    []
  );

  const methods = useForm<FormValue>({
    resolver: yupResolver(RegisterUploadSchema) as any,
    defaultValues,
    disabled: !isApproved,
  });

  const { handleSubmit, reset, watch } = methods;
  const values = watch();

  useEffect(() => {
    if (documents) {
      reset(defaultValues);
      console.log("defaultValues: ", defaultValues);
    }
  }, [documents]);

  async function onSubmit(values: FormValue) {
    try {
      // TODO: Add update documents
      // if (params && values) {
      //   const documents = new RegisterUploadsFormValue(values);
      //   const param = JSON.stringify({ detail: params, documents });
      //   console.log('---param---', param)
      //   router.push({ pathname: "/register/preview", params: { param } });
      // }
    } catch (error) {
      console.log("errors: ", error);
    }
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.wrapper}>
        <NavigationBar title="ข้อมูลเอกสาร" />
        <View style={styles.content}>
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
                    disabled={isApproved && !!values.copyVehicleRegistration}
                    file={values.copyVehicleRegistration}
                    name="copyVehicleRegistration"
                    label={`สำเนาทะเบียนรถ${isBusinessRegistration ? "" : " (บังคับ)"}`}
                  />
                  <RHFUploadButton
                    disabled={isApproved && !!values.copyIDCard}
                    file={values.copyIDCard}
                    name="copyIDCard"
                    label={`สำเนาบัตรประชาชน${isBusinessRegistration ? "" : " (บังคับ)"}`}
                  />
                  <RHFUploadButton
                    disabled={isApproved && !!values.copyDrivingLicense}
                    file={values.copyDrivingLicense}
                    name="copyDrivingLicense"
                    label={`สำเนาใบขับขี่${isBusinessRegistration ? "" : " (บังคับ)"}`}
                  />
                  {!isOnlyBusinessDriver && (
                    <RHFUploadButton
                      disabled={isApproved && !!values.copyBookBank}
                      file={values.copyBookBank}
                      name="copyBookBank"
                      label="สำเนาหน้าบัญชีธนาคาร (บังคับ)"
                    />
                  )}
                </Fragment>
              )}
              <RHFUploadButton
                disabled={isApproved && !!values.copyHouseRegistration}
                file={values.copyHouseRegistration}
                name="copyHouseRegistration"
                label="สำเนาทะเบียนบ้าน"
              />
              <RHFUploadButton
                disabled={isApproved && !!values.insurancePolicy}
                file={values.insurancePolicy}
                name="insurancePolicy"
                label="กรมธรรม์ประกันรถ"
              />
              <RHFUploadButton
                disabled={isApproved && !!values.criminalRecordCheckCert}
                file={values.criminalRecordCheckCert}
                name="criminalRecordCheckCert"
                label="หนังสือรับรองตรวจประวัติอาชญากรรม"
              />
              <View style={styles.submitStyle}>
                <Button
                  fullWidth
                  size="large"
                  title="บันทึกข้อมูล"
                  onPress={handleSubmit(onSubmit)}
                />
              </View>
            </View>
          </FormProvider>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.common.white,
  },
  wrapper: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  rowWrapper: {
    flexDirection: "row",
    gap: normalize(8),
  },
  sectionContainer: {
    paddingBottom: normalize(32),
    paddingHorizontal: normalize(16),
  },
  documentList: {
    gap: normalize(12),
    paddingBottom: normalize(16),
  },
  sectionTitleWrapper: {
    // paddingTop: normalize(48),
  },
  submitStyle: {
    paddingTop: normalize(32),
  },
});
