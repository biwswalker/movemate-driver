import Button from "@/components/Button";
import FormProvider from "@/components/HookForm/FormProvider";
import RHFUploadButton from "@/components/HookForm/RHFUploadButton";
import NavigationBar from "@/components/NavigationBar";
import Text from "@/components/Text";
import colors from "@/constants/colors";
import useAuth from "@/hooks/useAuth";
import { imagePath } from "@/utils/file";
import { normalize } from "@/utils/normalizeSize";
import { fData } from "@/utils/number";
import Yup from "@/utils/yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { isEmpty } from "lodash";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
}

export const MAX_FILE_SIZE = 2 * 1000 * 1000;
const MAXIMUM_FILE_SIZE_TEXT = `ขนาดไฟล์ไม่เกิน ${fData(MAX_FILE_SIZE)}`;

export default function ProfileDocument() {
  const { user } = useAuth();
  const documents = useMemo(() => user?.individualDriver?.documents, [user]);
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
    }),
    []
  );

  const methods = useForm<FormValue>({
    resolver: yupResolver(RegisterUploadSchema) as any,
    defaultValues,
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    if (documents) {
      reset(defaultValues);
      console.log('defaultValues: ', defaultValues)
    }
  }, [documents]);

  async function onSubmit(values: FormValue) {
    try {
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
              <View style={styles.sectionTitleWrapper}>
                <Text>รูปถ่ายรถยนต์ (บังคับ)</Text>
              </View>
              <View style={styles.rowWrapper}>
                <RHFUploadButton
                  disabled
                  name="frontOfVehicle"
                  label="ด้านหน้ารถ"
                  isImagePreview
                />
                <RHFUploadButton
                  disabled
                  name="backOfVehicle"
                  label="ด้านหลังรถ"
                  isImagePreview
                />
              </View>
              <View style={styles.rowWrapper}>
                <RHFUploadButton
                  disabled
                  name="leftOfVehicle"
                  label="ด้านข้าง ซ้ายรถ"
                  isImagePreview
                />
                <RHFUploadButton
                  disabled
                  name="rigthOfVehicle"
                  label="ด้านข้าง ขวารถ"
                  isImagePreview
                />
              </View>
              <RHFUploadButton
                disabled
                name="copyVehicleRegistration"
                label="สำเนาทะเบียนรถ (บังคับ)"
              />
              <RHFUploadButton
                disabled
                name="copyIDCard"
                label="สำเนาบัตรประชาชน (บังคับ)"
              />
              <RHFUploadButton
                disabled
                name="copyDrivingLicense"
                label="สำเนาใบขับขี่ (บังคับ)"
              />
              <RHFUploadButton
                disabled
                name="copyBookBank"
                label="สำเนาหน้าบัญชีธนาคาร"
              />
              <RHFUploadButton
                disabled
                name="copyHouseRegistration"
                label="สำเนาทะเบียนบ้าน"
              />
              <RHFUploadButton
                disabled
                name="insurancePolicy"
                label="กรมธรรม์ประกันรถ"
              />
              <RHFUploadButton
                disabled
                name="criminalRecordCheckCert"
                label="หนังสือรับรองตรวจประวัติอาชญากรรม"
              />
              {/* <View style={styles.submitStyle}>
                <Button
                  fullWidth
                  size="large"
                  title="ยืนยันการสมัคร"
                  onPress={handleSubmit(onSubmit)}
                />
              </View> */}
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
  },
  sectionTitleWrapper: {
    // paddingTop: normalize(48),
  },
});
