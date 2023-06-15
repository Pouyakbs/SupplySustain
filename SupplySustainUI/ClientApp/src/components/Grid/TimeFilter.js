import {useTranslation} from "react-i18next";
import React, {useEffect, useRef} from "react";
import {SelectBox} from "devextreme-react";
import {FormControlLabel, Radio, RadioGroup, TextField} from "@mui/material";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {LocalizationProvider, TimePicker} from "@mui/x-date-pickers";


const TimeFilter=({formik,field})=> {
    const { t, i18n } = useTranslation();

    const dateRef1=useRef()
    const dateRef2=useRef()

    const operators=[
        {title:t("برابر باشد با"),value:"eq"},
        {title:t("برابر نباشد با"),value:"neq"},
        {title:t("بعد و مساوی باشد با"),value:"gte"},
        {title:t("بعد باشد"),value:"gt"},
        {title:t("قبل باشد"),value:"lt"},
        {title:t("قبل یا مساوی باشد با"),value:"lte"},
        // {title:t("برابر با هیچ"),value:"isnull"},
        // {title:t("برابر با هیچ نباشد"),value:"isnotnull"},
    ]

    useEffect(()=>{
        if(formik.values[field].op1===''){
            formik.setFieldValue(`${field}.op1`,operators[0].value)
        }
        if(formik.values[field].op2===''){
            formik.setFieldValue(`${field}.op2`,operators[0].value)
        }

    },[])

    return (
        <div className='row'>
            <div className='col-12' onFocus={() => dateRef1?.current?.closeCalendar()}>
                <SelectBox
                    dataSource={operators}
                    rtlEnabled={i18n.dir() === "rtl" }
                    onValueChanged={(e) => formik.setFieldValue(`${field}.op1`,e.value)}
                    className='selectBox'
                    noDataText={t("اطلاعات یافت نشد")}
                    displayExpr={'title'}
                    valueExpr="value"
                    itemRender={null}
                    placeholder=''
                    id={`${field}.op1`}
                    name={`${field}.op1`}
                    searchEnabled
                    value={formik?.values[field]?.op1}
                />
            </div>
            <div className='col-12'>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimePicker
                        ampm={false}
                        className='time-picker'
                        views={['hours', 'minutes']}
                        inputFormat="HH:mm"
                        mask="__:__"
                        value={formik?.values[field]?.value1}
                        onChange={(newValue) => {
                            formik.setFieldValue(`${field}.value1`, newValue)
                        }}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>
            </div>
            <div className='col-12 mt-4 mb-4' onFocus={() => {
                dateRef1?.current?.closeCalendar()
                dateRef2?.current?.closeCalendar()
            }}>
                <RadioGroup
                    row
                    aria-labelledby={`${field}.logic`}
                    name={`${field}.logic`}
                    value={formik?.values[field]?.logic}
                    onChange={(event) => formik.setFieldValue(`${field}.logic`,event.target.value)}
                >
                    <FormControlLabel
                        value="And"
                        control={<Radio />}
                        label={t("و")}
                    />
                    <FormControlLabel
                        value="Or"
                        control={<Radio />}
                        sx={{margin:'0 10px!important'}}
                        label={t("یا")}
                    />
                </RadioGroup>
            </div>
            <div className='col-12' onFocus={() => dateRef2?.current?.closeCalendar()}>
                <SelectBox
                    dataSource={operators}
                    rtlEnabled={i18n.dir() === "rtl"}
                    onValueChanged={(e) => formik.setFieldValue(`${field}.op2`,e.value)}
                    className='selectBox'
                    noDataText={t("اطلاعات یافت نشد")}
                    displayExpr={'title'}
                    valueExpr="value"
                    itemRender={null}
                    placeholder=''
                    id={`${field}.op2`}
                    name={`${field}.op2`}
                    searchEnabled
                    value={formik?.values[field]?.op2}
                    disabled={!(formik?.values[field]?.value1||formik?.values[field]?.value2)}
                />
            </div>
            <div className='col-12'>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimePicker
                        ampm={false}
                        className='time-picker'
                        views={['hours', 'minutes']}
                        inputFormat="HH:mm"
                        mask="__:__"
                        value={formik?.values[field]?.value2}
                        onChange={(newValue) => {
                            formik.setFieldValue(`${field}.value2`, newValue)
                        }}
                        renderInput={(params) => <TextField {...params} />}
                        disabled={!(formik?.values[field]?.value1||formik?.values[field]?.value2)}
                    />
                </LocalizationProvider>
            </div>


        </div>
    );
}

export default TimeFilter
