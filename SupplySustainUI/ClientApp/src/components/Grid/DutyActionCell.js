import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, FormControlLabel, Modal, Tooltip } from "@mui/material";
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import trashIcon3 from './trash-icon3.gif';
import axios from "axios";

import VisibilityIcon from '@mui/icons-material/Visibility';
import { history } from "../../utils/history";

const ActionCell=(props)=>{
    const [openRemove,setOpenRemove]=useState(false)
    const { t, i18n } = useTranslation();
    const [reqResult , setReqResult] = useState([])
    const userAccess = JSON.parse(localStorage.getItem('user'));
    console.log("User Access" , userAccess.programParts)
    const appConfig = window.globalConfig;
    const removePersonnel = () => {
        let isSuccess = false;
        axios
          .delete(`${appConfig.BaseURL}/api/activities/${props.dataItem.activityID}`)
          .then((res) => {
            setReqResult(res.data);
            isSuccess = true;
          })
          .finally(() => {
            if (isSuccess) {
              props.getData();
            }
          });
        };
        const transferToForm = () => {
            history.navigate(`/Activities/Duty/CreateDuty?id=${props.dataItem.activityID}`)
        }
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        bgcolor: 'background.paper',
        border: '1px solid #eee',
        boxShadow: 24,
        p: 4,
        direction:i18n.dir()
    };


    return(
      <>
          <td colSpan="1" >
              <div className={`d-flex justify-content-between`} >
                  <Tooltip title={t('ویرایش')}>
                      <IconButton  variant="contained" color='info' className='kendo-action-btn' onClick={()=>transferToForm()}>
                          <EditIcon/>
                      </IconButton >
                  </Tooltip>
                  <Tooltip title={t('حذف')}>
                      <IconButton  variant="contained" color="error" className='kendo-action-btn' onClick={()=>setOpenRemove(true)}>
                          <DeleteIcon/>
                      </IconButton >
                  </Tooltip>

              </div>

          </td>

          <Modal
            open={openRemove}
            onClose={()=>setOpenRemove(false)}
          >
              <Box sx ={style} style={{textAlign:'center',width:'450px'}}>
                  <img src={trashIcon3} alt={'remove'} className='remove-icon'/>
                  <p>
                      {t('شما در حال حذف کردن یک آیتم هستید')}
                      <br/>
                      {t('آیا از این کار مطمئنید؟')}
                      <br/>
                  </p>

                  <div className='d-flex justify-content-center'>
                      <Button variant="contained" color={'success'} onClick={removePersonnel} startIcon={<DoneIcon style={i18n.dir()==='rtl'?{marginLeft:'5px'}:{marginRight:'5px'}}/>} style={{margin:'0 2px'}}>{t('بله مطمئنم')}</Button>
                      <Button
                        variant="contained"
                        color={'error'}
                        startIcon={<CloseIcon style={i18n.dir()==='rtl'?{marginLeft:'5px'}:{marginRight:'5px'}}/>}
                        style={i18n.dir()==='rtl'?{marginRight:'10px'}:{marginLeft:'10px'}}
                        onClick={()=>setOpenRemove(false)}
                      >{t('انصراف')}</Button>
                  </div>

              </Box>

          </Modal>

      </>

    )
}

export default React.memo(ActionCell)



