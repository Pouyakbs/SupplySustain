import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const ProductNameCell = (props) => {
    console.log("props" , props.dataItem[props.field])
  const [currentCell, setCurrentCell] = useState(props.dataItem[props.field]);
  console.log("currentCell" , currentCell)
  const { t, i18n } = useTranslation();

  return (
    (currentCell[0].productName != "" ? 
    <td colSpan="1">{currentCell[0].productName}</td>
    : <td colSpan="1">ندارد</td>
    )
  )
};

export default ProductNameCell;