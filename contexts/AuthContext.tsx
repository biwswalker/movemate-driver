import {
  EUserRole,
  LoginMutation,
  useLoginMutation,
  useLogoutMutation,
  useMeLazyQuery,
  User,
  useRemoveFcmMutation,
  useStoreFcmMutation,
} from "@/graphql/generated/graphql";
import { usePushNotifications } from "@/hooks/usePushNotification";
import { encryption } from "@/utils/crypto";
import { storage } from "@/utils/mmkv-storage";
import { ApolloClient, ApolloError } from "@apollo/client";
import { router } from "expo-router";
import { get, isEqual } from "lodash";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createApolloClient } from "@graphql/apollo-client";

interface ILogin {
  username: string;
  password: string;
}

interface AuthContextProps {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: User | null;
  parentNames: string[];
  loading: boolean;
  authError: ApolloError | undefined;
  refetchMe: () => void;
  login: (data: ILogin) => Promise<void>;
  logout: () => Promise<void>;
  removeFCM: () => Promise<void>;
  initializeFCM: () => Promise<void>;
  clearAuthError: Function;
  requireAcceptedPolicy: boolean;
  requirePasswordChange: boolean;
  notificationCount: number;
  isFirstLaunch: boolean | undefined;
  isAvailableWork: boolean | undefined; //For business driver (Agent)
  client: ApolloClient<any>;
}

export const AuthContext = createContext<AuthContextProps | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | undefined>(
    undefined
  );
  const { devicePushToken } = usePushNotifications();
  const [notificationCount, setNotificationCount] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [parentNames, setParents] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<ApolloError | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(false);
  const [requireAcceptedPolicy, setRequireAcceptedPolicy] = useState(false);
  const [requirePasswordChange, setRequirePasswordChange] = useState(false);
  const [isAvailableWork, setAvailableWork] = useState(false);
  const [token, setToken] = useState<string | null>(
    () => storage.getString("access_token") || ""
  );

  // CONTACT GRAPHQL
  const client = useMemo(() => createApolloClient(token), [token]);
  const [me, { refetch, data }] = useMeLazyQuery({ client });
  const [storeFCMToken] = useStoreFcmMutation({ client });
  const [removeFCMToken] = useRemoveFcmMutation({ client });
  const [auth] = useLoginMutation({ client });
  const [signout] = useLogoutMutation({ client });

  const refetchMe = () => {
    return refetch();
  };

  const initialize = useCallback(async () => {
    setLoading(true);
    await checkFirstLaunch();
    await me({
      onCompleted: ({
        me: meData,
        requireBeforeSignin,
        unreadCount: { notification = 0 },
        checkAvailableToWork,
        getParentNames: parentNamesData,
      }) => {
        // logout()
        if (meData) {
          setUser(meData as User);
          setParents(parentNamesData || []);
          setAuthenticated(true);
          setAvailableWork(checkAvailableToWork);
        }
        if (requireBeforeSignin) {
          setRequireAcceptedPolicy(requireBeforeSignin.requireAcceptedPolicy);
          setRequirePasswordChange(requireBeforeSignin.requirePasswordChange);
        }
        setNotificationCount(notification);
        setIsInitialized(true);
        setLoading(false);
      },
      onError: () => {
        setUser(null);
        setParents([]);
        setAuthenticated(false);
        setIsInitialized(true);
        setAvailableWork(false);
        setLoading(false);
      },
    });
  }, [me]);

  async function checkFirstLaunch() {
    const hasLaunched = storage.getString("hasLaunched");
    if (hasLaunched === "yes") {
      setIsFirstLaunch(false);
    } else {
      setIsFirstLaunch(true);
      storage.set("hasLaunched", "yes");
    }
  }

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (data) {
      setUser(data.me as User);
      setParents(data.getParentNames || []);
      if (data.requireBeforeSignin) {
        setRequireAcceptedPolicy(
          data.requireBeforeSignin.requireAcceptedPolicy
        );
        setRequirePasswordChange(
          data.requireBeforeSignin.requirePasswordChange
        );
      }
      if (data.unreadCount) {
        setNotificationCount(data.unreadCount.notification);
      }
    }
  }, [data]);

  // LOGIN
  const handleAuthSuccess = async ({ login }: LoginMutation) => {
    if (login) {
      const userRole = get(login, "user.userRole", "");
      if (isEqual(userRole, EUserRole.DRIVER)) {
        await storage.set("access_token", login.token);
        setUser(login.user as User);
        setAuthError(undefined);
        setAuthenticated(true);
        setLoading(false);
        await initializeFCM();
        setRequireAcceptedPolicy(login.requireAcceptedPolicy);
        setRequirePasswordChange(login.requirePasswordChange);
        refetchMe();
        client.reFetchObservableQueries(); // Refetch queries
        router.replace("/");
      } else {
        setLoading(false);
        setAuthError(
          new ApolloError({
            errorMessage: "ไม่สามารถเข้าสู่ระบบ Driver ได้",
          })
        );
      }
    }
  };

  const clearAuthError = () => {
    setAuthError(undefined);
  };

  const getEncryptedFCMToken = async () => {
    const fcmToken = devicePushToken?.data;
    if (fcmToken) {
      const fcmTokenEncryption = encryption(fcmToken);
      return fcmTokenEncryption;
    }
    return null;
  };

  async function initializeFCM() {
    const token = await getEncryptedFCMToken();
    if (token) {
      await storeFCMToken({
        variables: { fcmToken: token },
        onError: (error) => {
          console.log("error", error);
        },
      });
    }
  }

  async function removeFCM() {
    await removeFCMToken();
    await refetchMe();
  }

  const handleAuthError = (error: ApolloError) => {
    console.log(error);
    setLoading(false);
    setAuthError(error);
  };

  const login = async (data: ILogin) => {
    setLoading(true);
    const hashedPassword = encryption(data.password || "");
    auth({
      variables: { username: data.username },
      context: {
        headers: {
          "x-auth-key": hashedPassword,
          "Content-Type": "application/json; charset=utf-8",
        },
      },
      onCompleted: handleAuthSuccess,
      onError: handleAuthError,
    });
  };

  // LOGOUT
  const logout = async () => {
    try {
      await signout();
    } catch (error) {
      console.log("error: ", error);
    } finally {
      await storage.delete("access_token");
      await client.clearStore();
      setUser(null);
      setParents([]);
      setAvailableWork(false);
      setIsInitialized(true);
      setTimeout(() => {
        setAuthenticated(false);
      }, 256);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        client,
        requireAcceptedPolicy,
        requirePasswordChange,
        notificationCount,
        isAuthenticated,
        clearAuthError,
        isInitialized,
        user,
        parentNames,
        loading,
        authError,
        isFirstLaunch,
        isAvailableWork,
        initializeFCM,
        removeFCM,
        refetchMe,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
