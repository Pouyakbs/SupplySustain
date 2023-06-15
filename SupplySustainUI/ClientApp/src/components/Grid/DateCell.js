import React, {useEffect,useState} from "react";
import {useTranslation} from "react-i18next";
import {getLangDate} from '../../utils/getLangDate'
import Tooltip from "@mui/material/Tooltip";



const DateCell=(props)=>{

  const [currentDate,setCurrentDate]=useState('')
  const { t, i18n } = useTranslation();

  useEffect(()=>{
      if(props.dataItem[props.field]!==''){
          setCurrentDate(getLangDate(i18n.language,props.dataItem[props.field]))
      }

  },[i18n.language,props.dataItem[props.field]])



  return(
      <td colSpan="1" className={'dir-ltr '}>
          <Tooltip title={currentDate}>
              <div>{currentDate}</div>
          </Tooltip>
      </td>

  )
}

export default React.memo(DateCell)