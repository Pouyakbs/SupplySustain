import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, FormControlLabel, Modal, Tooltip } from "@mui/material";
import { useDeleteProductMutation } from "../../slices/ProductSlice";
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import trashIcon3 from './trash-icon3.gif';
import axios from "axios";

import VisibilityIcon from '@mui/icons-material/Visibility';
import { history } from "../../utils/history";
import swal from "sweetalert";

const ActionCell=(props)=>{
    const [openRemove,setOpenRemove]=useState(false)
    const { t, i18n } = useTranslation();
    const [reqResult , setReqResult] = useState([])
    const userAccess = JSON.parse(localStorage.getItem('user'));
    const [deleteProduct, deleteResults] = useDeleteProductMutation()
    const appConfig = window.globalConfig;
    const removeProduct = () => {
        let isSuccess = false;
        
        deleteProduct(props.dataItem.productID)
        .then((res) => {
            deleteResults(res)
            isSuccess = true;
        })
        .catch((error) => {
            let arr = error.map((item) => t(item));
            let msg = arr.join(" \n ");
            swal({
                text: msg,
                icon: "error",
                button: t("باشه"),
                className: "small-text",
            });
        })
        //   .finally(() => {
        //     if (isSuccess) {
        //       props.getData();
        //     }
        //   });
        };
        const transferToForm = () => {
            history.navigate(`/accounts/Competitor/NewCompetitor?id=${props.dataItem.productID}`)
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
                      <Button variant="contained" color={'success'} onClick={removeProduct} startIcon={<DoneIcon style={i18n.dir()==='rtl'?{marginLeft:'5px'}:{marginRight:'5px'}}/>} style={{margin:'0 2px'}}>{t('بله مطمئنم')}</Button>
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



