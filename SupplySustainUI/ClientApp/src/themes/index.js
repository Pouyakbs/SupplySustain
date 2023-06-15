import PropTypes from "prop-types";
import { useMemo } from "react";
import * as React from "react";
// material-ui
import { CssBaseline, StyledEngineProvider } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import boxShadows from "../assets/base/boxShadows";
import borders from "../assets/base/borders";
import boxShadow from "../assets/functions/boxShadow";
import hexToRgb from "../assets/functions/hexToRgb";
import linearGradient from "../assets/functions/linearGradient";
import pxToRem from "../assets/functions/pxToRem";
import rgba from "../assets/functions/rgba";

// project import
import Palette from "./palette";
import Typography from "./typography";
import CustomShadows from "./shadows";
import componentsOverride from "./overrides";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
// ==============================|| DEFAULT THEME - MAIN  ||============================== //

const ThemeCustomization = ({ children }) => {
  const theme = Palette("light", "default");
  const { t, i18n } = useTranslation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const themeTypography = Typography(i18n.language === "en" ? "Sans-serif" : "IRANSansWeb");
  const themeCustomShadows = useMemo(() => CustomShadows(theme), [theme]);
  const themeOptions = useMemo(
    () => ({
      boxShadows: { ...boxShadows },
      borders: { ...borders },
      functions: {
        boxShadow,
        hexToRgb,
        linearGradient,
        pxToRem,
        rgba,
      },
        breakpoints: {
          values: {
            xs: 0,
            sm: 768,
            md: 1024,
            lg: 1266,
            xl: 1536,
          },
        },
        mixins: {
          toolbar: {
            minHeight: 60,
            paddingTop: 8,
            paddingBottom: 8,
          },
        },
        palette: theme.palette,
        customShadows: themeCustomShadows,
        typography: themeTypography,
      }),
    [theme, themeTypography , themeCustomShadows]
  );

  const themes = createTheme(themeOptions);
  themes.components = componentsOverride(themes);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes} >
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

ThemeCustomization.propTypes = {
  children: PropTypes.node,
};

export default ThemeCustomization;
