import { getFontVarient } from "@/components/Text";
import colors from "@constants/colors";
import React, {
  createContext,
  Fragment,
  PropsWithChildren,
  useCallback,
  useRef,
  useState,
} from "react";
import { ImageSourcePropType, Platform } from "react-native";
import DropdownAlert, {
  DropdownAlertData,
  DropdownAlertType,
  DropdownAlertColor,
  DropdownAlertPosition,
} from "react-native-dropdownalert";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FullWindowOverlay } from "react-native-screens";

interface SnackbarProps {
  type?: DropdownAlertType;
  title: string;
  message: string;
  source?: ImageSourcePropType;
  interval?: number;
  color?: DropdownAlertColor;
  alertPosition?: DropdownAlertPosition;
}

interface SnackbarContextProps {
  showSnackbar: (options: SnackbarProps) => void;
  DropdownType: typeof DropdownAlertType;
  Position: typeof DropdownAlertPosition;
}

export const SnackbarV2Context = createContext<SnackbarContextProps | null>(
  null
);

export function SnackbarV2Provider({ children }: PropsWithChildren) {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<SnackbarProps>();
  const [processing, setProcessing] = useState(false);
  let alert = useRef(
    (_data?: DropdownAlertData) => new Promise<DropdownAlertData>((res) => res)
  );
  let dismiss = useRef(() => {});

  const showSnackbar = useCallback(
    async({
      type = DropdownAlertType.Info,
      interval = 5000,
      color = DropdownAlertColor.Default,
      ...item
    }: SnackbarProps) => {
      if (processing) return;
      setSelected({
        ...item,
        type,
        interval,
        color,
      });
      setProcessing(true);
      setTimeout(async () => {
        await alert.current({
          ...item,
          interval,
          type,
        });
        setProcessing(false);
      }, 126);
    },
    []
  );

  const OverlayComponent = Platform.OS === "ios" ? FullWindowOverlay : Fragment;

  return (
    <SnackbarV2Context.Provider
      value={{
        showSnackbar,
        DropdownType: DropdownAlertType,
        Position: DropdownAlertPosition,
      }}
    >
      {children}
      {processing && (
        <OverlayComponent>
          <DropdownAlert
            onDismissPressDisabled
            updateStatusBar={Platform.OS === "ios"}
            safeViewStyle={
              Platform.OS === "android"
                ? { paddingTop: insets.top, flexDirection: "row" }
                : undefined
            }
            titleTextStyle={{
              ...getFontVarient("overline"),
              color: colors.common.white,
            }}
            messageTextStyle={{
              ...getFontVarient("caption"),
              color: colors.common.white,
            }}
            alert={(func) => (alert.current = func)}
            dismiss={(func) => (dismiss.current = func)}
            {...selected}
          />
        </OverlayComponent>
      )}
    </SnackbarV2Context.Provider>
  );
}
