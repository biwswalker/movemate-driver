"use client";

import { PropsWithChildren } from "react";
import { ApolloProvider as Provider } from "@apollo/client";
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";
import useAuth from "@/hooks/useAuth";

export default function ApolloProvider({ children }: PropsWithChildren) {
  const { client } = useAuth(); // ดึง client มาจาก AuthContext

  if (process.env.NODE_ENV === "development") {
    loadDevMessages();
    loadErrorMessages();
  }

  // ใช้ client ที่ได้รับมา
  return <Provider client={client}>{children}</Provider>;
}
