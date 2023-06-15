import {useTranslation} from "react-i18next";
import React, {useEffect} from "react";
import {SelectBox} from "devextreme-react";
import {FormControlLabel, Radio, RadioGroup} from "@mui/material";
import {
    NumericTextBox,
} from "@progress/kendo-react-inputs";


const NumericFilter=({formik,field})=> {
    const { t, i18n } = useTranslation();

    const operators=[
        {title:t("برابر باشد با"),value:"eq"},
        {title:t("برابر نباشد با"),value:"neq"},
        {title:t("بزرگتر مساوی"),value:"gte"},
        {title:t("بزرگتر از"),value:"gt"},
        {title:t("کوچکتر مساوی با"),value:"lte"},
        {title:t("کوچکتر از"),value:"lt"},
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
            <div className='col-12'>
                <SelectBox
                    dataSource={operators}
                    rtlEnabled={i18n.dir() === "ltr" ? false : true}
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
                <NumericTextBox
                    className='form-input'
                    type="text"
                    id={`${field}.value1`}
                    name={`${field}.value1`}
                    onChange={(e) => formik.setFieldValue(`${field}.value1`,e.target.value)}
                    value={formik?.values[field]?.value1}
                />
            </div>
            <div className='col-12 mt-4 mb-4'>
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
            <div className='col-12'>
                <SelectBox
                    dataSource={operators}
                    rtlEnabled={i18n.dir() === "ltr" ? false : true}
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
                <NumericTextBox
                    className='form-input'
                    type="text"
                    id={`${field}.value2`}
                    name={`${field}.value2`}
                    onChange={(e) => formik.setFieldValue(`${field}.value2`,e.target.value)}
                    value={formik?.values[field]?.value2}
                    disabled={!(formik?.values[field]?.value1||formik?.values[field]?.value2)}
                />
            </div>


        </div>
    );
}

export default NumericFilter