import { FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import React, { useEffect } from "react";
import {
  Accordion,
  AccordionDetails,
  Button,
  AccordionSummary,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import swal from "sweetalert";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { history } from "../../utils/history";
import { useSearchParams } from "react-router-dom";
import { useCreateProductsMutation } from "../../slices/ProductSlice";
import { useUpdateProductMutation } from "../../slices/ProductSlice";
import { useGetProductQuery } from "../../slices/ProductSlice";

const Factor = [];

const NewProduct = () => {
  const { t, i18n } = useTranslation();
  const [content, setContent] = useState("");
  const [createProduct, createResults] = useCreateProductsMutation();
  const [updateProduct, updateResults] = useUpdateProductMutation();
  const [factor, setFactor] = React.useState(Factor);
  const [result, setResult] = useState();
  const [SearchParams] = useSearchParams();
  const id = SearchParams.get("id");
  const {
    data: productResult,
    isFetching,
    error,
  } = useGetProductQuery(id);
  const [productDetail, setProductDetail] = useState([]);
  const appConfig = window.globalConfig;
  const callComponent = () => {
    history.navigate(`/`);
  };

  /////////////////////////////////formik/////////////////////////////////////
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      productName: "",
      desc: "",
    },
    validationSchema: Yup.object({
      productName: Yup.string()
        .max(128, "نام باید شامل 128 حرف یا کمتر باشد")
        .required("نام محصول الزامیست"),
    }),
    onSubmit: (values) => {
      console.log(values);
      createProduct(values)
        .unwrap()
        .then((res) => setResult(res.data.data))
        .catch((error) => {
          let arr = error.map((item) => t(item));
          let msg = arr.join(" \n ");
          swal({
            text: msg,
            icon: "error",
            button: t("باشه"),
            className: "small-text",
          });
        });
      factorSub();
      callComponent();
    },
  });
  const updateCompetitor = (values) => {
    if (values != null) {
      console.log(values);
      let isSuccess = false;
      updateProduct({ id: id, product: formik.values })
        .then((res) => {
          setResult(res.data);
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
        });
      history.navigate(`/`);
    }
  };

  const factorSub = () => {
    swal({
      title: t("اطلاعات محصول با موفقیت ثبت شد"),
      icon: "success",
      button: t("باشه"),
    });
  };

  useEffect(() => {
    if (id != null) {
      if (isFetching) {
        setContent(<CircularProgress />);
      } else if (error) {
        setContent(t("خطایی رخ داده است"));
      } else {
        setContent("");
        setProductDetail(productResult);
        formik.setFieldValue("productName", productResult.productName);
        formik.setFieldValue("desc", productResult.desc);
      }
    }
  }, [isFetching]);

  const [panel1, setPanel1] = React.useState(true);
  const handlePanel1 = () => (event, newExpanded) => {
    setPanel1(newExpanded);
  };

  /////////////////////////////////////////////////////////////////////////////////

  return (
    <div id="form" style={{ display: "block", marginRight: "10px" }}>
      {/*<h1 className='main-title'>*/}
      {/*    {t("ایجاد رقیب")}*/}
      {/*</h1>*/}
      <FormikProvider value={formik}>
        <form onSubmit={formik.handleSubmit}>
          <div
            style={{
              borderWidth: "0",
            }}
          >
            <Accordion expanded={panel1} onChange={handlePanel1()}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1b-content"
                id="panel1b-header"
              >
                <Typography>{t("اطلاعات رقیب")}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className="form-design">
                  <div className="row">
                    <div className="content col-lg-6 col-md-12 col-xs-12">
                      <div className="title">
                        <span>
                          {t("نام محصول")}
                          <span className="star">*</span>
                        </span>
                      </div>
                      <div className="wrapper">
                        <input
                          className="form-input"
                          type="text"
                          id="productName"
                          name="productName"
                          style={{ width: "100%" }}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.productName}
                        />
                        {formik.touched.productName && formik.errors.productName ? (
                          <div className="error-msg">
                            {t(formik.errors.productName)}
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="content col-lg-6 col-md-6 col-xs-12">
                      <div className="title">
                        <span>{t("توضیحات محصول")}</span>
                      </div>
                      <div className="wrapper">
                        <div>
                          <textarea
                            className="form-input"
                            id="desc"
                            name="desc"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.desc}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>

            <div className="button-pos">
              <Button
                variant="contained"
                color="success"
                type="button"
                onClick={
                  id != null
                    ? updateCompetitor
                    : () => {
                        formik.handleSubmit();
                      }
                }
              >
                {t("ثبت")}
              </Button>
              <Button
                variant="contained"
                style={{ marginRight: "5px" }}
                color="error"
                onClick={callComponent}
              >
                {t("انصراف")}
              </Button>
            </div>
          </div>
        </form>
      </FormikProvider>
    </div>
  );
};

export default NewProduct;
