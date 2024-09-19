import React, { PropsWithChildren } from "react";
import {
  ApolloProvider,
  HttpLink,
  ApolloClient,
  InMemoryCache,
  from,
} from "@apollo/client";
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setContext } from "@apollo/client/link/context";
import { get } from "lodash";

const httpLink = new HttpLink({
  uri: `${process.env.EXPO_PUBLIC_API_URL}/graphql`,
});

const authLink = setContext(async (_, { headers }) => {
  const token = await AsyncStorage.getItem("access_token");
  const existingAuthorization = get(headers, "authorization", "");
  return {
    headers: {
      ...headers,
      platform: "app",
      ...(existingAuthorization
        ? { authorization: existingAuthorization }
        : token
          ? { authorization: `Bearer ${token}` }
          : {}),
    },
  };
});

// const uploadLink = createUploadLink({ uri: `${API_URL}/graphql` });

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: from([authLink, httpLink]),
});

export default function ApolloWrapper({ children }: PropsWithChildren) {
  if (__DEV__) {
    loadDevMessages();
    loadErrorMessages();
  }
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
