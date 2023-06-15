import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { parsFloatFunction } from "../../utils/parsFloatFunction";

const MoneyCell = (props) => {
  const [currentCell, setCurrentCell] = useState();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    setCurrentCell(props.dataItem[props.field].toLocaleString());
  }, [props.dataItem[props.field]]);

  return i18n.language == "fa" ? (
    <td colSpan="1">{currentCell} تومان</td>
  ) : i18n.language == "en" ? (
    <td colSpan="1">{currentCell} $</td>
  ) : (
    <td colSpan="1">{currentCell} $</td>
  );
};

export default MoneyCell;