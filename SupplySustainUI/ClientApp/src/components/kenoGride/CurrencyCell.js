import React from "react";

const CurrencyCell=(props)=>(
    <td colSpan="1" >
        <span>{props.dataItem.DocumentBalance.toLocaleString()}</span>
    </td>

)

export default React.memo(CurrencyCell)