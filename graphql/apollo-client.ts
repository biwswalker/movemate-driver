import {
  ApolloClient,
  InMemoryCache,
  from,
  split,
  ApolloLink,
  HttpLink,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { Client, createClient } from "graphql-ws";
import { onError } from "@apollo/client/link/error";
import { ERegistration } from "./generated/graphql";
import { storage } from "@/utils/mmkv-storage";

function stripTypename<T>(value: T): T {
  // ตรวจสอบว่าเป็น Array หรือไม่
  if (Array.isArray(value)) {
    // ถ้าเป็น Array, วนลูปและเรียกตัวเองแบบ Recursive
    return value.map(stripTypename) as T;
  }

  // ตรวจสอบว่าเป็น Object หรือไม่ (และไม่ใช่ null)
  if (value !== null && typeof value === "object") {
    // สร้าง Object ใหม่เพื่อเก็บข้อมูลที่ไม่มี __typename
    const newObject = {} as T;

    // วนลูป key ทั้งหมดใน Object
    for (const key in value) {
      // ตรวจสอบว่า key ไม่ใช่ '__typename'
      if (key !== "__typename") {
        // ทำ Recursive call กับค่าของ key นั้นๆ และเก็บลงใน newObject
        newObject[key] = stripTypename(value[key]);
      }
    }
    return newObject;
  }
  // หากไม่ใช่ทั้ง Array และ Object, ให้คืนค่าเดิมกลับไป
  return value;
}

export const cleanTypenameLink = new ApolloLink((operation, forward) => {
  if (operation.variables) {
    operation.variables = stripTypename(operation.variables);
  }
  return forward(operation);
});

let wsClient: Client | null = null;

export function createApolloClient(token: string | null) {
  if (wsClient) {
    wsClient.dispose();
  }

  wsClient = createClient({
    url: process.env.EXPO_PUBLIC_WS_URL as string,
    connectionParams: () => {
      // ใช้ token ล่าสุดจาก localStorage เสมอ
      const currentToken = storage.getString("access_token");
      return currentToken ? { authorization: `Bearer ${currentToken}` } : {};
    },
  });

  const wsLink = new GraphQLWsLink(wsClient);
  const httpLink = createHttpLink({
    uri: `${process.env.EXPO_PUBLIC_API_URL}/graphql`,
    headers: {
      platform: ERegistration.APP,
      original: "movemate-driver",
      "Content-Type": "application/json; charset=utf-8",
    },
  });

  const authLink = setContext((_, { headers }) => {
    // ดึง token ล่าสุดมาใช้ทุกครั้งที่มี request
    const currentToken = storage.getString("access_token") || token;
    return {
      headers: {
        ...headers,
        ...(currentToken ? { authorization: `Bearer ${currentToken}` } : {}),
      },
    };
  });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.forEach(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(locations)}, Path: ${path}`
        )
      );
    if (networkError) console.log(`[Network error]: ${networkError}`);
  });

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    wsLink,
    authLink.concat(httpLink)
  );

  return new ApolloClient({
    link: from([errorLink, cleanTypenameLink, splitLink]),
    cache: new InMemoryCache({ addTypename: true }),
  });
}
