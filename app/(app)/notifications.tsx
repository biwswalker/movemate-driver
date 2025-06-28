import Button from "@/components/Button";
import Iconify from "@/components/Iconify";
import NavigationBar from "@/components/NavigationBar";
import Text from "@/components/Text";
import {
  Notification,
  useNotificationsQuery,
} from "@/graphql/generated/graphql";
import useAuth from "@/hooks/useAuth";
import { fToNow } from "@/utils/formatTime";
import { normalize } from "@/utils/normalizeSize";
import colors from "@constants/colors";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import { router } from "expo-router";
import { isEmpty, map } from "lodash";
import { Fragment, useMemo, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { RefreshControl } from "react-native-gesture-handler";
import { ActivityIndicator } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Notifications() {
  const [hasMore, setHasMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { refetchMe } = useAuth()
  const { data, loading, fetchMore, refetch } = useNotificationsQuery({
    variables: { limit: 10, skip: 0 },
    notifyOnNetworkStatusChange: true,
    onCompleted: () => {
      refetchMe()
    },
  });

  const totalRecord = useMemo<number>(
    () => data?.totalNotification ?? 0,
    [data]
  );
  const notifications = useMemo<Notification[]>(
    () => (data?.notifications || []) as Notification[],
    [data]
  );

  async function handleOnRefresh() {
    try {
      // Refresh
      // setRefreshing(true);
      await refetch();
      refetchMe()
    } catch (error) {
      console.log("error: ", JSON.stringify(error, undefined, 2));
    } finally {
      // setRefreshing(false);
    }
  }

  function handleOnClose() {
    if (router.canDismiss()) {
      router.dismiss();
    }
  }

  function loadMoreTransaction() {
    fetchMore({
      variables: { skip: notifications.length },
      updateQuery: (prevResult, { fetchMoreResult }) => {
        if (!fetchMoreResult || fetchMoreResult.notifications.length === 0) {
          setHasMore(false);
          return prevResult;
        } else {
          setHasMore(true);
        }
        return {
          ...prevResult,
          ...fetchMoreResult,
          notifications: [
            ...prevResult.notifications,
            ...fetchMoreResult.notifications,
          ],
        };
      },
    });
  }

  function _FooterAction() {
    if (loading) {
      return (
        <View style={styles.footerWrapper}>
          <ActivityIndicator size="small" color={colors.text.secondary} />
        </View>
      );
    }
    if (isEmpty(notifications)) {
      return (
        <View style={styles.footerWrapper}>
          <Iconify
            icon="solar:document-text-bold-duotone"
            color={colors.text.secondary}
            size={normalize(32)}
          />
          <Text
            varient="subtitle1"
            style={[{ color: colors.primary.darker, textAlign: "center" }]}
          >
            ไม่พบรายการการแจ้งเตือน
          </Text>
          <Text
            style={[{ paddingTop: 4, textAlign: "center" }]}
            varient="caption"
            color="secondary"
          >{`ไม่มีการแจ้งเตือนใหม่ที่แสดงในขณะนี้\nโปรดตรวจสอบอีกครั้ง`}</Text>
        </View>
      );
    } else if (!loading && notifications.length < totalRecord) {
      return (
        <View style={styles.footerWrapper}>
          <Button
            title="เพิ่มเติม"
            size="medium"
            varient="soft"
            color="inherit"
            onPress={loadMoreTransaction}
          />
        </View>
      );
    } else {
      return <Fragment />;
    }
  }

  function _NotificationItem({ item }: ListRenderItemInfo<Notification>) {
    return (
      <View
        style={[
          styles.notificationImageContainer,
          // !item.read
          //   ? {
          //       backgroundColor: colors.action.hover,
          //     }
          //   : {},
        ]}
      >
        <View style={styles.notificationImageWrapper}>
          <Image
            source={require("@assets/images/adaptive-icon.png")}
            style={styles.notificationImage}
          />
        </View>
        <View style={styles.notificationWrapper}>
          <View style={styles.notificationTexts}>
            {map(item.message, (message, index) => (
              <Text varient="body1" key={`${index}-${message}`}>{message}</Text>
            ))}
          </View>
          <Text varient="caption" color="secondary">
            {fToNow(item.createdAt)}
          </Text>
          {/* <View style={styles.itemActions}></View> */}
        </View>
        {/* {!item.read && <View style={styles.badge} />} */}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.wrapper}>
        <NavigationBar onBack={handleOnClose} title="การแจ้งแตือน" />
        <FlashList
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={handleOnRefresh} />
          }
          data={notifications}
          renderItem={_NotificationItem}
          keyExtractor={(item, indx) => `${indx}-${item._id}`}
          scrollEnabled
          contentContainerStyle={styles.listContainer}
          estimatedItemSize={normalize(104)}
          ListFooterComponent={_FooterAction}
        />
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
  footerWrapper: {
    alignItems: "center",
    paddingTop: normalize(8),
    paddingBottom: normalize(24),
    paddingHorizontal: normalize(24),
  },
  listContainer: {
    // paddingHorizontal: normalize(16),
  },
  notificationImageContainer: {
    gap: normalize(8),
    flexDirection: "row",
    padding: normalize(16),
    // borderRadius: normalize(8),
    backgroundColor: colors.background.default,
    position: "relative",
  },
  notificationImageWrapper: {
    width: normalize(44),
    height: normalize(44),
    borderRadius: normalize(22),
    backgroundColor: colors.action.hover,
    // backgroundColor: colors.common.white,
    overflow: "hidden",
  },
  notificationImage: {
    width: normalize(44),
    height: normalize(44),
    resizeMode: "contain",
  },
  notificationWrapper: {
    flex: 1,
    gap: normalize(4),
  },
  notificationTexts: {
    gap: 0,
  },
  itemActions: {
    flexDirection: "row",
    gap: normalize(4),
    justifyContent: "flex-start",
  },
  badge: {
    width: normalize(10),
    height: normalize(10),
    borderRadius: normalize(5),
    backgroundColor: colors.error.main,
    position: "absolute",
    top: normalize(12),
    right: normalize(12),
  },
});
