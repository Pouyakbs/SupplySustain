import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const AccessLevelToTargetCell = (props) => {
    console.log("props" , props.dataItem[props.field])
  const [currentCell, setCurrentCell] = useState(props.dataItem[props.field]);
  console.log("currentCell" , currentCell)
  const { t, i18n } = useTranslation();

  return (
    (currentCell[0].accessLevelToTarget != "" ? 
    <td colSpan="1">{currentCell[0].accessLevelToTarget}</td>
    : <td colSpan="1">ندارد</td>
    )
  )
};

export default AccessLevelToTargetCell;