import { forwardRef, Fragment, useCallback, useImperativeHandle, useMemo } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import Text from "./Text";
import Button from "./Button";
import { normalize } from "@/utils/normalizeSize";
import hexToRgba from "hex-to-rgba";
import colors from "@/constants/colors";
import {
  AcceptationEmployeeMutation,
  useAcceptationEmployeeMutation,
  useGetEmployeeRequestQuery,
  User,
} from "@/graphql/generated/graphql";
import { ApolloError } from "@apollo/client";
import { useSnackbarV2 } from "@/hooks/useSnackbar";
import { get } from "lodash";

export interface EmploymentApprovalRef {
  refetch: VoidFunction;
}

interface EmploymentApprovalProps {
  containerStyle?: StyleProp<ViewStyle>;
}

const EmploymentApproval = forwardRef<
  EmploymentApprovalRef,
  EmploymentApprovalProps
>(({ containerStyle = {} }, ref) => {
  const { showSnackbar, DropdownType } = useSnackbarV2();

  const { data: rawRequester, refetch } = useGetEmployeeRequestQuery();
  const [acceptationEmployee, { loading }] = useAcceptationEmployeeMutation();

  const requester = useMemo<User | undefined>(() => {
    console.log(rawRequester?.getEmployeeRequest);
    const agent = get(rawRequester, "getEmployeeRequest", undefined) as
      | User
      | undefined;
    return agent;
  }, [rawRequester?.getEmployeeRequest]);

  function reload() {
    refetch();
  }

  useImperativeHandle(ref, () => ({
    refetch: reload,
  }));

  if (!requester) {
    return <Fragment />;
  }

  function onError(error: ApolloError) {
    showSnackbar({
      title: "เกิดข้อผิดพลาด",
      message: error.message || "ไม่สามารถดำเนินการได้ เนื่องจากพบข้อผิดพลาด",
      type: DropdownType.Warn,
    });
  }

  function onComplete(response: AcceptationEmployeeMutation) {
    if (response.acceptationEmployee) {
      showSnackbar({
        title: "ยืนยันคำขอสำเร็จ",
        message: "ท่านได้ทำการยืนยันคำขอแล้ว",
        type: DropdownType.Success,
      });
    } else {
      showSnackbar({
        title: "ปฎิเสธคำขอแล้ว",
        message: "ท่านได้ทำการปฎิเสธคำขอแล้ว",
        type: DropdownType.Info,
      });
    }
    reload();
  }

  const handleApproveEmployee = (_id: string) => {
    acceptationEmployee({
      variables: { agentId: _id, result: "accept" },
      onCompleted: onComplete,
      onError: onError,
    });
  };

  const handleDeniedEmployee = (_id: string) => {
    acceptationEmployee({
      variables: { agentId: _id, result: "reject" },
      onCompleted: onComplete,
      onError: onError,
    });
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.wrapper}>
        <Text varient="body1">คำขอการยอมรับเป็นคนขับของนายหน้า</Text>
        <View style={styles.detailWrapper}>
          <Text varient="body2">
            {requester.fullname}
            <Text varient="body2" color="secondary">
              {" "}
              เพิ่มชื่อของคุณเข้าในรายชื่อคนขับของภายใต้บริษัท
              คุณยอมรับคำขอหรือไม่?
            </Text>
          </Text>
        </View>
        <View style={styles.actionsWrapper}>
          <Button
            fullWidth
            title="ปฎิเสธ"
            size="small"
            color="error"
            varient="soft"
            disabled={loading}
            onPress={() => handleDeniedEmployee(requester._id)}
          />
          <Button
            fullWidth
            title="ยอมรับ"
            size="small"
            color="success"
            varient="soft"
            disabled={loading}
            onPress={() => handleApproveEmployee(requester._id)}
          />
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {},
  wrapper: {
    borderRadius: normalize(8),
    backgroundColor: hexToRgba(colors.primary.light, 0.04),
    padding: normalize(16),
  },
  actionsWrapper: {
    paddingTop: normalize(16),
    flexDirection: "row",
    gap: normalize(8),
  },
  detailWrapper: {
    flexDirection: "row",
    gap: normalize(4),
  },
});

export default EmploymentApproval;
