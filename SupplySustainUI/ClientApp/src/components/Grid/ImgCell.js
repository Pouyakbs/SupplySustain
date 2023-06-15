import React, {useEffect,useState} from "react";
import  pic from '../../assets/images/user.jpg'
import {Avatar} from "@mui/material";



const ImgCell=(props)=>{

    const style={
        display:'block',
        borderRadius:'50%',
        border:'solid 1px #eee',
        width:'40px',
        height:'40px',
        objectFit:'cover',
        objectPosition:'center',
        margin:'0 auto'
    }

  return(
      <td colSpan="1" style={{textAlign:'center'}}>
          {props.dataItem[props.field]?<img src={props.dataItem[props.field]} alt={'pic'} style={style}/>:
              <Avatar alt="profile user" className="avatar-profile" sx={{width: 40, height: 40,margin:'0 auto'}}/>}
      </td>

  )
}

export default React.memo(ImgCell)