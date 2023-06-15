import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const PercentageCell = (props) => {
  const [currentCell, setCurrentCell] = useState();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    setCurrentCell(props.dataItem[props.field]);
  }, [props.dataItem[props.field]]);

  return currentCell > 0 ? (
    <td colSpan="1">{currentCell}%</td>
  ) : (
    <td colSpan="1">ندارد</td>
  );
};

export default PercentageCell;
