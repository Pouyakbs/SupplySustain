import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { CircularProgress, useTheme } from "@mui/material";
import DataGrid from "../../components/Grid/Grid";
import IndexCell from "../../components/Grid/IndexCell";
import { ColumnMenu } from "../../components/Grid/ColumnMenu";
import CompetitorActionCell from "../../components/Grid/CompetitorActionCell";
import ProductNameCell from "../../components/Grid/ProductNameCell";
import MinPriceCell from "../../components/Grid/MinPriceCell";
import MaxPriceCell from "../../components/Grid/MaxPriceCell";
import { useGetAllProductsQuery } from "../../slices/ProductSlice";
import { useLocation } from "react-router";

const ProductManagement = () => {
    const { t, i18n } = useTranslation();
    const appConfig = window.globalConfig;
    // const [rawData, setRawData] = useState([]);
    const [data, setData] = useState([]);
    const [excelData, setExcelData] = useState([]);
    const [total, setTotal] = useState(0);
    const location = useLocation()
    const params = new URLSearchParams(location?.search)
    const obj = Object.fromEntries(params)
    const [content, setContent] = useState("")
    // const dataRef = useRef();
    // dataRef.current = rawData;
    const { data: productResult, isFetching: productIsFetching, error: productError,
        isLoading: productIsLoading } = useGetAllProductsQuery(obj);

    function createData(rawData) {
        // if (rawData.length) {
        let tempData = rawData.map((data) => {
            return {
                ...data,
            };
        });
        setData(tempData);

        let tempExcel = rawData?.map((data, index) => {
            return {
                ...data,
                IndexCell: index + 1,
            };
        });
        setExcelData(tempExcel);
        // }
    }

    const theme = useTheme();

    // const CustomFooterSome = (props) => (
    //     <FooterSome {...props} data={dataRef.current} />
    // );
    useEffect(() => {
        if (productIsFetching) {
            setContent(<CircularProgress />)
        } else if (productError) {
            setContent(t("خطایی رخ داده است"))
        } else {
            setContent("")
            let tempData = productResult
            setTotal(tempData[1].totalCount);
            // setRawData(tempData[0])
            // dataRef.current = tempData[0]
            createData(tempData[0])
        }
    }, [productIsFetching, productResult,i18n.language])

    function getSavedCharts(list) {
        console.log("save charts list to request and save:", list);
    }

    function getSelectedRows(list) {
        console.log("selected row list to request:", list);
    }

    const ActionCellData = (props) => (
        <CompetitorActionCell {...props} />
    );
    let tempColumn = [
        {
            field: "IndexCell",
            filterable: false,
            width: "60px",
            name: "ردیف",
            cell: IndexCell,
            sortable: false,
            reorderable: true,
        },
        {
            field: "productName",
            columnMenu: ColumnMenu,
            filterable: true,
            name: "نام محصول",
            // orderIndex:5
        },
        {
            field: "desc",
            columnMenu: ColumnMenu,
            filterable: true,
            name: "توضیحات",
            // orderIndex:6
        },
        {
            field: "actionCell",
            filterable: false,
            width: "90px",
            name: "عملیات",
            cell: ActionCellData,
            className: "text-center",
            // orderIndex:10,
            reorderable: false,
        },
    ];
    const chartObj = [
        { value: "DocumentBalance", title: t("تراز سند") },
        { value: "DocumentCode", title: t("کد سند") },
    ];

    let savedCharts = [
        { title: "تست 1", dashboard: false },
        { title: "تست 2", dashboard: true },
    ];

    console.log("data---", data);

    return (
        <>
            <div
                style={{
                    backgroundColor: `${theme.palette.background.paper}`,
                    padding: "20px",
                }}
            >
                <DataGrid
                    gridId={"productID"}
                    gridData={data}
                    excelData={excelData}
                    columnList={tempColumn}
                    showSetting={true}
                    showChart={true}
                    showExcelExport={true}
                    showPrint={true}
                    showAdd={true}
                    excelFileName={"ProductDetails"}
                    chartDependent={chartObj}
                    rowCount={10}
                    addUrl={"/NewProduct"}
                    addTitle={"افزودن محصول"}
                    savedChartsList={savedCharts}
                    getSavedCharts={getSavedCharts}
                    sortable={true}
                    pageable={true}
                    reorderable={true}
                    total={total}
                    loading={productIsFetching}
                    selectionMode={"multiple"} //single , multiple
                    selectKeyField={"productID"}
                    getSelectedRows={getSelectedRows}
                />
            </div>
        </>
    );
};

export default ProductManagement;
