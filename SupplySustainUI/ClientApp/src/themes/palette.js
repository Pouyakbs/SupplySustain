// material-ui
import { createTheme } from "@mui/material/styles";

// third-party
import { presetPalettes } from "@ant-design/colors";

// project import
import ThemeOption from "./theme";

// ==============================|| DEFAULT THEME - PALETTE  ||============================== //

const Palette = (mode) => {
  const colors = presetPalettes;

  const greyPrimary = [
    "#ffffff",
    "#fafafa",
    "#f5f5f5",
    "#f0f0f0",
    "#d9d9d9",
    "#bfbfbf",
    "#8c8c8c",
    "#595959",
    "#262626",
    "#141414",
    "#000000",
  ];
  const greyAscent = ["#fafafa", "#bfbfbf", "#434343", "#1f1f1f"];
  const greyConstant = ["#fafafb", "#e6ebf1"];

  colors.grey = [...greyPrimary, ...greyAscent, ...greyConstant];

  const paletteColor = ThemeOption(colors);

  return createTheme({
    palette: {
      mode,
      ...(mode === "light"
        ? {
            common: {
              black: "#000",
              white: "#fff",
            },
            ...paletteColor,
            text: {
              main: paletteColor.grey[700],
              focus: paletteColor.grey[500],
              primary: paletteColor.grey[700],
              secondary: paletteColor.grey[500],
              disabled: paletteColor.grey[400],
            },
            transparent: {
              main: "transparent",
            },
          
            white: {
              main: "#ffffff",
              focus: "#ffffff",
            },
          
            black: {
              light: "#000000",
              main: "#000000",
              focus: "#000000",
            },
          
          
            info: {
              main: "#1A73E8",
              focus: "#1662C4",
            },
            badgeColors: {
              primary: {
                background: "#f8b3ca",
                text: "#cc084b",
              },

              secondary: {
                background: "#d7d9e1",
                text: "#6c757d",
              },

              info: {
                background: "#aecef7",
                text: "#095bc6",
              },

              success: {
                background: "#bce2be",
                text: "#339537",
              },

              warning: {
                background: "#ffd59f",
                text: "#c87000",
              },

              error: {
                background: "#fcd3d0",
                text: "#f61200",
              },

              light: {
                background: "#ffffff",
                text: "#c7d3de",
              },

              dark: {
                background: "#8097bf",
                text: "#1e2e4a",
              },
            },
            socialMediaColors: {
              facebook: {
                main: "#3b5998",
                dark: "#344e86",
              },

              twitter: {
                main: "#55acee",
                dark: "#3ea1ec",
              },

              instagram: {
                main: "#125688",
                dark: "#0e456d",
              },

              whatsapp: {
                main: "#25d366",
                dark: "#075e54",
              },

              skype: {
                main: "#00aff0",
                dark: "#0078d7",
              },

              telegram: {
                main: "#0088cc",
                dark: "#0088cc",
              },

              linkedin: {
                main: "#0077b5",
                dark: "#00669c",
              },

              pinterest: {
                main: "#cc2127",
                dark: "#b21d22",
              },

              youtube: {
                main: "#e52d27",
                dark: "#d41f1a",
              },

              vimeo: {
                main: "#1ab7ea",
                dark: "#13a3d2",
              },

              slack: {
                main: "#3aaf85",
                dark: "#329874",
              },

              dribbble: {
                main: "#ea4c89",
                dark: "#e73177",
              },

              github: {
                main: "#24292e",
                dark: "#171a1d",
              },

              reddit: {
                main: "#ff4500",
                dark: "#e03d00",
              },

              tumblr: {
                main: "#35465c",
                dark: "#2a3749",
              },
              website: {
                main: "#18acb6",
                dark: "#18acb6",
              },
              email: {
                main: "#0a628e",
                dark: "#0a628e",
              },
            },
            gradients: {
              primary: {
                main: "#EC407A",
                state: "#D81B60",
              },

              secondary: {
                main: "#747b8a",
                state: "#495361",
              },

              info: {
                main: "#49a3f1",
                state: "#1A73E8",
              },

              success: {
                main: "#66BB6A",
                state: "#43A047",
              },

              warning: {
                main: "#FFA726",
                state: "#FB8C00",
              },

              error: {
                main: "#EF5350",
                state: "#E53935",
              },

              light: {
                main: "#EBEFF4",
                state: "#CED4DA",
              },

              dark: {
                main: "#42424a",
                state: "#191919",
              },
            },

            inputBorderColor: "#d2d6da",

            tabs: {
              indicator: { boxShadow: "#ddd" },
            },
            coloredShadows: {
              primary: "#e91e62",
              secondary: "#110e0e",
              info: "#00bbd4",
              success: "#4caf4f",
              warning: "#ff9900",
              error: "#f44336",
              light: "#adb5bd",
              dark: "#404040",
            },
            action: {
              disabled: paletteColor.grey[300],
            },
            divider: paletteColor.grey[200],
            background: {
              paper: paletteColor.grey[0],
              default: paletteColor.grey.A50,
            },
          }
        : mode === "dark" && {
            common: {
              black: "#000",
              white: "#fff",
            },
            ...paletteColor,
            text: {
              primary: "#fff",
              secondary: "rgba(255, 255, 255, 0.7)",
              disabled: "rgba(255, 255, 255, 0.5)",
            },
            action: {
              disabled: "rgba(255, 255, 255, 0.12)",
            },
            divider: paletteColor.grey[400],
            background: {
              paper: "#282626",
              default: "#121212",
            },
          }),
    },
  });
};

export default Palette;
