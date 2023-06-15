import {useEffect,useState} from "react";
import {useTranslation} from "react-i18next";
import { CheckSquareOutlined , CloseSquareOutlined } from '@ant-design/icons';


const BooleanCell=(props)=>{
  const [currentBool,setCurrentBool]=useState()
  const { t, i18n } = useTranslation();

  useEffect(()=>{
    setCurrentBool(props.dataItem[props.field])
  },[props.dataItem[props.field]])



  return(
    <td colSpan="1" >
      {currentBool == true ? <CheckSquareOutlined style={{color: "green" , fontSize: "23px"}}/> : <CloseSquareOutlined style={{color: "red" , fontSize: "23px"}}/>}
    </td>

  )
}

export default BooleanCell