import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import {
  Box,
  FormControlLabel,
  Grid,
  Modal,
  Stack,
  InputLabel,
  FormHelperText,
  OutlinedInput,
  Divider,
} from "@mui/material";
import * as Yup from "yup";
import { useFormik } from "formik";
import AnimateButton from "../@extended/AnimateButton";
import axios from "axios";

import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import trash from "../../assets/images/icons/trash.png";

const ActionCell = (props) => {
  const [currentDate, setCurrentDate] = useState();
  const [all, setAll] = useState(false);
  const [openSetting, setOpenSetting] = useState(false);
  const [openRemove, setOpenRemove] = useState(false);
  const { t, i18n } = useTranslation();

  // console.log('row props.............',props.dataItem)

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "background.paper",
    border: "1px solid #eee",
    boxShadow: 24,
    p: 4,
    direction: i18n.dir(),
  };
  const [reqResult, setReqResult] = React.useState({});
  const formik = useFormik({
    initialValues: {
      username: props?.dataItem?.userName,
      passActiveDays: 0,
      passIncorrectNum: 0,
      passivePermitDays: 0,
      changeForAll: false,
    },
    validationSchema: Yup.object().shape({}),
    onSubmit: (values) => {
      axios
        .post("https://localhost:44329/api/authenticate/usersettings/", values)
        .then((res) => setReqResult(res.data))
        .catch((error) => error);
    },
  });
  useEffect(() => {
    reqResult?.status === "Success" && setOpenSetting(false)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reqResult]);
  return (
    <>
      <td colSpan="1">
        <div className="d-flex justify-content-between">
          <IconButton
            variant="contained"
            color="primary"
            className="kendo-action-btn"
            onClick={() => setOpenSetting(true)}
          >
            <ManageAccountsIcon />
          </IconButton>
          <IconButton
            variant="contained"
            color="info"
            className="kendo-action-btn"
            onClick={() => console.log("edit", props.dataItem.ProductID)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            variant="contained"
            color="error"
            className="kendo-action-btn"
            onClick={() => setOpenRemove(true)}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      </td>

      <Modal open={openSetting} onClose={() => setOpenSetting(false)}>
        <Box sx={style}>
          <p>نام:{props?.dataItem?.userName}</p>
          <FormControlLabel
            control={
              <Checkbox
                checked={formik.values.changeForAll}
                id="changeForAll"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                name="changeForAll"
                color="primary"
                size="small"
              />
            }
            label={<Typography variant="h6">اعمال روی تمام رکوردها</Typography>}
          />
          <Divider />
          <Grid item xs={12} sx={{ marginTop: "10px" }}>
            <Stack spacing={1}>
              <InputLabel htmlFor="passivePermitDays-login">
                {t("حداقل روزهای مجاز عدم استفاده از سیستم:")}
              </InputLabel>
              <OutlinedInput
                fullWidth
                error={Boolean(
                  formik.touched.passivePermitDays &&
                  formik.errors.passivePermitDays
                )}
                id="-passivePermitDays-login"
                value={formik.values.passivePermitDays}
                type="number"
                name="passivePermitDays"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                placeholder={t("0")}
              />
              {formik.touched.passivePermitDays &&
                formik.errors.passivePermitDays && (
                  <FormHelperText
                    error
                    id="standard-weight-helper-text-passivePermitDays-login"
                  >
                    {formik.errors.passivePermitDays}
                  </FormHelperText>
                )}
            </Stack>
          </Grid>
          <Grid item xs={12} sx={{ marginTop: "10px" }}>
            <Stack spacing={1}>
              <InputLabel htmlFor="passActiveDays-login">
                {t("تعداد روزهای فعال بودن کلمه عبور از زمان آخرین تغییرات:")}
              </InputLabel>
              <OutlinedInput
                fullWidth
                error={Boolean(
                  formik.touched.passActiveDays && formik.errors.passActiveDays
                )}
                id="-passActiveDays-login"
                value={formik.values.passActiveDays}
                type="number"
                name="passActiveDays"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                placeholder={t("0")}
              />
              {formik.touched.passActiveDays && formik.errors.passActiveDays && (
                <FormHelperText
                  error
                  id="standard-weight-helper-text-passActiveDays-login"
                >
                  {formik.errors.passActiveDays}
                </FormHelperText>
              )}
            </Stack>
          </Grid>
          <Grid item xs={12} sx={{ marginTop: "10px" }}>
            <Stack spacing={1}>
              <InputLabel htmlFor="passIncorrectNum-login">
                {t("تعداد دفعات مجاز ورود اشتباه نام کاربری و کلمه عبور:")}
              </InputLabel>
              <OutlinedInput
                fullWidth
                error={Boolean(
                  formik.touched.passIncorrectNum &&
                  formik.errors.passIncorrectNum
                )}
                id="-passIncorrectNum-login"
                value={formik.values.passIncorrectNum}
                type="number"
                name="passIncorrectNum"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                placeholder={t("0")}
              />
              {formik.touched.passIncorrectNum &&
                formik.errors.passIncorrectNum && (
                  <FormHelperText
                    error
                    id="standard-weight-helper-text-passIncorrectNum-login"
                  >
                    {formik.errors.passIncorrectNum}
                  </FormHelperText>
                )}
            </Stack>
          </Grid>
          {formik.errors.submit && (
            <Grid item xs={12}>
              <FormHelperText error>{formik.errors.submit}</FormHelperText>
            </Grid>
          )}
          <Grid item xs={12} sx={{ marginTop: "10px" }}>
            <AnimateButton>
              <Button
                disableElevation
                fullWidth
                size="large"
                type="button"
                onClick={formik.handleSubmit}
                variant="contained"
                color="primary"
              >
                {t("ثبت")}
              </Button>
              {reqResult.status == "Error" &&
                <div style={{ color: "red", textAlign: "center" }}>{t(reqResult.message)}</div>
              }
            </AnimateButton>
          </Grid>
        </Box>
      </Modal>

      <Modal open={openRemove} onClose={() => setOpenRemove(false)}>
        <Box sx={style} style={{ textAlign: "center", width: "450px" }}>
          <img src={trash} alt={"remove"} className="remove-icon" />
          <p>
            شما در حال حذف کردن یک کاربر هستید
            <br />
            آیا از این کار مطمئنید؟
            <br />
          </p>

          <div className="d-flex justify-content-center">
            <Button
              variant="contained"
              color={"success"}
              startIcon={
                <DoneIcon
                  style={
                    i18n.dir() === "rtl"
                      ? { marginLeft: "5px" }
                      : { marginRight: "5px" }
                  }
                />
              }
              style={{ margin: "0 2px" }}
            >
              بله مطمئنم
            </Button>
            <Button
              variant="contained"
              color={"error"}
              startIcon={
                <CloseIcon
                  style={
                    i18n.dir() === "rtl"
                      ? { marginLeft: "5px" }
                      : { marginRight: "5px" }
                  }
                />
              }
              style={
                i18n.dir() === "rtl"
                  ? { marginRight: "10px" }
                  : { marginLeft: "10px" }
              }
              onClick={() => setOpenRemove(false)}
            >
              انصراف
            </Button>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default ActionCell;




