import Colors from "@constants/colors";
import { ApolloError } from "@apollo/client";
import Button from "@components/Button";
import FormProvider from "@components/HookForm/FormProvider";
import RHFSelectDropdown from "@components/HookForm/RHFSelectDropdown";
import RHFTextInput from "@components/HookForm/RHFTextInput";
import NavigationBar from "@components/NavigationBar";
import Text from "@components/Text";
import { YUP_VALIDATION_ERROR_TYPE } from "@constants/error";
import { BANKPROVIDER, TITLE_NAME_OPTIONS } from "@constants/values";
import {
  useGetDistrictLazyQuery,
  useGetProvinceQuery,
  useGetSubDistrictLazyQuery,
  useGetVehicleTypeAvailableQuery,
  useVerifyIndiividualDriverDataMutation,
  VehicleType,
  VerifyIndiividualDriverDataMutation,
} from "@graphql/generated/graphql";
import { yupResolver } from "@hookform/resolvers/yup";
import Yup from "@utils/yup";
import { find, forEach, get, isEqual } from "lodash";
import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useSnackbar from "@/hooks/useSnackbar";
import colors from "@constants/colors";
import { router, useLocalSearchParams } from "expo-router";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.common.white,
  },
  wrapper: {
    flex: 1,
  },
  headerWrapper: {
    paddingHorizontal: 32,
    paddingBottom: 32,
  },
  contentWrapper: {
    marginTop: 48,
    gap: 12,
  },
  inputWrapper: {
    paddingHorizontal: 32,
  },
  actionWrapper: {
    paddingVertical: 32,
  },
  formSubtitle: {
    paddingTop: 32,
    paddingLeft: 8,
  },
  helperText: {
    marginTop: 8,
    paddingLeft: 12,
  },
  inputWrapperColumn: {
    flexDirection: "row",
    gap: 8,
  },
});

export class IndividualDriverFormValue
  implements IndividualDriverFormValueType
{
  constructor(data: IndividualDriverFormValueType) {
    this.policyVersion = data.policyVersion;
    this.driverType = data.driverType;
    this.title = data.title;
    this.otherTitle = data.otherTitle;
    this.firstname = data.firstname;
    this.lastname = data.lastname;
    this.taxId = data.taxId;
    this.phoneNumber = data.phoneNumber;
    this.lineId = data.lineId;
    this.password = data.password;
    this.address = data.address;
    this.province = data.province;
    this.district = data.district;
    this.subDistrict = data.subDistrict;
    this.postcode = data.postcode;
    this.bank = data.bank;
    this.bankBranch = data.bankBranch;
    this.bankName = data.bankName;
    this.bankNumber = data.bankNumber;
    this.serviceVehicleType = data.serviceVehicleType;
  }

  policyVersion: number;
  driverType: string;
  title: string;
  otherTitle?: string;
  firstname: string;
  lastname: string;
  taxId: string;
  phoneNumber: string;
  lineId: string;
  password: string;
  address: string;
  province: string;
  district: string;
  subDistrict: string;
  postcode: string;
  bank: string;
  bankBranch: string;
  bankName: string;
  bankNumber: string;
  serviceVehicleType: string;
}

interface IndividualParam {
  driverType: string;
  version: number;
}

export default function RegisterIndividualScreen() {
  const { showSnackbar } = useSnackbar();
  const searchParam = useLocalSearchParams<{ param: string }>();
  const params = JSON.parse(searchParam.param) as IndividualParam;

  const { data: vehicleData } = useGetVehicleTypeAvailableQuery();
  const { data: prvinces, loading: provinceLoading } = useGetProvinceQuery();
  const [getDistrict, { data: district, loading: districtLoading }] =
    useGetDistrictLazyQuery();
  const [getSubDistrict, { data: subDistrict, loading: subDistrictLoading }] =
    useGetSubDistrictLazyQuery();
  const [verifyData, { loading: verifyLoading }] =
    useVerifyIndiividualDriverDataMutation();

  const vehicleTypes = useMemo<VehicleType[]>(() => {
    if (vehicleData?.getVehicleTypeAvailable) {
      return vehicleData.getVehicleTypeAvailable as VehicleType[];
    }
    return [];
  }, [vehicleData]);

  const IndividualScema = Yup.object().shape({
    policyVersion: Yup.number(),
    driverType: Yup.string(),
    title: Yup.string().required("กรุณาเลือกคำนำหน้าชื่อ"),
    otherTitle: Yup.string().when("title", ([title], schema) =>
      isEqual(title, "อื่นๆ")
        ? schema.required("ระบุคำนำหน้าชื่อ")
        : schema.notRequired()
    ),
    firstname: Yup.string().required("ระบุชื่อ"),
    lastname: Yup.string().required("ระบุนามสกุล"),
    taxId: Yup.string()
      .matches(/^[0-9]+$/, "เลขประจำตัวผู้เสียภาษีเป็นตัวเลขเท่านั้น")
      .min(13, "เลขประจำตัวผู้เสียภาษี 13 หลัก")
      .max(13, "เลขประจำตัวผู้เสียภาษี 13 หลัก"),
    phoneNumber: Yup.string()
      .matches(/^(0[689]{1})+([0-9]{8})+$/, "เบอร์ติดต่อไม่ถูกต้อง")
      .min(10, "ระบุหมายเลขโทรศัพท์ไม่เกิน 10 หลัก")
      .max(10, "ระบุหมายเลขโทรศัพท์ไม่เกิน 10 หลัก")
      .required("ระบุหมายเลขโทรศัพท์"),
    lineId: Yup.string(), //.required('ระบุไลน์ไอดี'),
    password: Yup.string()
      .matches(
        /^[a-zA-Z0-9_.-]*$/,
        "รหัสผ่านสามารถระบุตัวเลขและตัวอักษร ห้ามมีสัญลักษณ์"
      )
      .min(8, "รหัสผ่านจำเป็นต้องมี 8 ตัวขึ้นไป")
      .required("รหัสผ่านสามารถระบุตัวเลขและตัวอักษร ห้ามมีสัญลักษณ์"),

    address: Yup.string().required("ระบุที่อยู่"),
    province: Yup.string().required("ระบุจังหวัด"),
    district: Yup.string().required("ระบุอำเภอ/แขวง"),
    subDistrict: Yup.string().required("ระบุตำบล/เขต"),
    postcode: Yup.string()
      .required("ระบุรหัสไปรษณีย์")
      .min(5, "รหัสไปรษณีย์ 5 หลัก")
      .max(5, "รหัสไปรษณีย์ 5 หลัก"),

    bank: Yup.string().required("ระบุธนาคารที่ชำระ"),
    bankBranch: Yup.string()
      .required("ระบุชื่อสาขาธนาคาร")
      .matches(/^[a-zA-Z0-9ก-๙\s]+$/g, "ไม่อนุญาตมีอักษรพิเศษ"),
    bankName: Yup.string()
      .required("ระบุชื่อบัญชี")
      .matches(/^[a-zA-Z0-9ก-๙\s]+$/g, "ไม่อนุญาตมีอักษรพิเศษ"),
    bankNumber: Yup.string()
      .required("ระบุเลขที่บัญชี")
      .matches(/^[0-9\s]+$/g, "ตัวเลขเท่านั้น")
      .min(10, "ตัวเลขขั้นต่ำ 10 หลัก")
      .max(15, "ตัวเลขสูงสุด 15 หลัก"),
    serviceVehicleType: Yup.string().required("ระบุประเภทรถที่ให้บริการ"),
  });

  const defaultValues: IndividualDriverFormValue = {
    policyVersion: params.version || 0,
    driverType: params.driverType || "",
    title: "",
    otherTitle: "",
    firstname: "",
    lastname: "",
    taxId: "",
    phoneNumber: "",
    lineId: "",
    password: "",
    // Address
    address: "",
    province: "",
    district: "",
    subDistrict: "",
    postcode: "",
    // Bank
    bank: "",
    bankBranch: "",
    bankName: "",
    bankNumber: "",
    // Vehicle type
    serviceVehicleType: "",
  };

  // eslint-disable-next-line react/no-unstable-nested-components
  const PassworHelperText = (error: boolean) => {
    return (
      <View style={styles.helperText}>
        <Text
          varient="caption"
          style={[error && { color: colors.error.main }]}
          color="secondary"
        >
          • รหัสผ่านความยาวจำนวน 6 ตัวขึ้นไป
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

  const methods = useForm<IndividualDriverFormValue>({
    resolver: yupResolver(IndividualScema) as any,
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    watch,
    setError,
    setFocus,
    formState: { errors },
  } = methods;

  const values = watch();

  function handleErrorVerified(error: ApolloError) {
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
                message: `ไม่สามารถบันทึกได้ พบ ${errorlength} ข้อผิดพลาด`,
              });
            }
            forEach(errors, ({ path, ...message }) => setError(path, message));
            setFocus(get(errors, "0.path", ""));
            break;
          default:
            showSnackbar({ message: "เกิดข้อผิดพลาด กรุณาลองใหม่" });
            break;
        }
      });
    } else {
      console.log("error: ", error);
      showSnackbar({ message: error.message || "เกิดข้อผิดพลาด กรุณาลองใหม่" });
    }
  }

  function handleVerifySuccess(data: VerifyIndiividualDriverDataMutation) {
    const formValue = new IndividualDriverFormValue(
      data.verifyIndiividualDriverData as IndividualDriverFormValueType
    );
    const param = JSON.stringify(formValue);
    router.push({ pathname: "/register/documents", params: { param } });
  }

  async function onSubmit(values: IndividualDriverFormValue) {
    try {
      const submitData = new IndividualDriverFormValue(values);
      verifyData({
        variables: { data: submitData },
        onCompleted: handleVerifySuccess,
        onError: handleErrorVerified,
      });
    } catch (error) {}
  }

  return (
    <SafeAreaView style={styles.container}>
      <NavigationBar
        onBack={() => {
          router.navigate("/register");
        }}
      />
      <View style={styles.wrapper}>
        <View style={styles.headerWrapper}>
          <Text varient="h3">ข้อมูลส่วนตัว</Text>
          <Text varient="body2" color="disabled">
            กรุญากรอกข้อมูลของท่านให้ครบถ้วน
          </Text>
        </View>
        <FormProvider methods={methods} containerStyle={styles.inputWrapper}>
          <RHFSelectDropdown
            name="title"
            label="คำนำหน้าชื่อ*"
            options={TITLE_NAME_OPTIONS}
            value={values.title}
            labelField="label"
            valueField="value"
          />
          {values.title === "อื่นๆ" && (
            <RHFTextInput name="otherTitle" label="ระบุคำนำหน้าชื่อ*" />
          )}
          <RHFTextInput name="firstname" label="ชื่อ*" />
          <RHFTextInput name="lastname" label="นามสกุล*" />
          <RHFTextInput
            name="taxId"
            label="เลขบัตรประจำตัวประชาชน*"
            helperText="กรอกเป็นตัวเลข 13 ตัวเท่านั้น"
          />
          <View style={styles.formSubtitle}>
            <Text varient="caption" color="disabled">
              ข้อมูลการลงชื่อเข้าใช้
            </Text>
          </View>
          <RHFTextInput
            name="phoneNumber"
            label="เบอร์โทรศัพท์*"
            helperText={
              errors.phoneNumber
                ? errors.phoneNumber.message
                : "กรอกเป็นตัวเลขไม่เกิน 10 ตัวเท่านั้น"
            }
          />
          <RHFTextInput name="lineId" label="ไลน์ไอดี" />
          <RHFTextInput
            name="password"
            label="ตั้งค่ารหัสผ่าน*"
            secureTextEntry
            helperText={PassworHelperText}
          />

          <View style={styles.formSubtitle}>
            <Text varient="caption" color="disabled">
              ข้อมูลที่อยู่ปัจจุบัน
            </Text>
          </View>
          <RHFTextInput name="address" label="ที่อยู่*" />
          <RHFSelectDropdown
            name="province"
            label="จังหวัด*"
            options={prvinces?.getProvince || []}
            labelField="nameTh"
            valueField="nameTh"
            value={values.province}
            onChanged={(province) => {
              getDistrict({ variables: { provinceThName: province.nameTh } });
              setValue("province", province.nameTh);
              setValue("district", "");
              setValue("subDistrict", "");
              setValue("postcode", "");
            }}
          />
          <RHFSelectDropdown
            name="district"
            label="อำเภอ*"
            options={district?.getDistrict || []}
            labelField="nameTh"
            valueField="nameTh"
            value={values.district}
            disabled={!values.province}
            onChanged={(district) => {
              getSubDistrict({ variables: { districtName: district.nameTh } });
              setValue("district", district.nameTh);
              setValue("subDistrict", "");
              setValue("postcode", "");
            }}
          />
          <RHFSelectDropdown
            name="subDistrict"
            label="ตำบล*"
            options={subDistrict?.getSubDistrict || []}
            disabled={!values.district}
            value={values.subDistrict}
            labelField="nameTh"
            valueField="nameTh"
            onChanged={(subdistrict) => {
              const subDistrictData = find(subDistrict?.getSubDistrict || [], [
                "nameTh",
                subdistrict.nameTh,
              ]);
              setValue("subDistrict", subdistrict.nameTh);
              setValue("postcode", `${subDistrictData?.zipCode}` || "");
            }}
          />
          <RHFTextInput name="postcode" label="รหัสไปรษณีย์*" readOnly />
          <View style={styles.formSubtitle}>
            <Text varient="caption" color="disabled">
              บัญชีธนาคาร
            </Text>
          </View>
          <RHFSelectDropdown
            name="bank"
            label="ธนาคาร*"
            options={BANKPROVIDER}
            value={values.bank}
            labelField="label"
            valueField="value"
          />
          <RHFTextInput name="bankBranch" label="สาขา*" />
          <RHFTextInput name="bankName" label="ชื่อบัญชี*" />
          <RHFTextInput name="bankNumber" label="เลขที่บัญชี*" />

          <View style={styles.formSubtitle}>
            <Text varient="caption" color="disabled">
              เลือกประเภทรถที่ให้บริการ
            </Text>
          </View>
          <RHFSelectDropdown
            dropdownPosition="top"
            name="serviceVehicleType"
            label="ประเภทรถที่ให้บริการ*"
            options={vehicleTypes}
            value={values.serviceVehicleType}
            labelField="name"
            valueField="_id"
          />
          <View style={styles.actionWrapper}>
            <Button
              fullWidth
              title="ดำเนินการต่อ"
              size="large"
              onPress={handleSubmit(onSubmit)}
              loading={verifyLoading}
            />
          </View>
        </FormProvider>
      </View>
    </SafeAreaView>
  );
}
