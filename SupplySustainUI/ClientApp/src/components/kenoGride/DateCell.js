import {useEffect,useState} from "react";
import DateObject from "react-date-object";
import gregorian from "react-date-object/calendars/gregorian";
import persian from "react-date-object/calendars/persian";
import arabic from "react-date-object/calendars/arabic";
import {useTranslation} from "react-i18next";
import {getLangDate} from '../../utils/getLangDate'



const DateCell=(props)=>{

  const [currentDate,setCurrentDate]=useState()
  const { t, i18n } = useTranslation();

  useEffect(()=>{
    setCurrentDate(getLangDate(i18n.language,props.dataItem.DocumentInsertDate))
  },[i18n.language,props.dataItem.DocumentInsertDate])



  return(
    <td colSpan="1" >
      <span>{currentDate}</span>
    </td>

  )
}

export default DateCell