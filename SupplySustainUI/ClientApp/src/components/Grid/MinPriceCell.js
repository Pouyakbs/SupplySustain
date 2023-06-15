import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const MinPriceCell = (props) => {
    console.log("props" , props.dataItem[props.field])
  const [currentCell, setCurrentCell] = useState(props.dataItem[props.field]);
  console.log("currentCell" , currentCell)
  const { t, i18n } = useTranslation();

  return (
    (currentCell[0].minPrice != "" && i18n.language == "fa" ? 
    <td colSpan="1">{parseInt(currentCell[0].minPrice).toLocaleString()} تومان</td>
    : currentCell[0].minPrice != "" && i18n.language == "en" ? <td colSpan="1">{parseInt(currentCell[0].minPrice).toLocaleString()} $</td>
    : <td colSpan="1">ندارد</td>
    )
  )
};

export default MinPriceCell;