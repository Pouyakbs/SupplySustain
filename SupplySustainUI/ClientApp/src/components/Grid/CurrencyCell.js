import React from "react";
import Tooltip from "@mui/material/Tooltip";

const CurrencyCell = (props) => {
  return (
    <td colSpan="1" className={props?.className?props?.className:''}>
        <Tooltip title={props?.dataItem[props.field]?.toLocaleString()}>
            <div>{props?.dataItem[props.field]?.toLocaleString()}</div>
        </Tooltip>
    </td>
  );
};

export default React.memo(CurrencyCell);
