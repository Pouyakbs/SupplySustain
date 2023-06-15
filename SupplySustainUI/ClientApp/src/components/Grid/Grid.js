import React, {useEffect, useRef, useState,forwardRef,useImperativeHandle} from "react";
import {Grid, GridColumn, getSelectedState} from "@progress/kendo-react-grid";
import {getter} from "@progress/kendo-react-common";
import "./default-main-dark.css";
import "./default-ocean-blue.css";
import "./style.css";
import {process} from "@progress/kendo-data-query";
import SettingsIcon from "@mui/icons-material/Settings";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import Checkbox from "@mui/material/Checkbox";
import {LocalizationProvider} from "@progress/kendo-react-intl";
import {
    ExcelExport,
    ExcelExportColumn,
} from "@progress/kendo-react-excel-export";
import {useTranslation} from "react-i18next";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import BarChartIcon from "@mui/icons-material/BarChart";
import Button from "@mui/material/Button";
import {IconFileSpreadsheet, IconPrinter} from "@tabler/icons";
import {
    FormControlLabel,
    Radio,
    RadioGroup,
    useTheme,
} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import {getLangDate} from "../../utils/getLangDate";
import {loadLangMsg} from "../../utils/loadLangMsg";
import AddIcon from "@mui/icons-material/Add";
import {SelectBox} from "devextreme-react/select-box";
import {ColorPicker, NumericTextBox} from "@progress/kendo-react-inputs";
import PieChartIcon from "@mui/icons-material/PieChart";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import {AreaChartOutlined} from "@ant-design/icons";
import ScatterPlotIcon from "@mui/icons-material/ScatterPlot";
import chartPreview from "./chart-preview.gif";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import {Link, useLocation, useSearchParams} from "react-router-dom";
import {useFormik} from "formik";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import StringFilter from "./StringFilter";
import filterIcon from "./filter-icon-blue.gif";
import filterIconDark from "./filter-icon-blue-dark.gif";
import NumericFilter from "./NumericFilter";
import BooleanFilter from "./BooleanFilter";
import DateFilter from "./DateFilter";
import TimeFilter from "./TimeFilter";

// const pSize=['A3','A4','A5','B4','B5','letter','landscape','portrait']

function TabPanel(props) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && <>{children}</>}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        "aria-controls": `vertical-tabpanel-${index}`,
    };
}

const EmptyHeaderCell = (props) => <span></span>;

const DataGrid = forwardRef(({
                               gridId,
                               gridData = [],
                               showSetting = true,
                               showChart = true,
                               showExcelExport = true,
                               showPrint = true,
                               showAdd = false,
                               showFilter = true,
                               showTooltip = true,
                               addUrl,
                               addTitle,
                               addBtnDisabled=false,
                               excelData = [],
                               columnList = [],
                               chartDependent = [],
                               rowCount = 10,
                               savedChartsList = [],
                               excelFileName = "download",
                               getSavedCharts,
                               sortable = true,
                               pageable = true,
                               selectable = false,
                               selectionMode = "multiple",
                               selectKeyField,
                               getSelectedRows,
                               reorderable = true,
                               total = 0,

                               expandDetail = false,
                               detail,
                               expandField = "expanded",
                               onExpandChange,
                               activeClickRow = false,
                               getClickRow,
                               extraBtn = <></>,
                               extraBtnSecond = <></>,
                               loading = false,

                               disableQueryString=false,
                               getParams,

                           },ref) => {
    const location = useLocation();
    const {pathname} = location;


    columnList.forEach((v) => {
        delete v.columnMenu;
        delete v.format;
    });


    const colorPicker1 = useRef();
    const colorPicker2 = useRef();
    const colorPicker3 = useRef();

    const [tabValue, setTabValue] = useState(null);

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const printSetting = showPrint
        ? JSON.parse(localStorage.getItem(`print_${gridId}`))
        : null;
    const chartSetting = showChart
        ? JSON.parse(localStorage.getItem(`chart_${gridId}`))
        : null;
    const gridSetting = showSetting
        ? JSON.parse(localStorage.getItem(`settings_${gridId}`))
        : null;
    const order = reorderable
        ? JSON.parse(localStorage.getItem(`order_${gridId}`))
        : null;

    const [search, setSearch] = useSearchParams();
    const [search2, setSearch2] = useState({
        PageNumber:1,
        PageSize:!pageable ? total :  parseInt(gridSetting?.take) || rowCount
    });

    const theme = useTheme();
    const {t, i18n} = useTranslation();
    const [data, setData] = useState([]);
    const [coloring, setColoring] = useState(false);
    const [filterSet, setFilterSet] = useState(false);

    const [autoWidth, setAutoWidth] = useState("90px");
    const [formFields, setFormFields] = useState([]);

    let tempColumn = columnList?.map((item) => {
        if (item?.children?.length) {
            let t = item?.children.map((c) => {
                if (c?.width) {
                    return c;
                } else {
                    return {
                        ...c,
                        width: autoWidth,
                    };
                }
            });
            return {
                ...item,
                children: t,
            };
        } else {
            if (item?.width) {
                return item;
            } else {
                return {
                    ...item,
                    width: autoWidth,
                };
            }
        }
    });

    const columnsObj = columnList
        ?.map((item) => {
            // if(item?.children?.length){
            //     let temp=item?.children.map((c)=>{
            //         return {value: c.field, title:`${t(item.name)} - ${t(c.name)}`,parent:item.field}
            //     })
            //     return [...temp]
            // }else{
            //     if(item.field!=='actionCell') return  {value: item.field, title: t(item.name)}
            // }
            if (item.field !== "actionCell")
                return {value: item.field, title: t(item.name)};

            // }).filter(Boolean).flat(3)
        })
        .filter(Boolean);

    const chartObj = columnList
        ?.map((item) => {
            if (item?.children?.length) {
                let temp = item?.children.map((c) => {
                    return {
                        value: c.field,
                        title: `${t(item.name)} - ${t(c.name)}`,
                        parent: item.field,
                    };
                });
                return [...temp];
            } else {
                if (item.field !== "actionCell")
                    return {value: item.field, title: t(item.name)};
            }
            // if(item.field!=='actionCell') return  {value: item.field, title: t(item.name)}
        })
        .filter(Boolean)
        .flat(3);

    let fObj = {};

    columnList?.forEach((item) => {
        // if(item?.children?.length){
        //     fObj[item.field]={}
        //  item?.children.forEach((c)=>{
        //         fObj[item.field][c.field]={grid:true, excel:true}
        //     })
        // }else{
        //     if(item.field!=='actionCell'){
        //         fObj[item.field]={grid:true, excel:true}
        //     }else{
        //         fObj[item.field]={grid:true, excel:false}
        //     }
        // }

        if (item.field !== "actionCell") {
            fObj[item.field] = {grid: true, excel: true};
        } else {
            fObj[item.field] = {grid: true, excel: false};
        }
    });

    const [fields, setFields] = useState(gridSetting?.fields || fObj);

    const initialValues = {};

    useEffect(() => {
        let formFieldstemp = [];
        tempColumn.forEach((item) => {
            if (!item?.children?.length) {
                if (item.field !== "actionCell" && item.field !== "IndexCell" && item.filter !== "none") {
                    if (item.filter === "boolean") {
                        initialValues[`${item.field}`] = {
                            all: false,
                            isTrue: false,
                            isFalse: false,
                        };
                    } else {
                        initialValues[`${item.field}`] = {
                            value1: "",
                            value2: "",
                            op1: "",
                            op2: "",
                            logic: "And",
                        };
                    }
                    formFieldstemp.push(item);
                }
            } else {
                item.children.forEach((child) => {
                    if (child.field !== "actionCell" && child.field !== "IndexCell" && item.filter !== "none") {
                        if (child.filter === "boolean") {
                            initialValues[`${child.field}`] = {
                                all: false,
                                isTrue: false,
                                isFalse: false,
                            };
                        } else {
                            initialValues[`${child.field}`] = {
                                value1: "",
                                value2: "",
                                op1: "",
                                op2: "",
                                logic: "And",
                            };
                        }

                        // initialValues[`${item.field}_value2`] = item?.filter==='currency'?'':item?.filter==='numeric'?'':item?.filter==='date'?'':item?.filter==='boolean'?'':item?.filter==='time'?'':''
                        formFieldstemp.push({
                            ...child,
                            name: `${item.name} - ${child.name}`,
                        });
                    }
                });
            }
        });
        setFormFields(formFieldstemp);
    }, []);

    function getFilterValuesObj(val) {
        let qs = {};
        Object.keys(val).forEach((c) => {
            let field = formFields.filter((f) => f.field === c)?.[0];
            if (field?.filter === "boolean") {
                Object.keys(val[c]).forEach((key) => {
                    if (key !== "all" && val[c][key]) {
                        qs[`${c}_${key}`] = val[c][key];
                    }
                });
            }
            if(field?.filter === "time"){
                Object.keys(val[c]).forEach((key) => {
                    if (key === "value1" && !!val[c][key]) {
                        qs[`${c}_${key}`] = `${val[c][key].$H}-${val[c][key].$m}`;
                    } else if (key === "op1" && !!val[c].value1) {
                        qs[`${c}_${key}`] = val[c][key];
                    } else if (key === "value2" && !!val[c][key]) {
                        qs[`${c}_${key}`] = `${val[c][key].$H}-${val[c][key].$m}`;
                    } else if (key === "op2" && !!val[c].value2) {
                        qs[`${c}_${key}`] = val[c][key];
                    } else if (key === "logic" && !!val[c].value1 && !!val[c].value2) {
                        qs[`${c}_${key}`] = val[c][key];
                    }
                });
            }else {
                Object.keys(val[c]).forEach((key) => {
                    if (key === "value1" && !!val[c][key]) {
                        qs[`${c}_${key}`] = val[c][key];
                    } else if (key === "op1" && !!val[c].value1) {
                        qs[`${c}_${key}`] = val[c][key];
                    } else if (key === "value2" && !!val[c][key]) {
                        qs[`${c}_${key}`] = val[c][key];
                    } else if (key === "op2" && !!val[c].value2) {
                        qs[`${c}_${key}`] = val[c][key];
                    } else if (key === "logic" && !!val[c].value1 && !!val[c].value2) {
                        qs[`${c}_${key}`] = val[c][key];
                    }
                });
            }
        });
        return qs;
    }

    const formik = useFormik({
        initialValues: initialValues,
        validateOnChange: false,
        onSubmit: (values) => {
            let allValues = {...values};
            let timeList = tempColumn.filter((f) => f.filter === "time");
            if (timeList.length) {
                timeList.forEach((item) => {
                    allValues[item.field] = {
                        ...allValues[item.field],
                        value1: values[item.field].value1
                            ? `${("0" + values[item.field].value1.$H).slice(-2)}:${(
                                "0" + values[item.field].value1.$m
                            ).slice(-2)}`
                            : "",
                        value2: values[item.field].value2
                            ? `${("0" + values[item.field].value2.$H).slice(-2)}:${(
                                "0" + values[item.field].value2.$m
                            ).slice(-2)}`
                            : "",
                    };
                });
            }
            let qs = getFilterValuesObj(allValues);

            let params = {};
            if(!disableQueryString){
                if (location?.search !== "") {
                    const urlParams = new URLSearchParams(location?.search.substring(1));
                    params = Object.fromEntries(urlParams);
                    Object.keys(values).forEach((p) => {
                        delete params[`${p}_value1`];
                        delete params[`${p}_value2`];
                        delete params[`${p}_op1`];
                        delete params[`${p}_op2`];
                        delete params[`${p}_logic`];
                    });
                }
            }else{
                if (Object.keys(search2).length) {
                    params = search2;
                    Object.keys(values).forEach((p) => {
                        delete params[`${p}_value1`];
                        delete params[`${p}_value2`];
                        delete params[`${p}_op1`];
                        delete params[`${p}_op2`];
                        delete params[`${p}_logic`];
                    });
                }
            }

            Object.keys(qs).forEach((q) => {
                if (qs[q]) {
                    params[q] = qs[q];
                } else {
                    delete params[q];
                }
            });
            if(!disableQueryString){
                setSearch(params)
            }else{
                setSearch2(params)
                getParams(params)
            }
        },
    });
    let pObj = {};

    columnList?.forEach((item) => {
        if (item?.children?.length) {
            pObj[item.field] = {};
            item?.children.forEach((c) => {
                pObj[item.field][c.field] = true;
            });
        } else {
            if (item.field !== "actionCell") {
                pObj[item.field] = true;
            }
        }
    });

    const [printField, setPrintField] = useState(printSetting || pObj);

    let body = document.querySelector("body");

    useEffect(() => {
        if (theme.palette.mode === "light") {
            body.classList.remove("dark-theme-grid");
        } else {
            body.classList.add("dark-theme-grid");
        }
    }, [theme.palette.mode]);

    useEffect(() => {
        if (i18n.dir() === "rtl") {
            body.classList.add("rtl-kendo-grid");
            body.classList.remove("ltr-kendo-grid");
        } else {
            body.classList.add("ltr-kendo-grid");
            body.classList.remove("rtl-kendo-grid");
        }
    }, [i18n.language]);

    const [result, setResult] = useState([]);
    const [sort, setSort] = React.useState([]);

    const sortChange = (event) => {
        let params={}
        if(!disableQueryString){
            const urlParams = new URLSearchParams(location?.search.substring(1));
            params = Object.fromEntries(urlParams);
        }else{
            params=search2
        }

        if(event?.sort?.length){
            params[`sort_${event?.sort[0]?.field}`]=event?.sort[0]?.dir
            if(!disableQueryString){
                setSearch(params)
            }else{
                setSearch2(params)
                getParams(params)
            }
        }
        setSort(event.sort);
    };
    // const getData = (sort) => {
    //     return orderBy(data, sort);
    // };

    const defaultLightRowColor1 = "#fff";
    const defaultLightRowColor2 = "#ebebeb";
    const defaultDarkRowColor1 = "#101010";
    const defaultDarkRowColor2 = "rgba(255, 255, 255, 0.04)";
    // const defaultRowColor2='#1890ff14'


    let paramsT={}
    if(!disableQueryString){
        const urlParamsT = new URLSearchParams(location?.search.substring(1));
        paramsT = Object.fromEntries(urlParamsT);
    }else{
        paramsT=search2
    }


    const [take, setTake] = useState(!pageable ? total : parseInt(paramsT?.PageSize) || parseInt(gridSetting?.take) || rowCount);
    const [takeTemp, setTakeTemp] = useState(!pageable ? total : parseInt(paramsT?.PageSize) || parseInt(gridSetting?.take) || rowCount);

    const [skip, setSkip] = useState(paramsT?.PageNumber ? (parseInt(paramsT?.PageNumber) - 1) * parseInt(paramsT?.PageSize) : 0);
    // const [printSize, setPrintSize] = useState(pSize[0]);
    const [filterExcelFields, setFilterExcelFields] = useState(true);
    const [rowColor1, setRowColor1] = useState(gridSetting?.rowColor1 || "");
    const [rowColor2, setRowColor2] = useState(gridSetting?.rowColor2 || "");
    const [rowClickColor, setRowClickColor] = useState("inherit");
    const [newChart, setNewChart] = useState("");
    const [savedCharts, setSavedCharts] = useState(savedChartsList);

    useEffect(() => {
        showChart && getSavedCharts && getSavedCharts(savedCharts);
    }, [savedCharts]);

    const gridContainer = useRef(null);
    const gridRef = useRef();

    const columnReorder = (e) => {
        let temp = e.target.columnResize.columns.map((item) => ({
            field: item.field,
            index: item.index,
        }));
        let tempOrder = tempColumn?.map((item) => {
            let field = e.columns.filter((f) => f.field === item.field)[0];
            return {
                ...item,
                // orderIndex:field?.orderIndex||item.orderIndex
            };
        });
        tempOrder.forEach(function(v){ delete v.filter });
        setColumnArr(tempOrder);
        reorderable &&
        localStorage.setItem(`order_${gridId}`, JSON.stringify(temp));
    };

    const setOrder = (order) => {
        let tempOrder = order?.map((item) => {
            let field = tempColumn.filter((f) => f.field === item.field)[0];
            return field;
        });

        return tempOrder;
    };

    const [columnArr, setColumnArr] = useState([]);
    useEffect(() => {
        if (!!autoWidth) {
            let saveOrder = order?.length ? setOrder(order) : tempColumn;
            saveOrder.forEach(function(v){
                delete v.filter
                // if(v.field!=='actionCell'){
                //     delete v.width
                // }


            });
            // console.log('saveOrder....',saveOrder)
            setColumnArr(saveOrder);
        }
    }, [autoWidth]);
    const chartTypes = [
        {name: t("میله ای"), value: "bar", icon: <BarChartIcon/>},
        {name: t("دایره ای"), value: "pie", icon: <PieChartIcon/>},
        {name: t("خطی"), value: "line", icon: <ShowChartIcon/>},
        {
            name: t("مساحت"),
            value: "area",
            icon: <AreaChartOutlined style={{fontSize: "22px"}}/>,
        },
        {name: t("پراکندگی"), value: "scatter", icon: <ScatterPlotIcon/>},
    ];
    const createDataState = (dataState) => {
        return {
            result: process(data?.slice(0), dataState),
            dataState: dataState,
        };
    };

    const [dataState, setDataState] = useState({
        take: take,
        skip: skip,
    });
    let initialState = createDataState({
        take: take,
        skip: skip,
        // group:[{field:'DocumentBalance'}]
    });

    const dataStateChange = (event) => {
        let updatedState = createDataState(event.dataState);
        setResult(updatedState.result);
        setDataState(updatedState.dataState);
    };

    const [anchorSetting, setAnchorSetting] = useState(null);
    const [anchorFilter, setAnchorFilter] = useState(null);
    const [anchorEcxel, setAnchorEcxel] = useState(null);
    const [anchorPrint, setAnchorPrint] = useState(null);
    const [anchorChart, setAnchorChart] = useState(null);
    const [gridW, setGridW] = useState();
    const [selectedState, setSelectedState] = useState({});
    const [selectedRows, setSelectedRows] = useState([]);
    const [chartMap, setChartMap] = useState(chartSetting?.chartMap);
    const [chartGrid, setChartGrid] = useState(chartSetting?.chartGrid);
    const [xaxis, setXaxis] = useState([]);
    const [pieSeries, setPieSeries] = useState([]);
    let CObj = {};
    chartDependent?.forEach((item) => {
        CObj[item.value] = false;
    });

    const [dependentField, setDependentField] = useState(
        chartSetting?.dependentField || CObj
    );
    const [pieDependent, setPieDependent] = useState(chartSetting?.pieDependent);
    const [chartSeries, setChartSeries] = useState([]);
    const [pieLabels, setPieLabels] = useState([]);
    const [mainChartField, setMainChartField] = useState(
        chartSetting?.mainChartField
    );
    const [chartType, setChartType] = useState(chartSetting?.chartType);

    const Item = (data) => {
        return (
            <div
                className={`custom-select-item ${i18n.dir() === "rtl" ? "rtl" : ""}`}
            >
                {data.icon}
                <div className="name">{data.name}</div>
            </div>
        );
    };

    useEffect(() => {
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    function timeout(delay) {
        return new Promise((res) => setTimeout(res, delay));
    }

    const handleResize = async () => {
        await timeout(10);
        setGridW(gridContainer?.current?.offsetWidth - 37);
    };

    useEffect(() => {
        if (gridW) {
            let widthList = columnList?.map((item) => {
                if (!!item?.width) {
                    let wi = item?.width?.replace("px", "");
                    return parseInt(wi);
                }
            });

            widthList = widthList.filter(Boolean);
            let fixWidth = widthList?.reduce((a, b) => a + b, 0);
            let selecFielsWidth = selectable ? 40 : 0;
            fixWidth = fixWidth + selecFielsWidth;
            let w = gridW - fixWidth - 17;
            // let count = Object.keys(fields).length - widthList.length

            let c = 0;
            columnList.forEach((column) => {
                if (!column?.children?.length) {
                    c++;
                } else {
                    c += column?.children?.length;
                }
            });

            let count = c - widthList.length;
            let cellW = parseInt(w / count);
            cellW = cellW < 90 ? 90 : cellW;
            setAutoWidth(`${cellW}px`);
        }
    }, [gridW]);

    const openSetting = Boolean(anchorSetting);
    const idSetting = openSetting ? "simple-popover" : undefined;
    const openFilter = Boolean(anchorFilter);
    const idFilter = openFilter ? "simple-popover" : undefined;
    const openEcxel = Boolean(anchorEcxel);
    const idEcxel = openEcxel ? "simple-popover" : undefined;
    const openPrint = Boolean(anchorPrint);
    const idPrint = openPrint ? "simple-popover" : undefined;
    const openChart = Boolean(anchorChart);
    const idChart = openChart ? "simple-popover" : undefined;

    const _export = useRef(null);
    const excelExport = () => {
        if (_export.current !== null) {
            _export.current.save();
        }
    };

    useEffect(() => {
        if (dataState) {
            let updatedState = createDataState(dataState);
            updatedState.dataState.filter = {filters: [], logic: ""};
            updatedState.result.data = gridData;
            setResult(updatedState.result);
            setDataState(updatedState.dataState);
        }
        loadLangMsg(i18n.language);
    }, [i18n.language, gridData,total]);

    useEffect(() => {
        if (selectable) {
            let tempData = gridData?.map((data, index) => {
                return {
                    ...data,
                    selected: selectedState[idGetter(data)] || data.selected || false,
                };
            });
            setData(tempData);
        } else {
            setData(gridData);
        }
    }, [selectedState, gridData]);

    // const reactToPrintContent = useCallback(() => {
    //     return printRef.current;
    // }, [printRef.current]);
    //
    // const handlePrint = useReactToPrint({
    //     content: reactToPrintContent,
    //     documentTitle: "AwesomeFileName",
    //     removeAfterPrint: true
    // });

    useEffect(() => {
        initialState.dataState.take = parseInt(take);
        initialState.dataState.skip = skip;
        initialState.result.data = data;
        setResult(initialState.result);
    }, [data, take, skip,total]);

    // function clearAllFilterClass() {
    //     const filterButton = document.querySelectorAll('.k-grid-header-menu');
    //     filterButton.forEach(btn => {
    //         btn.classList.remove('open-filter');
    //     });
    // }

    // useEffect(() => {
    //     const filterButton = document.querySelectorAll('.k-grid-header-menu');
    //     window.addEventListener('blur', blurDoc);
    //
    //     function blurDoc() {
    //         clearAllFilterClass()
    //     }
    //
    //     function toggleFilterClass(e) {
    //         let btnClick = e.target.closest('.k-grid-header-menu')
    //         filterButton.forEach(btn => {
    //             if (btn === btnClick) {
    //                 btnClick.classList.toggle('open-filter')
    //             } else {
    //                 btn.classList.remove('open-filter');
    //             }
    //         });
    //
    //     }
    //
    //     function removeFilterClass(e) {
    //         if (e.target.closest('.k-actions')&&!(!!e.target.classList.contains('k-actions')&&!!e.target.querySelector('button:disabled'))) {
    //             clearAllFilterClass()
    //         } else if (!(e.target.closest('.k-grid-header-menu')) && !(e.target.closest('.k-animation-container')) && !(e.target.closest('.rmdp-day'))) {
    //             clearAllFilterClass()
    //         }
    //     }
    //     window.addEventListener('click', removeFilterClass);
    //     filterButton.forEach(btn => {
    //         btn.addEventListener('click', toggleFilterClass, false);
    //     });
    //     setGridW(gridContainer?.current?.offsetWidth - 37)
    //     return () => {
    //         window.removeEventListener('blur', blurDoc);
    //         window.removeEventListener('click', removeFilterClass);
    //         filterButton.forEach(btn => {
    //             btn.removeEventListener('click', toggleFilterClass);
    //         });
    //     }
    // }, [])

    const componentRef = React.useRef();

    useEffect(() => {
        if (Object.keys(dependentField)?.length && data?.length) {
            let temp = chartDependent?.map((field) => {
                let obj1 = dependentField[field.value]
                    ? {
                        name: field.title,
                        data: data?.map((item) => item[field.value]),
                    }
                    : null;
                return obj1;
            });
            temp = temp.filter((item) => item != null);
            setChartSeries(temp);
        }
    }, [dependentField, data]);

    function clickRow(e) {
        if (coloring) {
            let td = e.syntheticEvent.target.closest("tr").querySelectorAll("td");
            td.forEach((item) => {
                if (item.classList.contains("row-custom-bg")) {
                    item.classList.remove("row-custom-bg");
                } else {
                    item.classList.add("row-custom-bg");
                }
            });
        }
        if (activeClickRow && !coloring) {
            getClickRow(e);
        }
    }

    useEffect(() => {
        if (chartDependent?.length && dependentField?.length && data?.length) {
            let temp = chartDependent?.map((field) => {
                let obj1 = dependentField[field.value]
                    ? {
                        name: field.title,
                        data: data?.map((item) => {
                            let temp =
                                item[field.value] instanceof Date
                                    ? getLangDate(i18n.language, item[field.value])
                                    : item[field.value];
                            return `${temp}`;
                        }),
                    }
                    : null;
                return obj1;
            });
            temp = temp.filter((item) => item != null);
            setChartSeries(temp);
        }
    }, [dependentField, i18n.language]);

    useEffect(() => {
        if (mainChartField?.length && excelData?.length) {
            let temp = excelData?.map((item) => {
                let temp =
                    item[mainChartField] instanceof Date
                        ? getLangDate(i18n.language, item[mainChartField])
                        : item[mainChartField];
                return `${temp}`;
            });
            setXaxis(temp);
            setPieLabels(temp);
        }
    }, [mainChartField, i18n.language, excelData]);

    useEffect(() => {
        if (pieDependent?.length && excelData?.length) {
            let temp = excelData?.map((item) => item[pieDependent]);
            setPieSeries(temp);
        }
    }, [pieDependent, excelData]);

    useEffect(() => {
        let settingTemp = {
            mainChartField: mainChartField,
            chartType: chartType,
            chartMap: chartMap,
            chartGrid: chartGrid,
        };

        if (chartType === "pie") {
            settingTemp.pieDependent = pieDependent;
            showChart &&
            localStorage.setItem(`chart_${gridId}`, JSON.stringify(settingTemp));
        } else {
            settingTemp.dependentField = dependentField;
            showChart &&
            localStorage.setItem(`chart_${gridId}`, JSON.stringify(settingTemp));
        }
    }, [
        mainChartField,
        pieDependent,
        dependentField,
        chartType,
        chartGrid,
        chartMap,
    ]);

    useEffect(() => {
        let settingTemp = {
            fields: fields,
            take: take,
            rowColor1: rowColor1,
            rowColor2: rowColor2,
        };
        showSetting &&
        localStorage.setItem(`settings_${gridId}`, JSON.stringify(settingTemp));
    }, [fields, rowColor1, rowColor2, take]);

    useEffect(() => {
        if (!!pageable) {
            let page = Math.floor(skip / take) + 1;
            let params = {};
            if(!disableQueryString){
                const urlParams = new URLSearchParams(location?.search.substring(1));
                params = Object.fromEntries(urlParams);
            }else{
                params=search2
            }
            if (skip !== (parseInt(paramsT?.PageNumber) - 1) * parseInt(paramsT?.PageSize)) {
                params.PageNumber = page;
            }
            if (take !== parseInt(paramsT?.PageSize)) {
                params.PageSize = take;
            }
            if(!disableQueryString){
                setSearch(params)
            }else{
                setSearch2(params)
                getParams(params)
            }
            // if(paramsT.PageNumber!=page&&paramsT.PageSize!=take){
            //   console.log('params....useeffect...',params)
            //
            // }

        }


    }, [take, skip]);

    useEffect(() => {
        if (!!pageable) {
            let params = {};
            if(!disableQueryString){
                const urlParams = new URLSearchParams(location?.search.substring(1));
                params = Object.fromEntries(urlParams);
            }else{
                params=search2
            }
            let pageSize = parseInt(params?.PageSize) || take;
            let pageNumber = parseInt(params?.PageNumber) || 1;
            if (pageSize !== take) {
                setTake(pageSize);
                setTakeTemp(pageSize);
            }
            if (!params?.PageSize) {
                setSkip(0)
            } else {
                let s = (parseInt(params?.PageNumber) - 1) * parseInt(params?.PageSize)
                if (!!total) {
                    if (pageNumber <= Math.ceil(total / parseInt(params?.PageSize))) {
                        setSkip(s)
                    } else {
                        setSkip(0)
                    }
                } else {
                    setSkip(0)
                }
            }
        }

    }, [location]);

    useEffect(() => {
        showPrint &&
        localStorage.setItem(`print_${gridId}`, JSON.stringify(printField));
    }, [printField]);

    const pageChange = (event) => {
        setSkip(event.page.skip);
    };

    useEffect(() => {
        let selected = data?.filter((item) => item.selected === true);
        let deselected=data?.filter((item) => item.selected === false);
        let deselectedKeys=deselected.map((item)=>item[selectKeyField])
        let selectedKeys=selected.map((item)=>item[selectKeyField])
        let selectedRowsTemp=selectedRows.filter(f=>!deselectedKeys.includes(f[selectKeyField]))
        if(selectionMode==='single'){
            if(selected.length){
                setSelectedRows([...selected])
            }else if(!Object.keys(selectedState).length){
                setSelectedRows([])
            }

        }else{
            selectedRowsTemp=selectedRowsTemp.filter(f=>!selectedKeys.includes(f[selectKeyField]))
            setSelectedRows([...selectedRowsTemp,...selected])
        }


    }, [data, selectedState]);


    useEffect(() => {
        selectable && getSelectedRows && getSelectedRows(selectedRows);
    }, [selectedRows]);

    useImperativeHandle(ref, () => {
        return {
            clearSelectedList(){
                setSelectedRows([])
                setSelectedState({})
            }
        };
    }, []);


    // --------selection-----
    const idGetter = getter(selectKeyField);

    const onSelectionChange = React.useCallback(
        (event) => {
            if (selectionMode === "single" && event?.dataItem?.selected) {
                setSelectedState({});
            } else {
                const newSelectedState = getSelectedState({
                    event,
                    selectedState: selectedState,
                    dataItemKey: selectKeyField,
                });
                setSelectedState(newSelectedState);
            }
        },
        [selectedState]
    );

    const onHeaderSelectionChange = React.useCallback(
        (event) => {
            const checkboxElement = event.syntheticEvent.target;
            const checked = checkboxElement.checked;
            const newSelectedState = {};
            event?.dataItems?.forEach((item) => {
                newSelectedState[idGetter(item)] = checked;
            });
            setSelectedState({...selectedState, ...newSelectedState});
        },
        [selectedState]
    );

    useEffect(() => {
        let div = gridContainer?.current?.querySelector("tr.k-grid-norecords td");
        if (div?.innerHTML) {
            if (loading) {
                div.innerHTML = `<div class="k-loading-mask">
                    <span class="k-loading-text">Loading</span>
                    <div class="k-loading-image" />
                    <div class="k-loading-color" />
                </div>`;
            } else {
                if (!gridData.length) {
                    div.innerHTML = `<div class="div-pda">${t(
                        "داده ای موجود نیست"
                    )}</div>`;
                }
            }
        }
    }, [loading]);

    // --------selection-----


    return (
        <>
            <div
                style={{
                    backgroundColor: `${theme.palette.background.paper}`,
                    padding: "20px",
                }}
                ref={componentRef}
            >
                <div className="grid-setting">
                    <div className="row mb-1 justify-content-between">
                        <div className="col-5 d-flex">
                            {showSetting && (
                                <div className="grid-btn-section-item">
                                    <Tooltip title={t("تنظیمات")} arrow>
                                        <Button
                                            aria-describedby={idSetting}
                                            variant="outlined"
                                            className="kendo-setting-btn"
                                            onClick={(e) => setAnchorSetting(e.currentTarget)}
                                            disabled={!result?.data?.length}
                                        >
                                            <SettingsIcon/>
                                        </Button>
                                    </Tooltip>
                                    <Popover
                                        id={idSetting}
                                        open={openSetting}
                                        anchorEl={anchorSetting}
                                        onClose={() => setAnchorSetting(null)}
                                        anchorOrigin={{
                                            vertical: "bottom",
                                            horizontal: i18n.dir() === "rtl" ? "right" : "left",
                                        }}
                                        transformOrigin={{
                                            vertical: "top",
                                            horizontal: i18n.dir() === "rtl" ? "right" : "left",
                                        }}
                                        PaperProps={{
                                            style: {width: "460px"},
                                        }}
                                        sx={{direction: i18n.dir()}}
                                        className="grid-popover"
                                    >
                                        <div className="row">
                                            <div className="col-5">
                                                <h5 className="popover-title">
                                                    {t("ستون های قابل نمایش")}
                                                </h5>
                                                <ul className="field-list">
                                                    {columnsObj?.map((item, index) => {
                                                        return (
                                                            <li key={index}>
                                                                <FormControlLabel
                                                                    control={
                                                                        <Checkbox
                                                                            checked={!!fields[item.value]?.grid}
                                                                            onChange={(event) => {
                                                                                let temp = {...fields};
                                                                                temp[item.value].grid =
                                                                                    event.target.checked;
                                                                                setFields(temp);
                                                                            }}
                                                                            name="checked"
                                                                            color="primary"
                                                                            size="small"
                                                                        />
                                                                    }
                                                                    label={
                                                                        <Typography variant="h6">
                                                                            {item.title}
                                                                        </Typography>
                                                                    }
                                                                />
                                                            </li>
                                                        );
                                                        // }
                                                    })}
                                                </ul>
                                            </div>
                                            <div className="col-7">
                                                <h5 className="popover-title">{t("تنظیمات")}</h5>
                                                <div className="content form-design p-0">
                                                    <div className="title">
                                                        <span>{t("تعداد سطر در صفحه")}</span>
                                                    </div>
                                                    <div className="wrapper">
                                                        <div className="d-flex">
                                                            <NumericTextBox
                                                                className="form-input"
                                                                type="number"
                                                                id="take"
                                                                name="take"
                                                                onChange={(e) =>
                                                                    setTakeTemp(parseInt(e.target.value))
                                                                }
                                                                value={takeTemp}
                                                            />
                                                            <Button
                                                                variant="outlined"
                                                                color="primary"
                                                                onClick={() => {
                                                                    setAnchorSetting(null);
                                                                    setTake(takeTemp);
                                                                }}
                                                                style={{
                                                                    marginRight: i18n.dir() === "rtl" ? "7px" : 0,
                                                                    marginLeft: i18n.dir() === "rtl" ? 0 : "7px",
                                                                    height: "30px",
                                                                }}
                                                            >
                                                                {t("اعمال")}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <h5 className="popover-title mt-5">
                                                    {t("رنگ آمیزی سطرهای جدول")}
                                                </h5>
                                                <div className="content">
                                                    <div className="row">
                                                        <div className="col-6">
                                                            <div className="title">
                                                                <span>{t("سطرهای فرد")}</span>
                                                            </div>
                                                            <div
                                                                onClick={(e) => {
                                                                    let btn =
                                                                        colorPicker1.current.element.querySelector(
                                                                            "button"
                                                                        );
                                                                    if (
                                                                        !e.target.closest(".k-animation-container")
                                                                    ) {
                                                                        btn.click();
                                                                    }
                                                                }}
                                                            >
                                                                <ColorPicker
                                                                    ref={colorPicker1}
                                                                    view="gradient"
                                                                    value={rowColor1}
                                                                    onChange={(c) => setRowColor1(c.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-6">
                                                            <div className="title">
                                                                <span>{t("سطرهای زوج")}</span>
                                                            </div>
                                                            <div
                                                                onClick={(e) => {
                                                                    let btn =
                                                                        colorPicker2.current.element.querySelector(
                                                                            "button"
                                                                        );
                                                                    if (
                                                                        !e.target.closest(".k-animation-container")
                                                                    ) {
                                                                        btn.click();
                                                                    }
                                                                }}
                                                            >
                                                                <ColorPicker
                                                                    ref={colorPicker2}
                                                                    view="gradient"
                                                                    value={rowColor2}
                                                                    onChange={(c) => setRowColor2(c.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row align-items-center mt-3">
                                                        <div className="col-8">
                                                            <FormControlLabel
                                                                control={
                                                                    <Checkbox
                                                                        checked={!!coloring}
                                                                        onChange={(event) => {
                                                                            setColoring(event.target.checked);
                                                                        }}
                                                                        name="checked"
                                                                        color="primary"
                                                                        size="small"
                                                                    />
                                                                }
                                                                label={
                                                                    <Typography variant="h6">
                                                                        {t("رنگ آمیزی سطر با کلیک")}
                                                                    </Typography>
                                                                }
                                                            />
                                                        </div>

                                                        <div className="col-4">
                                                            <div
                                                                onClick={(e) => {
                                                                    let btn =
                                                                        colorPicker3.current.element.querySelector(
                                                                            "button"
                                                                        );
                                                                    if (
                                                                        !e.target.closest(".k-animation-container")
                                                                    ) {
                                                                        btn.click();
                                                                    }
                                                                }}
                                                            >
                                                                <ColorPicker
                                                                    ref={colorPicker3}
                                                                    view="gradient"
                                                                    value={rowClickColor}
                                                                    onChange={(c) => setRowClickColor(c.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex justify-content-center mt-3">
                                                        <Button
                                                            variant="outlined"
                                                            color="error"
                                                            onClick={() => {
                                                                setColoring(false);
                                                                setRowColor1("");
                                                                setRowColor2("");
                                                                setRowClickColor("");
                                                                gridContainer?.current
                                                                    ?.querySelectorAll("tbody tr")
                                                                    ?.forEach((item) => {
                                                                        item.removeAttribute("style");
                                                                    });
                                                                let settingTemp = {
                                                                    fields: fields,
                                                                    take: take,
                                                                    rowColor1: "",
                                                                    rowColor2: "",
                                                                };
                                                                showSetting &&
                                                                localStorage.setItem(
                                                                    `settings_${gridId}`,
                                                                    JSON.stringify(settingTemp)
                                                                );
                                                                setColoring(false);
                                                            }}
                                                            style={
                                                                i18n.dir() === "rtl"
                                                                    ? {marginRight: "10px"}
                                                                    : {marginLeft: "10px"}
                                                            }
                                                        >
                                                            {t("پاک کردن رنگ آمیزی ها")}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Popover>
                                </div>
                            )}
                            {showFilter && (
                                <div className="grid-btn-section-item">
                                    <Tooltip title={t("فیلتر")} arrow>
                                        <Button
                                            aria-describedby={idFilter}
                                            variant="outlined"
                                            className="kendo-setting-btn"
                                            // style={
                                            //     i18n.dir() === "rtl"
                                            //         ? {marginRight: "10px"}
                                            //         : {marginLeft: "10px"}
                                            // }
                                            onClick={(e) => setAnchorFilter(e.currentTarget)}
                                            // disabled={!result?.data?.length}
                                        >
                                            <FilterAltIcon/>
                                        </Button>
                                    </Tooltip>
                                    <Popover
                                        id={idFilter}
                                        open={openFilter}
                                        anchorEl={anchorFilter}
                                        onClose={() => setAnchorFilter(null)}
                                        anchorOrigin={{
                                            vertical: "bottom",
                                            horizontal: i18n.dir() === "rtl" ? "right" : "left",
                                        }}
                                        transformOrigin={{
                                            vertical: "top",
                                            horizontal: i18n.dir() === "rtl" ? "right" : "left",
                                        }}
                                        PaperProps={{
                                            style: {width: "500px", minHeight: "390px"},
                                        }}
                                        sx={{direction: i18n.dir()}}
                                        className="grid-popover"
                                    >
                                        <div className="form-design filter-popover">
                                            <div className="row">
                                                <div className="col-12">
                                                    <div className="row">
                                                        <div className="col-5">
                                                            <h5 className="popover-title">
                                                                {t("ستون های قابل فیلتر")}
                                                            </h5>
                                                            <Tabs
                                                                orientation="vertical"
                                                                variant="scrollable"
                                                                value={tabValue}
                                                                onChange={handleChange}
                                                                aria-label="Vertical tabs example"
                                                                sx={{
                                                                    borderRight: i18n.dir() === "rtl" ? 0 : 1,
                                                                    borderLeft: i18n.dir() === "rtl" ? 1 : 0,
                                                                    borderColor: "divider",
                                                                    maxHeight: "300px",
                                                                    direction: i18n.dir(),
                                                                    "& .MuiTabs-indicator": {
                                                                        right: i18n.dir() === "rtl" ? "unset" : 0,
                                                                        left: i18n.dir() === "rtl" ? 0 : "unset",
                                                                    },
                                                                    "& button": {
                                                                        alignItems: "flex-start",
                                                                        textAlign: "start",
                                                                    },
                                                                }}
                                                            >
                                                                {formFields.map((item, index) => (
                                                                    <Tab
                                                                        key={index}
                                                                        label={
                                                                            <div className="d-flex align-items-center">
                                                                                {formik.values[item.field].value1 ||
                                                                                formik.values[item.field].value2 ||
                                                                                (item.filter === "boolean" &&
                                                                                    (formik.values[item.field].isTrue ||
                                                                                        formik.values[item.field]
                                                                                            .isFalse)) ? (
                                                                                    <CheckCircleOutlineIcon
                                                                                        fontSize="small"
                                                                                        sx={{
                                                                                            marginLeft:
                                                                                                i18n.dir() === "rtl"
                                                                                                    ? "8px"
                                                                                                    : 0,
                                                                                            marginRight:
                                                                                                i18n.dir() === "rtl"
                                                                                                    ? 0
                                                                                                    : "8px",
                                                                                            color: "#1890ff",
                                                                                        }}
                                                                                    />
                                                                                ) : (
                                                                                    <PanoramaFishEyeIcon
                                                                                        fontSize="small"
                                                                                        sx={{
                                                                                            marginLeft:
                                                                                                i18n.dir() === "rtl"
                                                                                                    ? "8px"
                                                                                                    : 0,
                                                                                            marginRight:
                                                                                                i18n.dir() === "rtl"
                                                                                                    ? 0
                                                                                                    : "8px",
                                                                                            color: "#ebebeb",
                                                                                        }}
                                                                                    />
                                                                                )}
                                                                                {t(item.name)}
                                                                            </div>
                                                                        }
                                                                        {...a11yProps(index)}
                                                                    />
                                                                ))}
                                                            </Tabs>
                                                        </div>
                                                        <div className="col-7">
                                                            <h5 className="popover-title">
                                                                {t("فیلتر")} {t(formFields[tabValue]?.name)}
                                                            </h5>
                                                            {tabValue === null ? (
                                                                <div
                                                                    className="d-flex align-items-center justify-content-center h-100"
                                                                    style={{minHeight: "255px"}}
                                                                >
                                                                    <img
                                                                        src={
                                                                            theme.palette.mode === "dark"
                                                                                ? filterIconDark
                                                                                : filterIcon
                                                                        }
                                                                        alt={t("فیلتر")}
                                                                        className="filter-icon"
                                                                    />
                                                                </div>
                                                            ) : (
                                                                formFields.map((item, index) => (
                                                                    <TabPanel
                                                                        key={index}
                                                                        value={tabValue}
                                                                        index={index}
                                                                    >
                                                                        {item.filter === "date" ? (
                                                                            <DateFilter
                                                                                formik={formik}
                                                                                field={item.field}
                                                                            />
                                                                        ) : item.filter === "time" ? (
                                                                            <TimeFilter
                                                                                formik={formik}
                                                                                field={item.field}
                                                                            />
                                                                        ) : item.filter === "numeric" ? (
                                                                            <NumericFilter
                                                                                formik={formik}
                                                                                field={item.field}
                                                                            />
                                                                        ) : item.filter === "boolean" ? (
                                                                            <BooleanFilter
                                                                                formik={formik}
                                                                                field={item.field}
                                                                            />
                                                                        ) : item.filter === "none" ? (
                                                                            <></>
                                                                        ) : (
                                                                            <StringFilter
                                                                                formik={formik}
                                                                                field={item.field}
                                                                            />
                                                                        )}
                                                                    </TabPanel>
                                                                ))
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-12 d-flex justify-content-center mb-0 mt-3">
                                                    <Button
                                                        variant="contained"
                                                        color="success"
                                                        type={"button"}
                                                        onClick={() => {
                                                            formik.handleSubmit();
                                                            setAnchorFilter(null);
                                                            setFilterSet(true);
                                                        }}
                                                        disabled={Object.values(formik.values).every(
                                                            (s) =>
                                                                !s?.value1 &&
                                                                !s?.value2 &&
                                                                !s?.isTrue &&
                                                                !s?.isFalse
                                                        )}
                                                    >
                                                        {t("اعمال فیلتر")}
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="error"
                                                        onClick={() => {
                                                            let params = {};
                                                            if(!disableQueryString){
                                                                const urlParams = new URLSearchParams(location?.search.substring(1));
                                                                params = Object.fromEntries(urlParams);
                                                            }else{
                                                                params=search2
                                                            }
                                                            let qs = getFilterValuesObj(formik.values);
                                                            Object.keys(qs).forEach((q) => {
                                                                delete params[q];
                                                            });
                                                            if(!disableQueryString){
                                                                setSearch(params)
                                                            }else{
                                                                setSearch2(params)
                                                                getParams(params)
                                                            }
                                                            formik.resetForm();
                                                            setAnchorFilter(null);
                                                            setTabValue(null);
                                                            setFilterSet(false);
                                                        }}
                                                        disabled={!filterSet}
                                                        style={
                                                            i18n.dir() === "rtl"
                                                                ? {marginRight: "10px"}
                                                                : {marginLeft: "10px"}
                                                        }
                                                    >
                                                        {t("حذف فیلتر")}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </Popover>
                                </div>
                            )}
                            {extraBtn}
                        </div>
                        <div className="col-7">
                            <div className="d-flex justify-content-end grid-btn-section">
                                {extraBtnSecond}
                                {showAdd && (
                                    <div className="grid-btn-section-item">
                                        <Tooltip title={addTitle} arrow>
                                            <Button variant="outlined" className="kendo-setting-btn" disabled={addBtnDisabled}>
                                                <Link to={addUrl}>
                                                    <AddIcon/>
                                                </Link>
                                            </Button>
                                        </Tooltip>
                                    </div>
                                )}
                                {showChart && (
                                    <div className="grid-btn-section-item">
                                        <Tooltip title={t("نمودار")} arrow>
                                            <Button
                                                aria-describedby={idChart}
                                                variant="outlined"
                                                className="kendo-setting-btn"
                                                onClick={(e) => setAnchorChart(e.currentTarget)}
                                                disabled={!result?.data?.length}
                                            >
                                                <BarChartIcon/>
                                            </Button>
                                        </Tooltip>
                                        <Popover
                                            id={idChart}
                                            open={openChart}
                                            anchorEl={anchorChart}
                                            onClose={() => setAnchorChart(null)}
                                            anchorOrigin={{
                                                vertical: "bottom",
                                                horizontal: i18n.dir() === "rtl" ? "left" : "right",
                                            }}
                                            transformOrigin={{
                                                vertical: "top",
                                                horizontal: i18n.dir() === "rtl" ? "left" : "right",
                                            }}
                                            PaperProps={{
                                                style: {width: "700px", maxWidth: "100vw"},
                                            }}
                                            sx={{direction: i18n.dir()}}
                                            className="grid-popover chart"
                                        >
                                            <div className="row">
                                                <div className="col-sm-4 col-12">
                                                    <h5 className="popover-title">{t("تنظیمات")}</h5>
                                                    <div className="title">
                                                        <span>{t("نوع نمودار")}</span>
                                                    </div>
                                                    <SelectBox
                                                        dataSource={chartTypes}
                                                        rtlEnabled={i18n.dir() === "rtl" }
                                                        onValueChanged={(e) => setChartType(e.value)}
                                                        defaultValue={chartType}
                                                        className="selectBox"
                                                        noDataText={t("اطلاعات یافت نشد")}
                                                        itemRender={Item}
                                                        valueExpr="value"
                                                        displayExpr="name"
                                                        placeholder={""}
                                                        name="chartType"
                                                        id="chartType"
                                                        searchEnabled
                                                    />
                                                    <div>
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox
                                                                    checked={!!chartMap}
                                                                    onChange={(event) =>
                                                                        setChartMap(event.target.checked)
                                                                    }
                                                                    name="chartMap"
                                                                    color="primary"
                                                                    size="small"
                                                                />
                                                            }
                                                            label={
                                                                <Typography variant="h6">
                                                                    {t("نمایش نقشه راهنما")}
                                                                </Typography>
                                                            }
                                                            className="mt-3"
                                                        />
                                                    </div>
                                                    <div>
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox
                                                                    checked={!!chartGrid}
                                                                    onChange={(event) =>
                                                                        setChartGrid(event.target.checked)
                                                                    }
                                                                    name="chartGrid"
                                                                    color="primary"
                                                                    size="small"
                                                                />
                                                            }
                                                            label={
                                                                <Typography variant="h6">
                                                                    {t("نمایش خطوط راهنما")}
                                                                </Typography>
                                                            }
                                                            className="mt-3"
                                                        />
                                                    </div>

                                                    <div className="title mt-3">
                                                        <span>{t("مولفه اصلی")}</span>
                                                    </div>
                                                    <SelectBox
                                                        dataSource={chartObj}
                                                        value={mainChartField}
                                                        rtlEnabled={i18n.dir() == "ltr" ? false : true}
                                                        onValueChanged={(e) => setMainChartField(e.value)}
                                                        className="selectBox"
                                                        noDataText={t("اطلاعات یافت نشد")}
                                                        itemRender={null}
                                                        displayExpr="title"
                                                        valueExpr="value"
                                                        placeholder={""}
                                                        name="chartType"
                                                        id="chartType"
                                                        searchEnabled
                                                    />
                                                    <h2 className="title mt-3">{t("مولفه وابسته")}</h2>
                                                    <ul className="field-list">
                                                        {chartType === "pie" ? (
                                                            <RadioGroup
                                                                name="pie-field"
                                                                defaultChecked={pieDependent}
                                                                defaultValue={pieDependent}
                                                                onChange={(e) =>
                                                                    setPieDependent(e.target.defaultValue)
                                                                }
                                                            >
                                                                {chartDependent?.map(
                                                                    (item, index) =>
                                                                        mainChartField !== item.value && (
                                                                            <li key={index}>
                                                                                <FormControlLabel
                                                                                    value={item.value}
                                                                                    control={<Radio/>}
                                                                                    label={item.title}
                                                                                />
                                                                            </li>
                                                                        )
                                                                )}
                                                            </RadioGroup>
                                                        ) : (
                                                            chartDependent?.map(
                                                                (item, index) =>
                                                                    mainChartField !== item.value && (
                                                                        <li key={index}>
                                                                            <FormControlLabel
                                                                                control={
                                                                                    <Checkbox
                                                                                        checked={
                                                                                            !!dependentField[item.value]
                                                                                        }
                                                                                        onChange={(event) => {
                                                                                            let temp = {...dependentField};
                                                                                            temp[item.value] =
                                                                                                event.target.checked;
                                                                                            setDependentField(temp);
                                                                                        }}
                                                                                        name="checked"
                                                                                        color="primary"
                                                                                        size="small"
                                                                                    />
                                                                                }
                                                                                label={
                                                                                    <Typography variant="h6">
                                                                                        {item.title}
                                                                                    </Typography>
                                                                                }
                                                                            />
                                                                        </li>
                                                                    )
                                                            )
                                                        )}
                                                    </ul>
                                                </div>
                                                <div
                                                    className="col-sm-8 col-12"
                                                    style={{minHeight: "360px"}}
                                                >
                                                    <h5 className="popover-title">{t("پیش نمایش")}</h5>
                                                    {chartSeries?.length &&
                                                    xaxis?.length &&
                                                    chartType !== "pie" ? (
                                                        <>
                                                            <div
                                                                style={{direction: "ltr"}}
                                                                className={
                                                                    i18n.dir() === "rtl" ? "rtl-chart" : ""
                                                                }
                                                            >
                                                            </div>
                                                        </>
                                                    ) : pieDependent &&
                                                    mainChartField &&
                                                    chartType === "pie" ? (
                                                        <div
                                                            style={{direction: "ltr"}}
                                                            className={
                                                                i18n.dir() === "rtl" ? "rtl-chart" : ""
                                                            }
                                                        >
                                                        </div>
                                                    ) : (
                                                        <div
                                                            className="d-flex align-items-center justify-content-center h-100">
                                                            <img src={chartPreview} alt={t("نمودار")}/>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="col-12">
                                                    <h5 className="popover-title">
                                                        {t("نمودارهای ذخیره شده")}
                                                    </h5>
                                                    <div className="row">
                                                        <div className="col-12 col-sm-10">
                                                            {savedCharts?.map((item, index) => (
                                                                <div className="saved-item d-flex" key={index}>
                                                                    <span className="index">{index + 1}</span>
                                                                    <span className="title">{item.title}</span>
                                                                    <FormControlLabel
                                                                        control={
                                                                            <Checkbox
                                                                                checked={!!savedCharts[index].dashboard}
                                                                                onChange={(event) => {
                                                                                    let temp = savedCharts;
                                                                                    temp[index].dashboard =
                                                                                        event.target.checked;
                                                                                    setSavedCharts([...temp]);
                                                                                }}
                                                                                name={`savedCharts[${index}].dashboard`}
                                                                                color="primary"
                                                                                size="small"
                                                                            />
                                                                        }
                                                                        label={
                                                                            <Typography variant="h6">
                                                                                {t("نمایش در داشبورد")}
                                                                            </Typography>
                                                                        }
                                                                    />
                                                                    <IconButton
                                                                        variant="contained"
                                                                        color="primary"
                                                                        className="kendo-action-btn"
                                                                        onClick={() => console.log("view")}
                                                                    >
                                                                        <VisibilityIcon/>
                                                                    </IconButton>
                                                                    <IconButton
                                                                        variant="contained"
                                                                        color="error"
                                                                        className="kendo-action-btn"
                                                                        onClick={() => {
                                                                            let temp = savedCharts.filter(
                                                                                (s) => s.title !== item.title
                                                                            );
                                                                            setSavedCharts(temp);
                                                                        }}
                                                                    >
                                                                        <DeleteIcon/>
                                                                    </IconButton>
                                                                </div>
                                                            ))}
                                                            <div className="d-flex mt-2">
                                                                <div style={{width: "70%"}}>
                                                                    <div className="form-design p-0">
                                                                        <div className="title">
                                                                            <span>{t("عنوان")}</span>
                                                                        </div>
                                                                        <input
                                                                            className="form-input"
                                                                            type="text"
                                                                            id="title"
                                                                            name="title"
                                                                            onChange={(e) =>
                                                                                setNewChart(e.target.value)
                                                                            }
                                                                            value={newChart}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    style={
                                                                        i18n.dir() === "rtl"
                                                                            ? {marginRight: "10px"}
                                                                            : {marginLeft: "10px"}
                                                                    }
                                                                >
                                                                    <div className="form-design p-0">
                                                                        <div className="title">
                                                                            <span>‌</span>
                                                                        </div>
                                                                        <Button
                                                                            variant="outlined"
                                                                            color="success"
                                                                            onClick={() => {
                                                                                setSavedCharts((s) => [
                                                                                    ...s,
                                                                                    {
                                                                                        title: newChart,
                                                                                        dashboard: false,
                                                                                    },
                                                                                ]);
                                                                                setNewChart("");
                                                                            }}
                                                                            style={{
                                                                                padding: "3px 15px 4px",
                                                                                fontSize: "12px",
                                                                            }}
                                                                        >
                                                                            {t("ذخیره نمودار")}
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-12 d-flex justify-content-center">
                                                    <Button
                                                        variant="contained"
                                                        color="success"
                                                        onClick={() => {
                                                            setAnchorChart(null);
                                                        }}
                                                    >
                                                        <Link
                                                            to={`${pathname}/Chart?id=${gridId}`}
                                                            target={"_blank"}
                                                            className={"link-tag"}
                                                        >
                                                            {t("باز کردن نمودار")}
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="error"
                                                        onClick={() => {
                                                            setAnchorChart(null);
                                                        }}
                                                        style={
                                                            i18n.dir() === "rtl"
                                                                ? {marginRight: "10px"}
                                                                : {marginLeft: "10px"}
                                                        }
                                                    >
                                                        {t("انصراف")}
                                                    </Button>
                                                </div>
                                            </div>
                                        </Popover>
                                    </div>
                                )}
                                {showExcelExport && (
                                    <div className="grid-btn-section-item">
                                        <Tooltip title={t("خروجی اکسل")} arrow>
                                            <Button
                                                aria-describedby={idEcxel}
                                                variant="outlined"
                                                className="kendo-setting-btn"
                                                onClick={(e) => setAnchorEcxel(e.currentTarget)}
                                                disabled={!excelData?.length}
                                            >
                                                <IconFileSpreadsheet/>
                                            </Button>
                                        </Tooltip>

                                        <Popover
                                            id={idEcxel}
                                            open={openEcxel}
                                            anchorEl={anchorEcxel}
                                            onClose={() => setAnchorEcxel(null)}
                                            anchorOrigin={{
                                                vertical: "bottom",
                                                horizontal: i18n.dir() === "rtl" ? "left" : "right",
                                            }}
                                            transformOrigin={{
                                                vertical: "top",
                                                horizontal: i18n.dir() === "rtl" ? "left" : "right",
                                            }}
                                            PaperProps={{
                                                style: {width: "400px"},
                                            }}
                                            sx={{direction: i18n.dir()}}
                                            className="grid-popover"
                                        >
                                            <div className="row">
                                                <div className="col-6">
                                                    <h5 className="popover-title">
                                                        {t("ستون های قابل نمایش")}
                                                    </h5>
                                                    <ul className="field-list">
                                                        {columnsObj?.map((item, index) => {
                                                            // if(item?.parent){
                                                            //     return (<li key={index}>
                                                            //         <FormControlLabel
                                                            //             control={
                                                            //                 <Checkbox
                                                            //                     checked={fields[item.parent][item.value]?.excel}
                                                            //                     onChange={(event) => {
                                                            //                         let temp = { ...fields };
                                                            //                         temp[item.parent][item.value].excel = event.target.checked;
                                                            //                         setFields(temp);
                                                            //                     }
                                                            //                     }
                                                            //                     name="checked"
                                                            //                     color="primary"
                                                            //                     size="small"
                                                            //                 />
                                                            //             }
                                                            //             label={
                                                            //                 <Typography variant="h6">
                                                            //                     {item.title}
                                                            //                 </Typography>
                                                            //             }
                                                            //         />
                                                            //     </li>)
                                                            // }else{
                                                            return (
                                                                <li key={index}>
                                                                    <FormControlLabel
                                                                        control={
                                                                            <Checkbox
                                                                                checked={!!fields[item.value]?.excel}
                                                                                onChange={(event) => {
                                                                                    let temp = {...fields};
                                                                                    temp[item.value].excel =
                                                                                        event.target.checked;
                                                                                    setFields(temp);
                                                                                }}
                                                                                name="checked"
                                                                                color="primary"
                                                                                size="small"
                                                                            />
                                                                        }
                                                                        label={
                                                                            <Typography variant="h6">
                                                                                {item.title}
                                                                            </Typography>
                                                                        }
                                                                    />
                                                                </li>
                                                            );
                                                            // }
                                                        })}
                                                    </ul>
                                                </div>
                                                <div className="col-6">
                                                    <h5 className="popover-title">{t("تنظیمات")}</h5>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={!!filterExcelFields}
                                                                onChange={(event) =>
                                                                    setFilterExcelFields(event.target.checked)
                                                                }
                                                                name="filterExcelFields"
                                                                color="primary"
                                                                size="small"
                                                            />
                                                        }
                                                        label={
                                                            <Typography variant="h6">
                                                                {t("قابل فیلتر شدن")}
                                                            </Typography>
                                                        }
                                                    />
                                                </div>
                                                <div className="col-12 d-flex justify-content-center">
                                                    <Button
                                                        variant="contained"
                                                        color="success"
                                                        onClick={() => {
                                                            excelExport();
                                                            setAnchorEcxel(null);
                                                        }}
                                                    >
                                                        {t("خروجی اکسل")}
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="error"
                                                        onClick={() => {
                                                            setAnchorEcxel(null);
                                                        }}
                                                        style={
                                                            i18n.dir() === "rtl"
                                                                ? {marginRight: "10px"}
                                                                : {marginLeft: "10px"}
                                                        }
                                                    >
                                                        {t("انصراف")}
                                                    </Button>
                                                </div>
                                            </div>
                                        </Popover>
                                    </div>
                                )}
                                {showPrint && (
                                    <div className="grid-btn-section-item">
                                        <Tooltip title={t("چاپ")} arrow>
                                            <Button
                                                aria-describedby={idPrint}
                                                variant="outlined"
                                                className="kendo-setting-btn"
                                                onClick={(e) => setAnchorPrint(e.currentTarget)}
                                                disabled={!data?.length}
                                            >
                                                <IconPrinter/>
                                            </Button>
                                        </Tooltip>
                                        <Popover
                                            id={idPrint}
                                            open={openPrint}
                                            anchorEl={anchorPrint}
                                            onClose={() => setAnchorPrint(null)}
                                            anchorOrigin={{
                                                vertical: "bottom",
                                                horizontal: i18n.dir() === "rtl" ? "left" : "right",
                                            }}
                                            transformOrigin={{
                                                vertical: "top",
                                                horizontal: i18n.dir() === "rtl" ? "left" : "right",
                                            }}
                                            PaperProps={{
                                                style: {width: "250px"},
                                            }}
                                            sx={{direction: i18n.dir()}}
                                            className="grid-popover"
                                        >
                                            <div className="row">
                                                <div className="col-12">
                                                    <h5 className="popover-title">
                                                        {t("ستون های قابل نمایش")}
                                                    </h5>
                                                    <ul className="field-list">
                                                        {columnsObj?.map((item, index) => {
                                                            // if(item?.parent){
                                                            //     return (<li key={index}>
                                                            //         <FormControlLabel
                                                            //             control={
                                                            //                 <Checkbox
                                                            //                     checked={printField[item.parent][item.value]}
                                                            //                     onChange={(event) => {
                                                            //                         let temp = { ...printField };
                                                            //                         temp[item.parent][item.value] = event.target.checked;
                                                            //                         setPrintField(temp);
                                                            //                     }
                                                            //                     }
                                                            //                     name="checked"
                                                            //                     color="primary"
                                                            //                     size="small"
                                                            //                 />
                                                            //             }
                                                            //             label={
                                                            //                 <Typography variant="h6">
                                                            //                     {item.title}
                                                            //                 </Typography>
                                                            //             }
                                                            //         />
                                                            //     </li>)
                                                            // }else{
                                                            return (
                                                                <li key={index}>
                                                                    <FormControlLabel
                                                                        control={
                                                                            <Checkbox
                                                                                checked={!!printField[item.value]}
                                                                                onChange={(event) => {
                                                                                    let temp = {...printField};
                                                                                    temp[item.value] =
                                                                                        event.target.checked;
                                                                                    setPrintField(temp);
                                                                                }}
                                                                                name="checked"
                                                                                color="primary"
                                                                                size="small"
                                                                            />
                                                                        }
                                                                        label={
                                                                            <Typography variant="h6">
                                                                                {item.title}
                                                                            </Typography>
                                                                        }
                                                                    />
                                                                </li>
                                                            );
                                                            // }
                                                        })}
                                                        {/*{columnsObj?.map((item, index) => (*/}
                                                        {/*  <li key={index}>*/}
                                                        {/*      <FormControlLabel*/}
                                                        {/*        control={*/}
                                                        {/*            <Checkbox*/}
                                                        {/*              checked={printField[item.value]}*/}
                                                        {/*              onChange={(event) => {*/}
                                                        {/*                  let temp = { ...printField };*/}
                                                        {/*                  temp[item.value] = event.target.checked;*/}
                                                        {/*                  setPrintField(temp);*/}
                                                        {/*              }*/}
                                                        {/*              }*/}
                                                        {/*              name="checked"*/}
                                                        {/*              color="primary"*/}
                                                        {/*              size="small"*/}
                                                        {/*            />*/}
                                                        {/*        }*/}
                                                        {/*        label={*/}
                                                        {/*            <Typography variant="h6">*/}
                                                        {/*                {item.title}*/}
                                                        {/*            </Typography>*/}
                                                        {/*        }*/}
                                                        {/*      />*/}
                                                        {/*  </li>*/}
                                                        {/*))}*/}
                                                    </ul>
                                                </div>
                                                {/*/!*<div className='col-6'>*!/*/}
                                                {/*/!*  <h5 className="popover-title">*!/*/}
                                                {/*/!*    تنظیمات*!/*/}
                                                {/*/!*  </h5>*!/*/}
                                                {/*/!*  <div className="title">*!/*/}
                                                {/*/!*    <span>{t("اندازه صفحه")}</span>*!/*/}
                                                {/*/!*  </div>*!/*/}
                                                {/*/!*  <SelectBox*!/*/}
                                                {/*/!*    dataSource={pSize}*!/*/}
                                                {/*/!*    rtlEnabled={i18n.dir() == "ltr" ? false : true}*!/*/}
                                                {/*/!*    onValueChanged={(e) => setPrintSize(e.value)}*!/*/}
                                                {/*//     defaultValue={printSize}*/}
                                                {/*//     className='selectBox'*/}
                                                {/*/!*    noDataText={t('اطلاعات یافت نشد')}*!/*/}
                                                {/*/!*    itemRender={null}*!/*/}
                                                {/*/!*    name='pSize'*!/*/}
                                                {/*/!*    id='pSize'*!/*/}
                                                {/*/!*    searchEnabled*!/*/}

                                                {/*/!*  />*!/*/}
                                                {/*/!*</div>*!/*/}
                                                <div className="col-12 d-flex justify-content-center">
                                                    <Button
                                                        variant="contained"
                                                        color="success"
                                                        className={"link-tag-btn"}
                                                        onClick={() => {
                                                            setAnchorPrint(null);
                                                        }}
                                                    >
                                                        <Link
                                                            to={`${pathname}/Print?id=${gridId}`}
                                                            target={"_blank"}
                                                            className={"link-tag"}
                                                        >
                                                            {t("چاپ")}
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="error"
                                                        onClick={() => {
                                                            setAnchorPrint(null);
                                                        }}
                                                        style={
                                                            i18n.dir() === "rtl"
                                                                ? {marginRight: "10px"}
                                                                : {marginLeft: "10px"}
                                                        }
                                                    >
                                                        {t("انصراف")}
                                                    </Button>
                                                </div>
                                            </div>
                                        </Popover>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className={`my-kendo-grid position-relative ${i18n.dir() === "rtl" ? "rtl-grid" : ""} ${
                        !pageable ? "not-pageable" : ""
                    }`}
                    ref={gridContainer}
                >
                    {gridData?.length&&loading?<div className='load-data-sec'>
                        <div className="k-loading-mask">
                            <span className="k-loading-text">Loading</span>
                            <div className="k-loading-image"/>
                            <div className="k-loading-color"/>
                        </div>
                    </div>:null}
                    <LocalizationProvider
                        language={`${
                            i18n.language === "fa"
                                ? "fa-IR"
                                : i18n.language === "ar"
                                    ? "ar"
                                    : "en"
                        }`}
                    >
                        <ExcelExport
                            data={excelData}
                            ref={_export}
                            fileName={`${excelFileName}.xlsx`}
                            filterable={filterExcelFields}
                            dir={i18n.dir()}
                        >
                            {columnList?.map((column, index) => {
                                if (column?.children?.length) {
                                    return (
                                        <React.Fragment key={index}>
                                            {column?.children.map((children, indexC) => {
                                                return (
                                                    fields[column?.field]?.excel && (
                                                        <ExcelExportColumn
                                                            key={indexC}
                                                            field={children.field}
                                                            title={`${t(column.name)}>${t(children.name)}`}
                                                        />
                                                    )
                                                );
                                            })}
                                        </React.Fragment>
                                    );
                                } else {
                                    return (
                                        column.field !== "actionCell" &&
                                        fields[column.field]?.excel && (
                                            <ExcelExportColumn
                                                key={index}
                                                field={column.field}
                                                title={t(column.name)}
                                            />
                                        )
                                    );
                                }
                            })}
                        </ExcelExport>
                        <div>
                            {rowColor1 !== "" && (
                                <style>{`
                .k-grid tbody tr:not(.k-alt) {
                    background-color: ${rowColor1}!important;
                }
               
            `}</style>
                            )}
                            {rowColor2 !== "" && (
                                <style>{`
                .k-grid tbody tr.k-alt {
                    background-color: ${rowColor2}!important;
                }
            `}</style>
                            )}
                            {rowClickColor !== "" && (
                                <style>{`
                .k-grid tbody tr td.row-custom-bg {
                    background-color: ${rowClickColor}!important;
                }
            `}</style>
                            )}
                            <Grid
                                ref={gridRef}
                                total={total}
                                data={result}
                                {...initialState}
                                take={take}
                                skip={skip}
                                onDataStateChange={dataStateChange}
                                sortable={sortable}
                                pageable={pageable}
                                reorderable={reorderable}
                                onRowClick={clickRow}
                                onColumnReorder={columnReorder}
                                dataItemKey={selectKeyField}
                                selectedField={"selected"}
                                selectable={{
                                    enabled: selectable,
                                    drag: false,
                                    cell: false,
                                    mode: selectionMode,
                                }}
                                onSelectionChange={onSelectionChange}
                                onHeaderSelectionChange={onHeaderSelectionChange}
                                sort={sort}
                                onSortChange={sortChange}
                                className={`main-grid ${i18n.dir()} ${
                                    coloring ? "color-pointer" : ""
                                }`}
                                onPageChange={pageChange}
                                // groupable={true}

                                detail={expandDetail && detail}
                                expandField={expandDetail ? expandField : ""}
                                onExpandChange={expandDetail ? onExpandChange : () => {
                                }}



                            >
                                {selectable && !coloring && (
                                    <GridColumn
                                        field={"selected"}
                                        width="40px"
                                        headerCell={selectionMode === "single" && EmptyHeaderCell}
                                        headerSelectionValue={
                                            result?.data?.findIndex(
                                                (item) => !selectedState[idGetter(item)]
                                            ) === -1
                                        }
                                        reorderable={false}
                                        filterable={false}
                                        sortable={false}
                                    />
                                )}
                                {selectable && coloring && (
                                    <GridColumn
                                        field={"notselect"}
                                        width="40px"
                                        headerCell={EmptyHeaderCell}
                                        reorderable={false}
                                        filterable={false}
                                        sortable={false}
                                    />
                                )}

                                {columnArr?.map((column, index) => {
                                    let filter = tempColumn.filter(
                                        (f) => f.field === column.field
                                    );
                                    if (!column?.children?.length) {
                                        return (
                                            (column?.field === "actionCell" ||
                                                fields[column?.field]?.grid) &&
                                            (!!filter[0]?.cell ? (
                                                <GridColumn
                                                    {...column}
                                                    filterable={false}
                                                    key={index}
                                                    title={t(`${column.name}`)}
                                                />
                                            ) : showTooltip ? (
                                                <GridColumn
                                                    {...column}
                                                    filterable={false}
                                                    key={index}
                                                    title={t(`${column.name}`)}
                                                    cell={TooltipCell}
                                                />
                                            ) : (
                                                <GridColumn
                                                    {...column}
                                                    filterable={false}
                                                    key={index}
                                                    title={t(`${column.name}`)}
                                                />
                                            ))
                                        );
                                    } else {
                                        return (
                                            fields[column?.field]?.grid && (
                                                <GridColumn
                                                    key={index}
                                                    {...column}
                                                    filterable={false}
                                                    title={t(`${column.name}`)}
                                                >
                                                    {column?.children.map((children, indexC) => {
                                                        return !!children?.cell ? (
                                                            <GridColumn
                                                                {...children}
                                                                key={indexC}
                                                                filterable={false}
                                                                title={t(`${children.name}`)}
                                                            />
                                                        ) : showTooltip ? (
                                                            <GridColumn
                                                                {...children}
                                                                key={indexC}
                                                                filterable={false}
                                                                title={t(`${children.name}`)}
                                                                cell={TooltipCell}
                                                            />
                                                        ) : (
                                                            <GridColumn
                                                                {...children}
                                                                key={indexC}
                                                                filterable={false}
                                                                title={t(`${children.name}`)}
                                                            />
                                                        );
                                                    })}
                                                </GridColumn>
                                            )
                                        );
                                    }
                                })}
                            </Grid>
                        </div>
                    </LocalizationProvider>
                </div>
            </div>
        </>
    );
});

export default React.memo(DataGrid);

const TooltipCell = (props) => {
    return (
        <td
            className={props?.className}
            colSpan={props?.colSpan}
            style={props?.style}
        >
            <Tooltip title={`${props?.dataItem[props?.field]}`}>
                <div>{props.dataItem[props.field]}</div>
            </Tooltip>
        </td>
    );
};
