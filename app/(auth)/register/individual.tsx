import Colors from "@constants/colors";
import { ApolloError } from "@apollo/client";
import Button from "@components/Button";
import FormProvider from "@components/HookForm/FormProvider";
import RHFSelectDropdown from "@components/HookForm/RHFSelectDropdown";
import RHFTextInput from "@components/HookForm/RHFTextInput";
import CustomTextInput from "@components/TextInput";
import NavigationBar from "@components/NavigationBar";
import Text from "@components/Text";
import { YUP_VALIDATION_ERROR_TYPE } from "@constants/error";
import { BANKPROVIDER, TITLE_NAME_OPTIONS } from "@constants/values";
import {
  EDriverType,
  useGetDistrictLazyQuery,
  useGetProvinceQuery,
  useGetSubDistrictLazyQuery,
  useGetVehicleTypeAvailableQuery,
  useVerifyDriverDataMutation,
  VehicleType,
  VerifyDriverDataMutation,
} from "@graphql/generated/graphql";
import { yupResolver } from "@hookform/resolvers/yup";
import Yup from "@utils/yup";
import { find, forEach, get, isEqual, map, omit, reduce } from "lodash";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSnackbarV2 } from "@/hooks/useSnackbar";
import colors from "@constants/colors";
import { router, useLocalSearchParams } from "expo-router";
import { normalize } from "@/utils/normalizeSize";
import { TextInput } from "react-native-paper";
import { DropdownAlertType } from "react-native-dropdownalert";
import {
  DriverFormValue,
  DriverFormValueType,
  IndividualRegisterParam,
} from "@/types/register";
import VehicleSelectorModal, {
  VehicleSelectorRef,
} from "@/components/Modals/vehicle-selector";
import Iconify from "@/components/Iconify";
import { TouchableOpacity } from "@gorhom/bottom-sheet";
import { MaterialIcons } from "@expo/vector-icons";

export default function RegisterIndividualScreen() {
  const bottomSheetModalRef = useRef<VehicleSelectorRef>(null);
  const { showSnackbar } = useSnackbarV2();
  const searchParam = useLocalSearchParams<{ param: string }>();
  const params = JSON.parse(searchParam.param) as IndividualRegisterParam;

  const [openPassword, setOpenPassword] = useState(false);
  const [openConfirmPassword, setOpenConfirmPassword] = useState(false);

  const { data: prvinces, loading: provinceLoading } = useGetProvinceQuery();
  const [getDistrict, { data: district, loading: districtLoading }] =
    useGetDistrictLazyQuery();
  const [getSubDistrict, { data: subDistrict, loading: subDistrictLoading }] =
    useGetSubDistrictLazyQuery();
  const [verifyData, { loading: verifyLoading }] =
    useVerifyDriverDataMutation();

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

  const IndividualDriverScema = Yup.object().shape({
    policyVersion: Yup.number(),
    driverType: Yup.string(),
    title: Yup.string().required("กรุณาเลือกคำนำหน้าชื่อ"),
    otherTitle: Yup.string().when("title", ([title], schema) =>
      isEqual(title, "อื่นๆ")
        ? schema.required("ระบุคำนำหน้าชื่อ")
        : schema.notRequired()
    ),
    firstname: Yup.string()
      .required("ระบุชื่อ")
      .matches(/^[ก-๙\s]+$/, "ระบุเป็นภาษาไทยเท่านั้น"),
    lastname: Yup.string()
      .required("ระบุนามสกุล")
      .matches(/^[ก-๙\s]+$/, "ระบุเป็นภาษาไทยเท่านั้น"),
    taxNumber: Yup.string()
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
        /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
        "รหัสผ่านสามารถระบุตัวเลขและตัวอักษร ห้ามมีสัญลักษณ์"
      )
      .min(8, "รหัสผ่านจำเป็นต้องมี 8 ตัวขึ้นไป")
      .required("รหัสผ่านสามารถระบุตัวเลขและตัวอักษร ห้ามมีสัญลักษณ์"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "รหัสผ่านไม่ตรงกัน")
      .matches(
        /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
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
    serviceVehicleTypes: Yup.array().min(1, "ระบุประเภทรถที่ให้บริการ"),
    licensePlateProvince: Yup.string().required("ระบุจังหวัดทะเบียนรถ"),
    licensePlateNumber: Yup.string().required("ระบุหมายเลขทะเบียนรถ"),
  });

  const defaultValues: DriverFormValue = useMemo(() => {
    const type = params.type;
    const detail = params.detail;
    return {
      policyVersion: type?.version || 0,
      driverType: type?.driverType || EDriverType.INDIVIDUAL_DRIVER,
      title: detail?.title || "",
      otherTitle: detail?.otherTitle || "",
      firstname: detail?.firstname || "",
      lastname: detail?.lastname || "",
      businessName: "",
      businessBranch: "",
      taxNumber: detail?.taxNumber || "",
      phoneNumber: detail?.phoneNumber || "",
      lineId: detail?.lineId || "",
      password: detail?.password || "",
      confirmPassword: detail?.confirmPassword || "",
      // Address
      address: detail?.address || "",
      province: detail?.province || "",
      district: detail?.district || "",
      subDistrict: detail?.subDistrict || "",
      postcode: detail?.postcode || "",
      // Bank
      bank: detail?.bank || "",
      bankBranch: detail?.bankBranch || "",
      bankName: detail?.bankName || "",
      bankNumber: detail?.bankNumber || "",
      // Vehicle type
      serviceVehicleTypes: detail?.serviceVehicleTypes || [],
      licensePlateProvince: detail?.licensePlateProvince || "",
      licensePlateNumber: detail?.licensePlateNumber || "",
    };
  }, []);

  useEffect(() => {
    if (params.detail) {
      const detail = params.detail;
      getDistrict({ variables: { provinceThName: detail.province } });
      getSubDistrict({ variables: { districtName: detail.district } });
    }
  }, []);

  // eslint-disable-next-line react/no-unstable-nested-components
  const PassworHelperText = (error: boolean) => {
    return (
      <View style={styles.helperText}>
        <Text
          varient="caption"
          style={[error && { color: colors.error.main }]}
          color="secondary"
        >
          • รหัสผ่านความยาวจำนวน 8 ตัวขึ้นไป
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

  const ConfirmPassworHelperText = (error: boolean) => {
    return (
      <View style={styles.helperText}>
        <Text
          varient="caption"
          style={[error && { color: colors.error.main }]}
          color="secondary"
        >
          • รหัสผ่านต้องตรงกันกับต้นฉบับ
        </Text>
        <Text
          varient="caption"
          style={[error && { color: colors.error.main }]}
          color="secondary"
        >
          • รหัสผ่านความยาวจำนวน 8 ตัวขึ้นไป
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

  const methods = useForm<DriverFormValue>({
    resolver: yupResolver(IndividualDriverScema) as any,
    defaultValues,
    mode: "onBlur",
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

  const eyeIcon = openPassword
    ? require("@/assets/images/eye-duotone.png")
    : require("@/assets/images/eyeclose-duotone.png");
  const eyeIconConfirm = openConfirmPassword
    ? require("@/assets/images/eye-duotone.png")
    : require("@/assets/images/eyeclose-duotone.png");

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
                title: "พบข้อผิดพลาด",
                message: `ไม่สามารถบันทึกได้ พบ ${errorlength} ข้อผิดพลาด`,
                type: DropdownAlertType.Warn,
              });
            }
            forEach(errors, ({ path, ...message }) => setError(path, message));
            setFocus(get(errors, "0.path", ""));
            break;
          default:
            console.log(graphQLError);
            showSnackbar({
              title: "พบข้อผิดพลาด",
              message: graphQLError?.message || "เกิดข้อผิดพลาด กรุณาลองใหม่",
              type: DropdownAlertType.Warn,
            });
            break;
        }
      });
    } else {
      console.log("error: ", error);
      showSnackbar({
        title: "พบข้อผิดพลาด",
        message: error.message || "เกิดข้อผิดพลาด กรุณาลองใหม่",
        type: DropdownAlertType.Warn,
      });
    }
  }

  function handleVerifySuccess(data: VerifyDriverDataMutation) {
    const validatedData = data.verifyDriverData;
    const formValue = new DriverFormValue(validatedData as DriverFormValueType);
    const param = JSON.stringify(Object.assign(params, { detail: formValue }));
    router.push({ pathname: "/register/documents", params: { param } });
  }

  async function onSubmit(values: DriverFormValue) {
    try {
      const submitData = new DriverFormValue(values);
      verifyData({
        variables: { data: omit(submitData, ["confirmPassword"]) },
        onCompleted: handleVerifySuccess,
        onError: handleErrorVerified,
      });
    } catch (error) {}
  }

  function handleSelectedVehicle() {
    if (bottomSheetModalRef.current) {
      bottomSheetModalRef.current.present();
    }
  }

  function handleOnSelectedVehicleModal(vehicles: string[]) {
    console.log("vehicles: ", vehicles);
    setValue("serviceVehicleTypes", vehicles);
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.wrapper}>
        <NavigationBar
          onBack={() => {
            router.navigate("/register");
          }}
        />
        {/* <View style={styles.contentContainer}> */}
        <FormProvider methods={methods} containerStyle={styles.inputWrapper} extraScrollHeight={120}>
          <View style={styles.headerWrapper}>
            <Text varient="h3">ข้อมูลส่วนตัว</Text>
            <Text varient="body2" color="disabled">
              กรุญากรอกข้อมูลของท่านให้ครบถ้วน
            </Text>
          </View>
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
            name="taxNumber"
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
            secureTextEntry={!openPassword}
            helperText={PassworHelperText}
            right={
              <TextInput.Icon
                icon={eyeIcon}
                forceTextInputFocus={false}
                color={colors.text.secondary}
                onPress={() => setOpenPassword(!openPassword)}
              />
            }
          />
          <RHFTextInput
            name="confirmPassword"
            label="ยืนยันรหัสผ่าน*"
            secureTextEntry={!openConfirmPassword}
            helperText={ConfirmPassworHelperText}
            right={
              <TextInput.Icon
                icon={eyeIconConfirm}
                forceTextInputFocus={false}
                color={colors.text.secondary}
                onPress={() => setOpenConfirmPassword(!openConfirmPassword)}
              />
            }
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
            <CustomTextInput
              // multiline
              onPress={handleSelectedVehicle}
              value={reduce(
                values.serviceVehicleTypes,
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
              label="ประเภทรถที่ให้บริการ"
              disabled
              error={!!errors.serviceVehicleTypes}
              helperText={errors.serviceVehicleTypes?.message}
              right={
                <TextInput.Icon
                  icon={({ color, size }) => (
                    <Iconify
                      icon="system-uicons:plus"
                      color={color || colors.text.primary}
                      size={size}
                    />
                  )}
                />
              }
            />
          </View>
          <RHFSelectDropdown
            dropdownPosition="top"
            name="licensePlateProvince"
            label="จังหวัดทะเบียนรถ*"
            options={prvinces?.getProvince || []}
            labelField="nameTh"
            valueField="nameTh"
            value={values.licensePlateProvince}
          />
          <RHFTextInput name="licensePlateNumber" label="หมายเลขทะเบียนรถ*" />

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
        {/* </View> */}
      </SafeAreaView>
      <VehicleSelectorModal
        ref={bottomSheetModalRef}
        onSelected={handleOnSelectedVehicleModal}
        value={values.serviceVehicleTypes}
      />
    </View>
  );
}

// Custom Icon Component
const CustomIcon = () => (
  <TouchableOpacity>
    <MaterialIcons name="search" size={24} color="black" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.common.white },
  wrapper: { flex: 1 },
  contentContainer: { flex: 1 },
  headerWrapper: { paddingHorizontal: 16, paddingBottom: 16 },
  contentWrapper: { marginTop: 48, gap: 12 },
  inputWrapper: { paddingHorizontal: 16 },
  actionWrapper: { paddingVertical: 32 },
  formSubtitle: { paddingTop: 26 },
  helperText: { marginTop: 8, paddingLeft: 12 },
  inputWrapperColumn: { flexDirection: "row", gap: 8 },
});
