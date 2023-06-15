import {useTranslation} from "react-i18next";
import React, {useEffect} from "react";
import {Checkbox, FormControlLabel, Typography} from "@mui/material";


const BooleanFilter=({formik,field})=> {

    const { t, i18n } = useTranslation();

    useEffect(()=>{
        if(formik?.values[field]?.isTrue&&formik?.values[field]?.isFalse) formik.setFieldValue(`${field}.all`,true)
        if(!formik?.values[field]?.isTrue&&!formik?.values[field]?.isFalse) formik.setFieldValue(`${field}.all`,false)

    },[formik?.values[field]])

    return (
        <div className='row'>
            <div className='col-12'>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={formik?.values[field]?.isTrue&&formik?.values[field]?.isFalse}
                            onChange={e=>{
                                formik.setFieldValue(`${field}.all`,e.target.checked)
                                formik.setFieldValue(`${field}.isTrue`,e.target.checked)
                                formik.setFieldValue(`${field}.isFalse`,e.target.checked)
                            }}
                            name={`${field}.all`}
                            color="primary"
                            size="small"
                            id={`${field}.all`}
                        />
                    }
                    sx={{margin: '0'}}
                    label={
                        <Typography variant="h6" sx={{fontSize:'11px'}}>
                            {t("همه")}
                        </Typography>
                    }
                />
            </div>
            <div className='col-12'>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={formik?.values[field]?.isTrue}
                            onChange={e=>formik.setFieldValue(`${field}.isTrue`,e.target.checked)}
                            name={`${field}.isTrue`}
                            color="primary"
                            size="small"
                            id={`${field}.isTrue`}
                        />
                    }
                    sx={{margin: '0'}}
                    label={
                        <Typography variant="h6" sx={{fontSize:'11px'}}>
                            {t("صحیح باشد")}
                        </Typography>
                    }
                />
            </div>
            <div className='col-12'>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={formik?.values[field]?.isFalse}
                            onChange={e=>formik.setFieldValue(`${field}.isFalse`,e.target.checked)}
                            name={`${field}.isFalse`}
                            color="primary"
                            size="small"
                            id={`${field}.isFalse`}
                        />
                    }
                    sx={{margin: '0'}}
                    label={
                        <Typography variant="h6" sx={{fontSize:'11px'}}>
                            {t("غلط باشد")}
                        </Typography>
                    }
                />
            </div>
        </div>
    );
}

export default BooleanFilter