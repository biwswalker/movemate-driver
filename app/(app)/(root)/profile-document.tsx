import Button from "@/components/Button";
import FormProvider from "@/components/HookForm/FormProvider";
import RHFUploadButton from "@/components/HookForm/RHFUploadButton";
import NavigationBar from "@/components/NavigationBar";
import Text from "@/components/Text";
import colors from "@/constants/colors";
import { normalize } from "@/utils/normalizeSize";
import { fData } from "@/utils/number";
import Yup from "@/utils/yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { isEmpty } from "lodash";
import { useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type FormValue = RegisterUploadsFormValueType;

export const MAX_FILE_SIZE = 2 * 1000 * 1000;
const MAXIMUM_FILE_SIZE_TEXT = `ขนาดไฟล์ไม่เกิน ${fData(MAX_FILE_SIZE)}`;

export default function ProfileDocument() {
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

  const methods = useForm<FormValue>({
    resolver: yupResolver(RegisterUploadSchema) as any,
    defaultValues,
  });

  const { handleSubmit } = methods;

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
    flex: 1
  },
  rowWrapper: {
    flexDirection: "row",
    gap: normalize(8),
  },
  sectionContainer: {
    paddingBottom: normalize(32),
    paddingHorizontal: normalize(32),
  },
  documentList: {
    gap: normalize(12),
  },
  sectionTitleWrapper: {
    // paddingTop: normalize(48),
  },
});
