"use client";

import {
  GetNotificationMessageGroupSubscription,
  GetNotificationMessageSubscription,
  Notification,
  useGetNotificationMessageGroupSubscription,
  useGetNotificationMessageSubscription,
  useListenNotificationCountSubscription,
} from "@graphql/generated/graphql";
import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { get, isArray } from "lodash";
import { ApolloError, OnDataOptions } from "@apollo/client";
import useAuth from "@/hooks/useAuth";
import { useSnackbarV2 } from "@/hooks/useSnackbar";

interface NotificationContextProps {
  count: number;
}

export const NotificationContext =
  createContext<NotificationContextProps | null>(null);

export function NotificationProvider({ children }: PropsWithChildren) {
  const { isAuthenticated } = useAuth();
  const { showSnackbar, DropdownType } = useSnackbarV2();
  const [count, setStateCount] = useState(0);

  const { restart: restartCount } = useListenNotificationCountSubscription({
    onData: ({ data }) => {
      const count = get(data, "data.listenNotificationCount", 0);
      setStateCount(count);
    },
    onError: handleNotificationMessageError,
    skip: !isAuthenticated,
    fetchPolicy: "network-only",
  });

  const { restart: restartNotification } =
    useGetNotificationMessageSubscription({
      onData: handleNotificationMessage,
      onError: handleNotificationMessageError,
      skip: !isAuthenticated,
      fetchPolicy: "network-only",
    });
  const { restart: restartNotificationGroup } =
    useGetNotificationMessageGroupSubscription({
      onData: handleNotificationMessage,
      onError: handleNotificationMessageError,
      skip: !isAuthenticated,
      fetchPolicy: "network-only",
    });

  function handleNotificationMessage({
    data,
  }: OnDataOptions<
    GetNotificationMessageSubscription | GetNotificationMessageGroupSubscription
  >) {
    const _individualMessage: Notification | undefined = get(
      data,
      "data.listenNotificationMessage",
      undefined
    ) as any | undefined;
    const _groupMessage: Notification | undefined = get(
      data,
      "data.listenNotificationGroupMessage",
      undefined
    ) as any | undefined;
    const _message = _individualMessage || _groupMessage;

    const _varient =
      _message?.varient === "INFO"
        ? DropdownType.Info
        : _message?.varient === "ERROR"
          ? DropdownType.Error
          : _message?.varient === "WRANING"
            ? DropdownType.Warn
            : _message?.varient === "SUCCESS"
              ? DropdownType.Success
              : DropdownType.Info;

    showSnackbar({
      title: _message?.title || "",
      message:
        typeof _message?.message === "string"
          ? _message?.message
          : isArray(_message?.message)
            ? _message?.message.join(", ")
            : "",
      type: _varient,
    });
  }

  function handleNotificationMessageError(error: ApolloError) {
    console.error("handleNotificationMessageError: ", error);
  }

  useEffect(() => {
    if (isAuthenticated) {
      restartCount();
      restartNotification();
      restartNotificationGroup();
    }
  }, [isAuthenticated]);

  return (
    <NotificationContext.Provider value={{ count }}>
      {children}
    </NotificationContext.Provider>
  );
}
