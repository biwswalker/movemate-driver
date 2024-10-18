import {
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
import { ApolloError } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { get, isEqual } from "lodash";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react";

interface ILogin {
  username: string;
  password: string;
}

interface AuthContextProps {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: User | null;
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
}

export const AuthContext = createContext<AuthContextProps | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | undefined>(
    undefined
  );
  const { devicePushToken } = usePushNotifications();
  const [notificationCount, setNotificationCount] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<ApolloError | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(false);
  const [requireAcceptedPolicy, setRequireAcceptedPolicy] = useState(false);
  const [requirePasswordChange, setRequirePasswordChange] = useState(false);

  // CONTACT GRAPHQL
  const [me, { refetch, data }] = useMeLazyQuery();
  const [storeFCMToken] = useStoreFcmMutation();
  const [removeFCMToken] = useRemoveFcmMutation();
  const [auth] = useLoginMutation();

  const refetchMe = () => {
    return refetch();
  };

  const [signout] = useLogoutMutation();

  const initialize = useCallback(async () => {
    setLoading(true);
    await checkFirstLaunch();
    await me({
      onCompleted: ({
        me: meData,
        requireBeforeSignin,
        unreadCount: { notification = 0 },
      }) => {
        if (meData) {
          setUser(meData as User);
          setAuthenticated(true);
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
        setAuthenticated(false);
        setIsInitialized(true);
        setLoading(false);
      },
    });
  }, [me]);

  async function checkFirstLaunch() {
    const hasLaunched = await AsyncStorage.getItem("hasLaunched");
    if (hasLaunched === "yes") {
      setIsFirstLaunch(false);
    } else {
      setIsFirstLaunch(true);
      await AsyncStorage.setItem("hasLaunched", "yes");
    }
  }

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (data) {
      setUser(data.me as User);
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
      if (isEqual(userRole, "driver")) {
        await AsyncStorage.setItem("access_token", login.token);
        setUser(login.user as User);
        setAuthError(undefined);
        setAuthenticated(true);
        setLoading(false);
        await initializeFCM();
        setRequireAcceptedPolicy(login.requireAcceptedPolicy);
        setRequirePasswordChange(login.requirePasswordChange);
        refetchMe();
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
          console.log("----error---", error);
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
        headers: { authorization: `Bearer ${hashedPassword}` },
      },
      onCompleted: handleAuthSuccess,
      onError: handleAuthError,
    });
  };

  // LOGOUT
  const logout = async () => {
    await signout();
    setUser(null);
    setAuthenticated(false);
    setIsInitialized(true);
    await AsyncStorage.removeItem("access_token");
  };

  return (
    <AuthContext.Provider
      value={{
        requireAcceptedPolicy,
        requirePasswordChange,
        notificationCount,
        isAuthenticated,
        clearAuthError,
        isInitialized,
        user,
        loading,
        authError,
        isFirstLaunch,
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
