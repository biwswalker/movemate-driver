import colors from "@/constants/colors";
import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, View } from "react-native";
import { useSnackbarV2 } from "@/hooks/useSnackbar";
import { useEffect, useMemo } from "react";
import {
  EDriverType,
  useGetDistrictLazyQuery,
  useGetProvinceQuery,
  useGetSubDistrictLazyQuery,
  useVerifyEmployeeDataMutation,
  VerifyEmployeeDataMutation,
} from "@/graphql/generated/graphql";
import Yup from "@/utils/yup";
import { find, forEach, get, isEqual } from "lodash";
import {
  EmployeeDriverFormValue,
  EmployeeDriverFormValueType,
  EmployeeRegisterParam,
} from "./types";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ApolloError } from "@apollo/client";
import { YUP_VALIDATION_ERROR_TYPE } from "@/constants/error";
import FormProvider from "@/components/HookForm/FormProvider";
import RHFSelectDropdown from "@/components/HookForm/RHFSelectDropdown";
import { TITLE_NAME_OPTIONS } from "@/constants/values";
import RHFTextInput from "@/components/HookForm/RHFTextInput";
import Button from "@/components/Button";
import { normalize } from "@/utils/normalizeSize";
import Text from "@/components/Text";

interface NewEmployeeFormProps {
  phoneNumber: string;
}

export default function NewEmployeeForm({ phoneNumber }: NewEmployeeFormProps) {
  const { showSnackbar, DropdownType } = useSnackbarV2();
  const searchParam = useLocalSearchParams<{ param: string }>();
  const params = JSON.parse(searchParam.param || "{}") as EmployeeRegisterParam;

  const { data: prvinces, loading: provinceLoading } = useGetProvinceQuery();
  const [getDistrict, { data: district, loading: districtLoading }] =
    useGetDistrictLazyQuery();
  const [getSubDistrict, { data: subDistrict, loading: subDistrictLoading }] =
    useGetSubDistrictLazyQuery();
  const [verifyData, { loading: verifyLoading }] =
    useVerifyEmployeeDataMutation();

  const BusinessDriverScema = Yup.object().shape({
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
    address: Yup.string().required("ระบุที่อยู่"),
    province: Yup.string().required("ระบุจังหวัด"),
    district: Yup.string().required("ระบุอำเภอ/แขวง"),
    subDistrict: Yup.string().required("ระบุตำบล/เขต"),
    postcode: Yup.string()
      .required("ระบุรหัสไปรษณีย์")
      .min(5, "รหัสไปรษณีย์ 5 หลัก")
      .max(5, "รหัสไปรษณีย์ 5 หลัก"),
  });

  const defaultValues: EmployeeDriverFormValue = useMemo(() => {
    const detail = params.detail;
    return {
      title: detail?.title || "",
      otherTitle: detail?.otherTitle || "",
      firstname: detail?.firstname || "",
      lastname: detail?.lastname || "",
      taxNumber: detail?.taxNumber || "",
      lineId: detail?.lineId || "",
      phoneNumber,
      // Address
      address: detail?.address || "",
      province: detail?.province || "",
      district: detail?.district || "",
      subDistrict: detail?.subDistrict || "",
      postcode: detail?.postcode || "",
    };
  }, []);

  useEffect(() => {
    if (params.detail) {
      const detail = params.detail;
      getDistrict({ variables: { provinceThName: detail.province } });
      getSubDistrict({ variables: { districtName: detail.district } });
    }
  }, []);

  const methods = useForm<EmployeeDriverFormValue>({
    resolver: yupResolver(BusinessDriverScema) as any,
    defaultValues,
    mode: "onBlur",
  });

  const {
    handleSubmit,
    setValue,
    watch,
    setError,
    setFocus,
    clearErrors,
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
                title: "พบข้อผิดพลาด",
                message: `ไม่สามารถบันทึกได้ พบ ${errorlength} ข้อผิดพลาด`,
                type: DropdownType.Warn,
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
              type: DropdownType.Warn,
            });
            break;
        }
      });
    } else {
      console.log("error: ", error);
      showSnackbar({
        title: "พบข้อผิดพลาด",
        message: error.message || "เกิดข้อผิดพลาด กรุณาลองใหม่",
        type: DropdownType.Warn,
      });
    }
  }

  function handleVerifySuccess(data: VerifyEmployeeDataMutation) {
    const validatedData = data.verifyEmployeeData;
    const formValue = new EmployeeDriverFormValue(
      validatedData as EmployeeDriverFormValueType
    );
    const param = JSON.stringify(Object.assign(params, { detail: formValue }));
    router.push({ pathname: "/employee/documents", params: { param } });
  }

  async function onSubmit(values: EmployeeDriverFormValue) {
    try {
      const submitData = new EmployeeDriverFormValue(values);
      console.log(subDistrict);
      verifyData({
        variables: { data: submitData },
        onCompleted: handleVerifySuccess,
        onError: handleErrorVerified,
      });
    } catch (error) {}
  }

  return (
    <View style={styles.container}>
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
          name="taxNumber"
          label="เลขบัตรประจำตัวประชาชน*"
          helperText="กรอกเป็นตัวเลข 13 ตัวเท่านั้น"
        />
        <RHFTextInput name="lineId" label="ไลน์ไอดี" />

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
            getDistrict({
              variables: { provinceThName: province.nameTh },
            });
            setValue("province", province.nameTh);
            setValue("district", "");
            setValue("subDistrict", "");
            setValue("postcode", "");
            clearErrors("province");
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
            getSubDistrict({
              variables: { districtName: district.nameTh },
            });
            setValue("district", district.nameTh);
            setValue("subDistrict", "");
            setValue("postcode", "");
            clearErrors("district");
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
            clearErrors(["subDistrict", "postcode"]);
          }}
        />
        <RHFTextInput name="postcode" label="รหัสไปรษณีย์*" readOnly />

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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  inputWrapper: {},
  formSubtitle: {
    paddingTop: normalize(32),
    paddingLeft: 8,
  },
  actionWrapper: {
    paddingVertical: normalize(32),
  },
});
