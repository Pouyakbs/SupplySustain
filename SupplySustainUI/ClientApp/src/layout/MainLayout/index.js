import React, { useEffect, useState } from "react";
import {Link, Outlet} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// material-ui
import { useTheme } from "@mui/material/styles";
import {Box, Toolbar, useMediaQuery} from "@mui/material";

// project import
import Header from "./Header";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";
import Breadcrumbs from "../../components/@extended/Breadcrumbs";

// types
import { useTranslation } from "react-i18next";

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
  const theme = useTheme();
  const appConfig = window.globalConfig;
  const MuiIcons = {
    GroupsOutlinedIcon,
    EmojiEventsOutlinedIcon,
    SupportAgentOutlinedIcon,
    Inventory2OutlinedIcon,
    HandshakeOutlinedIcon,
  };
  const matchDownLG = useMediaQuery(theme.breakpoints.down("xl"));
  const dispatch = useDispatch();
  // drawer toggler
  const [open, setOpen] = useState();
  const [openSideBtns, setOpenSideBtns] = useState("");

  // set media wise responsive drawer
  const { t, i18n } = useTranslation();
  return (
    <>
      
        <Box sx={{ display: "fixed", width: "100%", direction: i18n.dir() }}>
          <Header open={open} />
          <Box
            component="main"
            sx={{ width: "100%", flexGrow: 1, p: { xs: 2, sm: 3 } }}
          >
            <Toolbar />
            <Breadcrumbs
              title
              titleBottom
              card={false}
              divider={false}
            />
            <div className="pageContent">
              <Outlet />
            </div>
          </Box>
        </Box>
     
    </>
  );
};

export default MainLayout;
