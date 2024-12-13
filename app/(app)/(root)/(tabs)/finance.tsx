import React, { Fragment, useEffect, useMemo } from "react";
import {
  FlatList,
  ListRenderItemInfo,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Text from "@components/Text";
import { normalize } from "@utils/normalizeSize";
import Iconify from "@components/Iconify";
import hexToRgba from "hex-to-rgba";
import AccountHeader from "@components/AccountHeader";
import { fNumber } from "@utils/number";
import { format } from "date-fns";
import { th } from "date-fns/locale/th";
import {
  DriverTransactionSummaryPayload,
  ERefType,
  ETransactionOwner,
  ETransactionStatus,
  EUserStatus,
  Transaction,
  useGetTransactionQuery,
} from "@graphql/generated/graphql";
import colors from "@constants/colors";
import useAuth from "@/hooks/useAuth";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useIsFocused } from "@react-navigation/native";

export default function Financial() {
  const isFocused = useIsFocused();
  const { user } = useAuth();
  const { data, refetch } = useGetTransactionQuery({
    variables: {
      limit: 10,
      sortField: "createdAt",
      sortAscending: false,
    },
    onError: (error) => {
      console.log("error: ", error);
    },
  });

  const transactions = useMemo(
    () => data?.getTransaction || [],
    [data?.getTransaction]
  );

  const transactionSummarize = useMemo<
    DriverTransactionSummaryPayload | undefined
  >(() => data?.calculateTransaction, [data?.calculateTransaction]);

  useEffect(() => {
    if (isFocused) {
      refetch();
    }
  }, [isFocused]);

  console.log("data: ", data);

  function handleOnPressFinancial() {
    router.push("/profile-detail");
  }

  function handleOnViewTransaction() {
    router.push("/finance-list");
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.wrapper}>
        <AccountHeader style={styles.accountContainer} />
        <View style={styles.contentWrapper}>
          {user?.status === EUserStatus.PENDING && <PendingApproval />}
          {user?.status === EUserStatus.DENIED && <DeniedApproval />}
        </View>
        <View style={styles.content}>
          {transactionSummarize && (
            <View style={styles.summaryContainer}>
              <View style={styles.totalWrapper}>
                <View
                  style={[
                    styles.innerBoxWrapper,
                    {
                      backgroundColor: hexToRgba(colors.primary.main, 0.08),
                      paddingVertical: normalize(12),
                    },
                  ]}
                >
                  <Iconify icon="ion:cash" color={colors.primary.dark} />
                  <Text
                    varient="body2"
                    style={{ color: colors.primary.dark, marginTop: 4 }}
                  >
                    รายได้เดือนนี้
                  </Text>
                  <Text varient="h5" style={{ color: colors.primary.dark }}>
                    {fNumber(transactionSummarize.monthly.amount || 0, "0,0.0")}{" "}
                  </Text>
                </View>
              </View>
              <View style={styles.totalWrapper}>
                <View
                  style={[
                    styles.innerBoxWrapper,
                    { backgroundColor: hexToRgba(colors.info.main, 0.08) },
                  ]}
                >
                  <Text
                    varient="body2"
                    style={{ color: colors.info.dark, marginTop: 4 }}
                  >
                    รอรับเงิน
                  </Text>
                  <Text varient="h5" style={{ color: colors.info.dark }}>
                    {fNumber(transactionSummarize.pending.amount || 0, "0,0.0")}{" "}
                  </Text>
                </View>
                <View style={[styles.innerBoxWrapper]}>
                  <Text
                    varient="body2"
                    style={{ color: colors.success.dark, marginTop: 4 }}
                  >
                    ได้รับเงินแล้ว
                  </Text>
                  <Text varient="h5" style={{ color: colors.success.dark }}>
                    {fNumber(transactionSummarize.paid.amount || 0, "0,0.0")}{" "}
                  </Text>
                </View>
              </View>
            </View>
          )}

          <View style={styles.actionWrapper}>
            <TouchableOpacity
              style={styles.buttonWrapper}
              onPress={handleOnPressFinancial}
            >
              <Iconify
                icon="uil:setting"
                color={colors.text.primary}
                size={normalize(16)}
              />
              <Text varient="subtitle1">ตั้งค่าบัญชี</Text>
            </TouchableOpacity>
          </View>
          {user?.status !== EUserStatus.DENIED && (
            <Fragment>
              <View style={styles.transactionWrapper}>
                <View style={styles.transactionTitleWrapper}>
                  <Text
                    varient="subtitle1"
                    style={{ color: colors.primary.dark }}
                  >
                    รายกาารเงินล่าสุด
                  </Text>
                  <TouchableOpacity onPress={handleOnViewTransaction}>
                    <Text varient="body2" color="secondary">
                      ดูทั้งหมด
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <FlatList
                data={transactions}
                renderItem={FinancialItem}
                keyExtractor={(item) => item._id}
                scrollEnabled
                ListEmptyComponent={
                  <View style={styles.emptyTransaction}>
                    <Text
                      varient="body1"
                      color="secondary"
                      style={{ textAlign: "center" }}
                    >
                      ไม่พบรายการการเงิน
                    </Text>
                  </View>
                }
                contentContainerStyle={{
                  paddingBottom: normalize(72),
                  paddingTop: normalize(8),
                  paddingHorizontal: normalize(15),
                }}
              />
            </Fragment>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

function PendingApproval() {
  return (
    <View style={styles.infoTextContainer}>
      <View style={styles.infoTextWrapper}>
        <Iconify
          icon="iconoir:warning-circle-solid"
          size={normalize(18)}
          color={colors.warning.dark}
          style={styles.iconWrapper}
        />
        <Text varient="body2" color="secondary" style={styles.infoText}>
          {`บัญชีของคุณรอการตรวจสอบจากผู้ดูแล`}
        </Text>
      </View>
    </View>
  );
}

function DeniedApproval() {
  return (
    <View style={styles.infoTextContainer}>
      <View
        style={[
          styles.infoTextWrapper,
          { backgroundColor: hexToRgba(colors.error.main, 0.12) },
        ]}
      >
        <Iconify
          icon="iconoir:warning-circle-solid"
          size={normalize(18)}
          color={colors.error.dark}
          style={styles.iconWrapper}
        />
        <Text varient="body2" color="secondary" style={styles.errorText}>
          {`บัญชีของคุณไม่ผ่านการอนุมัติจากผู้ดูแล`}
        </Text>
      </View>
    </View>
  );
}

const finStyle = StyleSheet.create({
  container: {
    marginVertical: normalize(4),
    paddingVertical: normalize(8),
    padding: normalize(12),
    borderRadius: normalize(8),
    borderColor: colors.divider,
    borderWidth: normalize(1.5),
  },
  trackingNumberWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
});

function FinancialItem({ item }: ListRenderItemInfo<Transaction>) {
  function handleViewTransaction() {
    router.push({
      pathname: "/finance-detail",
      params: { transactionId: item._id },
    });
  }
  const isAgentDriverShipment =
    item.ownerType === ETransactionOwner.BUSINESS_DRIVER;
  const isEarned = item.refType === ERefType.EARNING;

  const isPending = item.status === ETransactionStatus.PENDING;

  return (
    <Pressable style={finStyle.container} onPress={handleViewTransaction}>
      <View style={finStyle.trackingNumberWrapper}>
        <Text varient="body2">{item.description}</Text>
      </View>
      <View style={[finStyle.trackingNumberWrapper, { alignItems: "center" }]}>
        <Text varient="caption" color="secondary">
          {format(item.createdAt, "EEEE dd MMM yyyy HH:mm", { locale: th })}
        </Text>
        <Text
          varient={isAgentDriverShipment ? "body1" : "h5"}
          style={{
            textAlign: "left",
            flexShrink: 0,
            color: isAgentDriverShipment
              ? colors.text.secondary
              : isEarned
                ? colors.success.dark
                : isPending
                  ? colors.warning.dark
                  : colors.primary.main,
          }}
        >
          {isAgentDriverShipment ? "-" : fNumber(item.amount, "0,0.0")}
        </Text>
      </View>
    </Pressable>
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
  accountContainer: {
    paddingHorizontal: normalize(16),
    paddingBottom: normalize(8),
  },
  contentWrapper: {
    paddingTop: normalize(24),
    // alignItems: "center",
  },
  textCenter: {
    textAlign: "center",
  },
  infoTextContainer: {
    marginBottom: normalize(24),
    paddingHorizontal: normalize(24),
  },
  infoTextWrapper: {
    backgroundColor: hexToRgba(colors.warning.main, 0.08),
    padding: normalize(16),
    borderRadius: normalize(8),
    gap: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrapper: {
    minWidth: normalize(32),
  },
  infoText: {
    color: colors.warning.dark,
  },
  errorText: {
    color: colors.error.dark,
  },
  content: {
    flex: 1,
  },
  summaryContainer: {
    gap: normalize(8),
  },
  totalWrapper: {
    marginHorizontal: normalize(16),
    borderRadius: normalize(8),
    flexDirection: "row",
    gap: 8,
  },
  innerBoxWrapper: {
    flex: 1,
    borderRadius: normalize(16),
    backgroundColor: hexToRgba(colors.success.main, 0.08),
    alignItems: "center",
    paddingHorizontal: normalize(8),
    paddingVertical: normalize(8),
  },
  actionWrapper: {
    marginTop: normalize(8),
    marginHorizontal: normalize(16),
    padding: normalize(8),
    borderRadius: normalize(8),
    backgroundColor: colors.grey[100],
    flexDirection: "row",
    gap: normalize(8),
  },
  buttonWrapper: {
    flex: 1,
    backgroundColor: colors.common.white,
    borderRadius: normalize(8),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: normalize(8),
    gap: normalize(8),
  },
  transactionWrapper: {
    paddingTop: normalize(16),
    paddingBottom: normalize(8),
    paddingHorizontal: normalize(16),
  },
  transactionTitleWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  emptyTransaction: {
    paddingTop: normalize(32),
    alignItems: "center",
  },
});
