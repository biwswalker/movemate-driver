import Button from "@/components/Button";
import FormProvider from "@/components/HookForm/FormProvider";
import RHFSelectDropdown from "@/components/HookForm/RHFSelectDropdown";
import RHFTextInput from "@/components/HookForm/RHFTextInput";
import NavigationBar from "@/components/NavigationBar";
import Text from "@/components/Text";
import colors from "@constants/colors";
import { YUP_VALIDATION_ERROR_TYPE } from "@/constants/error";
import { BANKPROVIDER, TITLE_NAME_OPTIONS } from "@/constants/values";
import {
  IndividualDriver,
  useGetDistrictLazyQuery,
  useGetProvinceQuery,
  useGetSubDistrictLazyQuery,
  useGetVehicleTypeAvailableQuery,
  VehicleType,
} from "@/graphql/generated/graphql";
import useAuth from "@/hooks/useAuth";
import useSnackbar from "@/hooks/useSnackbar";
import { normalize } from "@/utils/normalizeSize";
import Yup from "@/utils/yup";
import { ApolloError } from "@apollo/client";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFocusEffect } from "expo-router";
import { find, forEach, get, isEqual, map } from "lodash";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type FormValues = Omit<
  IndividualDriverFormValueType,
  "password" | "confirmPassword" | "policyVersion" | "driverType"
>;

export default function ProfileDetail() {
  const { user, refetchMe } = useAuth();
  const { showSnackbar } = useSnackbar();

  useFocusEffect(() => {
    refetchMe();
  });

  const { data: vehicleData } = useGetVehicleTypeAvailableQuery();
  const { data: prvinces, loading: provinceLoading } = useGetProvinceQuery();
  const [getDistrict, { data: district, loading: districtLoading }] =
    useGetDistrictLazyQuery();
  const [getSubDistrict, { data: subDistrict, loading: subDistrictLoading }] =
    useGetSubDistrictLazyQuery();

  const isApproved =
    user?.status === "active" && user.validationStatus === "approve";

  const vehicleTypes = useMemo<VehicleType[]>(() => {
    if (vehicleData?.getVehicleTypeAvailable) {
      return map(vehicleData.getVehicleTypeAvailable, (vehi) => ({
        ...vehi,
        name: `${vehi.name}${vehi.isConfigured ? "" : " (ยังไม่ให้บริการ)"}`,
      })) as VehicleType[];
    }
    return [];
  }, [vehicleData]);

  const individualDriver = useMemo<IndividualDriver | undefined>(() => {
    return user?.individualDriver as IndividualDriver;
  }, [user]);

  useEffect(() => {
    if (user?.individualDriver) {
      const driver = user.individualDriver;
      if (driver.province) {
        getDistrict({ variables: { provinceThName: driver.province } });
      }
      if (driver.district) {
        getSubDistrict({ variables: { districtName: driver.district } });
      }
    }
  }, [user?.individualDriver]);

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

  const defaultValues: FormValues = {
    title: individualDriver?.title || "",
    otherTitle: individualDriver?.otherTitle || "",
    firstname: individualDriver?.firstname || "",
    lastname: individualDriver?.lastname || "",
    taxId: individualDriver?.taxId || "",
    phoneNumber: individualDriver?.phoneNumber || "",
    lineId: individualDriver?.lineId || "",
    // Address
    address: individualDriver?.address || "",
    province: individualDriver?.province || "",
    district: individualDriver?.district || "",
    subDistrict: individualDriver?.subDistrict || "",
    postcode: individualDriver?.postcode || "",
    // Bank
    bank: individualDriver?.bank || "",
    bankBranch: individualDriver?.bankBranch || "",
    bankName: individualDriver?.bankName || "",
    bankNumber: individualDriver?.bankNumber || "",
    // Vehicle type
    serviceVehicleType: individualDriver?.serviceVehicleType._id || "",
  };

  const methods = useForm<FormValues>({
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

  function handleVerifySuccess() {
    showSnackbar({ message: "บันทึกสำเร็จ", varient: "success" });
    refetchMe();
  }

  async function onSubmit(values: FormValues) {
    try {
      // verifyData({
      //   variables: { data: submitData },
      //   onCompleted: handleVerifySuccess,
      //   onError: handleErrorVerified,
      // });
    } catch (error) {}
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.wrapper}>
        <NavigationBar title="ข้อมูลส่วนตัว" />
        <View style={styles.content}>
          <FormProvider methods={methods} containerStyle={styles.inputWrapper}>
            <RHFSelectDropdown
              disabled={!isApproved}
              name="title"
              label="คำนำหน้าชื่อ*"
              options={TITLE_NAME_OPTIONS}
              value={values.title}
              labelField="label"
              valueField="value"
            />
            {values.title === "อื่นๆ" && (
              <RHFTextInput
                disabled={!isApproved}
                name="otherTitle"
                label="ระบุคำนำหน้าชื่อ*"
              />
            )}
            <RHFTextInput
              disabled={!isApproved}
              name="firstname"
              label="ชื่อ*"
            />
            <RHFTextInput
              disabled={!isApproved}
              name="lastname"
              label="นามสกุล*"
            />
            <RHFTextInput
              disabled={!isApproved}
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
              disabled={!isApproved}
              name="phoneNumber"
              label="เบอร์โทรศัพท์*"
              helperText={
                errors.phoneNumber
                  ? errors.phoneNumber.message
                  : "กรอกเป็นตัวเลขไม่เกิน 10 ตัวเท่านั้น"
              }
            />
            <RHFTextInput
              disabled={!isApproved}
              name="lineId"
              label="ไลน์ไอดี"
            />

            <View style={styles.formSubtitle}>
              <Text varient="caption" color="disabled">
                ข้อมูลที่อยู่ปัจจุบัน
              </Text>
            </View>
            <RHFTextInput
              disabled={!isApproved}
              name="address"
              label="ที่อยู่*"
            />
            <RHFSelectDropdown
              disabled={!isApproved}
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
              disabled={!values.province || !isApproved}
              onChanged={(district) => {
                getSubDistrict({
                  variables: { districtName: district.nameTh },
                });
                setValue("district", district.nameTh);
                setValue("subDistrict", "");
                setValue("postcode", "");
              }}
            />
            <RHFSelectDropdown
              name="subDistrict"
              label="ตำบล*"
              options={subDistrict?.getSubDistrict || []}
              disabled={!values.district || !isApproved}
              value={values.subDistrict}
              labelField="nameTh"
              valueField="nameTh"
              onChanged={(subdistrict) => {
                const subDistrictData = find(
                  subDistrict?.getSubDistrict || [],
                  ["nameTh", subdistrict.nameTh]
                );
                setValue("subDistrict", subdistrict.nameTh);
                setValue("postcode", `${subDistrictData?.zipCode}` || "");
              }}
            />
            <RHFTextInput
              disabled={!isApproved}
              name="postcode"
              label="รหัสไปรษณีย์*"
              readOnly
            />
            <View style={styles.formSubtitle}>
              <Text varient="caption" color="disabled">
                บัญชีธนาคาร
              </Text>
            </View>
            <RHFSelectDropdown
              name="bank"
              label="ธนาคาร*"
              disabled={!isApproved}
              options={BANKPROVIDER}
              value={values.bank}
              labelField="label"
              valueField="value"
            />
            <RHFTextInput
              disabled={!isApproved}
              name="bankBranch"
              label="สาขา*"
            />
            <RHFTextInput
              disabled={!isApproved}
              name="bankName"
              label="ชื่อบัญชี*"
            />
            <RHFTextInput
              disabled={!isApproved}
              name="bankNumber"
              label="เลขที่บัญชี*"
            />

            <View style={styles.formSubtitle}>
              <Text varient="caption" color="disabled">
                เลือกประเภทรถที่ให้บริการ
              </Text>
            </View>
            <RHFSelectDropdown
              disabled={!isApproved}
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
                title="บันทึกการเปลี่ยนแปลง"
                size="large"
                onPress={handleSubmit(onSubmit)}
                disabled={!isApproved}
                // loading={verifyLoading}
              />
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
  inputWrapper: {
    paddingHorizontal: normalize(16),
  },
  actionWrapper: {
    paddingVertical: normalize(32),
  },
  formSubtitle: {
    paddingTop: normalize(32),
    paddingLeft: normalize(8),
  },
  helperText: {
    marginTop: normalize(8),
    paddingLeft: normalize(12),
  },
  inputWrapperColumn: {
    flexDirection: "row",
    gap: 8,
  },
});
