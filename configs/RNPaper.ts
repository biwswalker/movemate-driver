import { getFontVarient } from "@/components/Text";
import colors from "@constants/colors";
import { configureFonts, MD3LightTheme } from "react-native-paper";
import { MD3Type } from "react-native-paper/lib/typescript/types";

const { fontFamily, lineHeight, fontSize } = getFontVarient();
const fontConfig: Partial<MD3Type> = {
  fontFamily,
  lineHeight,
  fontSize,
};

const theme = {
  ...MD3LightTheme,
  fonts: configureFonts({ config: fontConfig, isV3: true }),
  colors: {
    primary: colors.primary.main,
  },
};

export default theme;
