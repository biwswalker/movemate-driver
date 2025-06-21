import React, { Fragment, PropsWithChildren, useEffect, useState } from "react";
import {
  ApolloProvider,
  HttpLink,
  ApolloClient,
  InMemoryCache,
  from,
  split,
} from "@apollo/client";
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";
import { setContext } from "@apollo/client/link/context";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { get } from "lodash";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { onError } from "@apollo/client/link/error";
import SplashScreen from "@/components/SplashScreen";
import { ERegistration } from "./generated/graphql";
import { mmkvStorageAdapter } from "@/utils/mmkv-storage";
import { storage } from "@/utils/mmkv-storage";
import { CachePersistor } from "apollo3-cache-persist";

const httpLink = new HttpLink({
  uri: `${process.env.EXPO_PUBLIC_API_URL}/graphql`,
});

const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward, response }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) => {
        console.error(
          `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(locations)}, Path: ${path}`
        );
      });
    }

    if (networkError) {
      console.error(`[Network error]: ${networkError}`);
      // ตรวจสอบหาก networkError เป็นการตัดการเชื่อมต่อ
      if (networkError.message === "WebSocket connection failed") {
        // ลองเชื่อมต่อใหม่
        console.log("Trying to reconnect to WebSocket...");
      }
    }
  }
);

const authLink = setContext(
  async ({ query, operationName }, { headers, ...prev }) => {
    const token = storage.getString("access_token");
    const existingAuthorization = get(headers, "authorization", "");
    return {
      headers: {
        ...headers,
        platform: ERegistration.APP,
        original: "movemate-driver",
        ...(existingAuthorization
          ? { authorization: existingAuthorization }
          : token
            ? { authorization: `Bearer ${token}` }
            : {}),
      },
    };
  }
);

function createWSLink(access_token: string) {
  return new GraphQLWsLink(
    createClient({
      url: process.env.EXPO_PUBLIC_WS_URL,
      connectionParams: {
        ...(access_token ? { authorization: `Bearer ${access_token}` } : {}),
      },
    })
  );
}

// const uploadLink = createUploadLink({ uri: `${API_URL}/graphql` });
const SCHEMA_VERSION = "1";
const SCHEMA_VERSION_KEY = "apollo-schema-version";

export default function ApolloWrapper({ children }: PropsWithChildren) {
  const [client, setClient] = useState<ApolloClient<any> | null>(null);
  const [persistor, setPersistor] = useState<CachePersistor<any>>();

  if (__DEV__) {
    loadDevMessages();
    loadErrorMessages();
  }

  useEffect(() => {
    initialClient();
  }, []);

  async function initialClient() {
    try {
      const cache = new InMemoryCache();
      const newPersistor = new CachePersistor({
        cache,
        storage: mmkvStorageAdapter as any,
        debug: __DEV__,
        trigger: "write",
      });

      const currentVersion = storage.getString(SCHEMA_VERSION_KEY); // 👈 3. ใช้ MMKV โดยตรง
      const isCompatible = currentVersion === SCHEMA_VERSION;

      if (isCompatible) {
        await newPersistor.restore();
      } else {
        await newPersistor.purge();
        storage.set(SCHEMA_VERSION_KEY, SCHEMA_VERSION); // 👈 4. ใช้ MMKV โดยตรง
      }

      setPersistor(newPersistor);

      const token = storage.getString("access_token")
      const wsLink = createWSLink(token || "");
      const splitLink = split(
        ({ query }) => {
          const definition = getMainDefinition(query);
          return (
            definition.kind === "OperationDefinition" &&
            definition.operation === "subscription"
          );
        },
        wsLink,
        httpLink
      );

      const client = new ApolloClient({
        uri: `${process.env.NEXT_PUBLIC_API}/graphql`,
        cache,
        link: from([authLink, splitLink, errorLink]),
      });

      setClient(client);
    } catch (error) {
      console.log("initialClient error ", error);
    }
  }

  if (!client) {
    return <SplashScreen />; // Alternatively, render a loading screen or placeholder
  }

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
