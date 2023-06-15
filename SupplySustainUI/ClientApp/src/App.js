// project import
import { useEffect } from "react";
import Routes from "./routes";
import ThemeCustomization from "./themes";
import ScrollTop from "./components/ScrollTop";
import { useNavigate, useLocation, HashRouter } from "react-router-dom";
import { history } from "./utils/history";
import { PrivateRoute } from "./components/PrivateRoute";
import { formatMessage, loadMessages, locale } from "devextreme/localization";
import * as faMessages from "./locales/fa/fa.json";
import * as enMessages from "devextreme/localization/messages/en.json";
import * as arMessages from "devextreme/localization/messages/ar.json";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const App = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    locale(
      i18n.language === "fa" ? "fa-IR" : i18n.language === "ar" ? "ar" : "en"
    );
    loadMessages(
      i18n.language === "fa"
        ? faMessages
        : i18n.language === "ar"
        ? arMessages
        : enMessages
    );
  }, [i18n.language]);

  history.navigate = useNavigate();
  history.location = useLocation();

  return (
    <ThemeCustomization>
      <ScrollTop>
        {" "}
        <Routes />
      </ScrollTop>
    </ThemeCustomization>
  );
};

export default App;
