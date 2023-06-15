
// @mui material components
import { createTheme } from "@mui/material/styles";

// Material Dashboard 2 React base styles
import colors from "./theme/base/colors";
import breakpoints from "./theme/base/breakpoints";
import typography from "./theme/base/typography";
import boxShadows from "./theme/base/boxShadows";
import borders from "./theme/base/borders";
import globals from "./theme/base/globals";

// Material Dashboard 2 React helper functions
import boxShadow from "./theme/functions/boxShadow";
import hexToRgb from "./theme/functions/hexToRgb";
import linearGradient from "./functions/linearGradient";
import pxToRem from "./theme/functions/pxToRem";
import rgba from "./theme/functions/rgba";

export default createTheme({
  breakpoints: { ...breakpoints },
  palette: { ...colors },
  typography: { ...typography },
  boxShadows: { ...boxShadows },
  borders: { ...borders },
  functions: {
    boxShadow,
    hexToRgb,
    linearGradient,
    pxToRem,
    rgba,
  },
});
