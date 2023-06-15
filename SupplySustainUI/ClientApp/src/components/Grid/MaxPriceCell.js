import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const MaxPriceCell = (props) => {
    console.log("props" , props.dataItem[props.field])
  const [currentCell, setCurrentCell] = useState(props.dataItem[props.field]);
  console.log("currentCell" , currentCell)
  const { t, i18n } = useTranslation();

  return (
    (currentCell[0].maxPrice != "" && i18n.language == "fa" ? 
    <td colSpan="1">{parseInt(currentCell[0].maxPrice).toLocaleString()} تومان</td>
    : currentCell[0].maxPrice != "" && i18n.language == "en" ? <td colSpan="1">{parseInt(currentCell[0].maxPrice).toLocaleString()} $</td>
    : <td colSpan="1">ندارد</td>
    )
  )
};

export default MaxPriceCell;