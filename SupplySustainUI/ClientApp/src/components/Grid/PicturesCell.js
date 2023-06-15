import {useEffect,useState} from "react";
import {useTranslation} from "react-i18next";
import { PictureOutlined } from '@ant-design/icons';
import PictureModal from "../Modals/PictureModal/PictureModal";

const PicturesCell=(props)=>{
    console.log("pictureCell props" , props)
  const [currentCell,setCurrentCell]=useState()
  const { t, i18n } = useTranslation();

  useEffect(()=>{
    setCurrentCell(props.dataItem[props.field])
  },[props.dataItem[props.field]])



  return(
    <td colSpan="1" >
    <PictureModal getData={currentCell}/>
    </td>
  )
}

export default PicturesCell