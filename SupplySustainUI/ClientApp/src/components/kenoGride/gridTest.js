import React, {useEffect, useRef, useState,useCallback} from "react";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import '@progress/kendo-theme-default/dist/all.css';
import { process } from "@progress/kendo-data-query";
import { ColumnMenu, ColumnMenuCheckboxFilter,DateMenu } from "./ColumnMenu";
import products from "./product.json";
import SettingsIcon from '@mui/icons-material/Settings';
import Checkbox from '@mui/material/Checkbox';
import {
    LocalizationProvider,
} from "@progress/kendo-react-intl";
import { useReactToPrint } from "react-to-print";
import { ExcelExport,ExcelExportColumn } from "@progress/kendo-react-excel-export";
import {useTranslation} from "react-i18next";
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import BarChartIcon from '@mui/icons-material/BarChart';
import Button from '@mui/material/Button';
import {IconFileSpreadsheet,IconPrinter} from '@tabler/icons'
import {FormControlLabel, Radio, RadioGroup} from "@mui/material";
import {getLangDate} from '../../utils/getLangDate'
import {loadLangMsg} from '../../utils/loadLangMsg'
import DateCell from "./DateCell";
import IndexCell from "./IndexCell";
import ActionCell from './ActionCell'
import {SelectBox} from "devextreme-react/select-box";
import { ColorPicker } from "@progress/kendo-react-inputs";
import ReactApexChart from 'react-apexcharts';
import Chart from "../chart";
import PieChart from "../chart/PieChart";
import PieChartIcon from "@mui/icons-material/PieChart";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import {AreaChartOutlined} from "@ant-design/icons";
import ScatterPlotIcon from "@mui/icons-material/ScatterPlot";
import CurrencyCell from '../../components/CurrencyCell'

import preview from '../chart/preview.gif'
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {Link,useNavigate} from "react-router-dom";


const pSize=['A3','A4','A5','B4','B5','letter','landscape','portrait']

const KendoGrid = () => {
    const { t, i18n } = useTranslation();
    const [fields,setFields]=useState({
        IndexCell: {grid:true, excel:true, print:true},
        DocumentCode: {grid:true, excel:true, print:true},
        DocumentBalance:{grid:true, excel:true, print:true},
        DocumentInsertDate:{grid:true, excel:true, print:true},
        DocumentTypeName:{grid:true, excel:true, print:true},
        RefDocumentCode:{grid:true, excel:true, print:true},
        InsertUser:{grid:true, excel:true, print:true},
        LastUpdateUser:{grid:true, excel:true, print:true},
        DocumentDescription:{grid:true, excel:true, print:true},
        DocumentState:{grid:true, excel:true, print:true},

    })

    const columnsObj=[
        {value:"DocumentCode",title:t('کد سند')} ,
        {value:"DocumentBalance",title:t('تراز سند')} ,
        {value:"DocumentInsertDate",title:t('تاریخ اولین سفارش')} ,
        {value:"DocumentTypeName",title:t('نوع سند')} ,
        {value:"RefDocumentCode",title:t('کد سند مرجع در انبار')} ,
        {value:"InsertUser",title:t('درج')} ,
        {value:"LastUpdateUser",title:t('آخرین تغییر')} ,
        {value:"DocumentDescription",title:t('توضیحات سند')} ,
    ]

    const chartObj=[
        {value:"DocumentBalance",title:t('تراز سند')} ,
        {value:"DocumentCode",title:t('کد سند')} ,
    ]

    const settings = JSON.parse(localStorage.getItem('chart'));

    const defaultRowColor1='#fff'
    const defaultRowColor2='#00000014'
    // const defaultRowColor2='#1890ff14'

    const [result, setResult] = useState([]);
    const [take, setTake] = useState(8);
    const [printSize, setPrintSize] = useState(pSize[0]);
    const [filterExcelFields, setFilterExcelFields] = useState(true);
    const [data,setData]=useState([])
    const [autoWidth,setAutoWidth]=useState('100px')
    const [rowColor1,setRowColor1]=useState(defaultRowColor1)
    const [rowColor2,setRowColor2]=useState(defaultRowColor2)
    const [rowClickColor,setRowClickColor]=useState('inherit')
    const [coloring,setColoring]=useState(false)
    const [newChart,setNewChart]=useState('')
    const [savedCharts,setSavedCharts]=useState([
        {title:'تست 1',dashboard:false},
        {title:'تست 2',dashboard:true},
    ])

    const gridContainer=useRef(null)

    const CustomActionCell = (props) => <ActionCell {...props} coloring={coloring} />

    const chartTypes=[
        {name:t('میله‌ای'),value:'bar',icon:<BarChartIcon/>},
        {name:t('دایره‌ای'),value:'pie',icon:<PieChartIcon/>},
        {name:t('خطی'),value:'line',icon:<ShowChartIcon/>},
        {name:t('مساحت'),value:'area',icon:<AreaChartOutlined style={{fontSize:'22px'}}/>},
        {name:t('پراکندگی '),value:'scatter',icon:<ScatterPlotIcon/>},
    ]
    const createDataState = (dataState) => {
        return {
            result: process(data.slice(0), dataState),
            dataState: dataState,
        };
    };

    const [dataState, setDataState] = useState();
    let initialState = createDataState({
        take: take,
        skip: 0,
        // group:[{field:'DocumentBalance'}]
    });

    const dataStateChange = (event) => {
        let updatedState = createDataState(event.dataState);
        setResult(updatedState.result);
        setDataState(updatedState.dataState);
    };


    const [col,setCol]=useState(true)
    const [anchorSetting, setAnchorSetting] = useState(null);
    const [anchorEcxel, setAnchorEcxel] = useState(null);
    const [anchorPrint, setAnchorPrint] = useState(null);
    const [anchorChart, setAnchorChart] = useState(null);
    const [gridW, setGridW] = useState();
    const [excelData, setExcelData] = useState([]);
    // const [settings,setSettings]=useState([])
    const [chartMap, setChartMap] = useState(settings?.chartMap);
    const [chartGrid, setChartGrid] = useState(settings?.chartGrid);
    const [xaxis, setXaxis] = useState([]);
    const [pieSeries,setPieSeries]=useState([])
    const [dependentField,setDependentField]=useState(settings?.dependentField||{
        DocumentBalance:false,
        DocumentCode:false,
    })
    const [pieDependent,setPieDependent]=useState(settings?.pieDependent)
    const [chartSeries,setChartSeries]=useState([])
    const [pieLabels,setPieLabels]=useState([])
    const [mainChartField, setMainChartField] = useState(settings?.mainChartField);
    const [chartType, setChartType] = useState(settings?.chartType);

    const Item=(data)=> {
        return (
            <div className={`custom-select-item ${i18n.dir()==='rtl'?'rtl':''}`}>
                {data.icon}
                <div className="name">{data.name}</div>
            </div>
        );
    }

    useEffect(()=>{
        let temp=data.map(data=>{
            let temp=(data.DocumentBalance).toString().replaceAll(',','')
            let cost=parseFloat(temp,2)
            return {
                ...data,
                DocumentInsertDate:new Date(data.DocumentInsertDate),
                DocumentBalance:cost

            }
        })
        setExcelData(temp)
    },[i18n.language,data])

    useEffect(() => {
        window.addEventListener("resize", handleResize);
        return ()=>{
            window.removeEventListener("resize", handleResize);
        }
    }, []);

    function timeout(delay) {
        return new Promise( res => setTimeout(res, delay) );
    }

    const handleResize = async () => {
        await timeout(500);
        setGridW(gridContainer?.current?.offsetWidth-20)
    };

    useEffect(()=>{
        let w=gridW-340
        let count=Object.keys(fields).length-2
        let cellW=parseInt(w/count)
        cellW=cellW<100?100:cellW
        setAutoWidth(`${cellW}px`)
    },[gridW])

    console.log('autoWidth:',autoWidth)
    console.log('gridW:',gridW)

    const openSetting = Boolean(anchorSetting);
    const idSetting = openSetting ? 'simple-popover' : undefined;
    const openEcxel = Boolean(anchorEcxel);
    const idEcxel = openEcxel ? 'simple-popover' : undefined;
    const openPrint = Boolean(anchorPrint);
    const idPrint = openPrint ? 'simple-popover' : undefined;
    const openChart = Boolean(anchorChart);
    const idChart = openChart ? 'simple-popover' : undefined;


    // const setPercentage = (percentage) => {
    //     console.log('f%%%%',Math.round(gridW / 100) * percentage)
    //     return Math.round(gridW / 100) * percentage;
    // };


    const printRef = useRef();
    const _export = useRef(null);
    const excelExport = () => {
        if (_export.current !== null) {
            _export.current.save();
        }
    };


    useEffect(()=>{
        let tempData=products.map((data)=>{
            let temp=(data.DocumentBalance).toString().replaceAll(',','')
            let cost=parseFloat(temp,2)
            return {
                ...data,
                DocumentInsertDate:new Date(data.DocumentInsertDate),
                DocumentBalance:cost

            }
        })
        setData(tempData)
        if(dataState){
            let updatedState = createDataState(dataState);
            updatedState.dataState.filter={filters:[],logic:''}
            setResult(updatedState.result);
            setDataState(updatedState.dataState);
        }
        loadLangMsg(i18n.language)

    },[i18n.language])


    const reactToPrintContent = useCallback(() => {
        return printRef.current;
    }, [printRef.current]);

    const handlePrint = useReactToPrint({
        content: reactToPrintContent,
        documentTitle: "AwesomeFileName",
        removeAfterPrint: true
    });


    useEffect(()=>{

        if (data.length){
            initialState.dataState.take=take
            setResult(initialState.result)
        }
    },[data,take])



      useEffect(()=>{
          setGridW(gridContainer?.current?.offsetWidth-20)
    },[])



    useEffect(()=>{
        let temp=chartObj.map((field)=> {
            let obj1=dependentField[field.value]?{
                name: field.title,
                data: data.map((item) => (item[field.value]))
            }: null
            return obj1
        })
        temp=temp.filter(item=>item!=null)
        setChartSeries(temp)
    },[dependentField,data])


    function clickRow(e) {
        coloring&&e.nativeEvent.path[1].classList.add("row-custom-bg");
    }

    console.log('-----------------data',data)
    // console.log('-----------------result',result)
    // console.log('-----------------dataState',dataState)
    // console.log('-----------------take',take)





    useEffect(()=>{
        let tempData=products.map((data)=>{
            let temp=(data.DocumentBalance).toString().replaceAll(',','')
            let cost=parseFloat(temp,2)
            return {
                ...data,
                DocumentInsertDate:new Date(data.DocumentInsertDate),
                DocumentBalance:cost
            }
        })
        setData(tempData)

    },[i18n.language])



    useEffect(()=>{
        let temp=chartObj.map((field)=> {
            let obj1=dependentField[field.value]?{
                name: field.title,
                data: data.map((item) => {
                    let temp=(item[field.value] instanceof Date)?getLangDate(i18n.language,item[field.value]):item[field.value]
                    return `${temp}`
                })
            }: null
            return obj1
        })
        temp=temp.filter(item=>item!=null)
        setChartSeries(temp)
    },[dependentField,i18n.language])

    useEffect(()=>{
        let temp=data.map((item) => {
            let temp=(item[mainChartField] instanceof Date)?getLangDate(i18n.language,item[mainChartField]):item[mainChartField]
            return `${temp}`
        })
        setXaxis(temp)
        setPieLabels(temp)
    },[mainChartField,i18n.language,data])


    useEffect(()=>{
        let temp=data.map((item) => (item[pieDependent]))
        setPieSeries(temp)
    },[pieDependent,data])

    // useEffect(()=>{
    //     let temp=data.map((item) => {
    //             let temp = (item[mainChartField] instanceof Date) ? getLangDate(i18n.language, item[mainChartField]) : item[mainChartField]
    //             return temp
    //         }
    //     )
    //     setPieLabels(temp)
    // },[mainChartField])





    useEffect(()=>{
        let settingTemp={
            mainChartField:mainChartField,
            chartType:chartType,
            chartMap:chartMap,
            chartGrid:chartGrid,
        }

        if(chartType==='pie'){
            settingTemp.pieDependent=pieDependent
            localStorage.setItem('chart',JSON.stringify(settingTemp))
        }else{
            settingTemp.dependentField=dependentField
            localStorage.setItem('chart',JSON.stringify(settingTemp))
        }
    },[mainChartField,pieDependent,dependentField,chartType,chartGrid,chartMap])

    // useEffect(()=>{
    //     settingTemp.mainChartField=mainChartField
    //     localStorage.setItem('chart',JSON.stringify(settingTemp))
    // },[mainChartField])
    //
    // useEffect(()=>{
    //     if(chartType==='pie'){
    //         settingTemp.pieDependent=pieDependent
    //         localStorage.setItem('chart',JSON.stringify(settingTemp))
    //     }
    // },[pieDependent])
    // useEffect(()=>{
    //     if(chartType!=='pie'){
    //         settingTemp.dependentField=dependentField
    //         localStorage.setItem('chart',JSON.stringify(settingTemp))
    //     }
    // },[dependentField])
    // useEffect(()=>{
    //     settingTemp.chartType=chartType
    //     localStorage.setItem('chart',JSON.stringify(settingTemp))
    // },[chartType])
    //
    // useEffect(()=>{
    //     settingTemp.chartGrid=chartGrid
    //     localStorage.setItem('chart',JSON.stringify(settingTemp))
    // },[chartGrid])
    //
    // useEffect(()=>{
    //     settingTemp.chartMap=chartMap
    //     localStorage.setItem('chart',JSON.stringify(settingTemp))
    // },[chartMap])


    return (
        <div >

            {/*<style>*/}
            {/*    {`.k-grid-header col:nth-of-type(1),*/}
            {/*    .k-grid-table col:nth-of-type(1){*/}
            {/*        width: 20%*/}
            {/*    }*/}
            {/*   */}
            {/*    .k-grid-header col:nth-of-type(2),*/}
            {/*    .k-grid-table col:nth-of-type(2){*/}
            {/*        width: 30%*/}
            {/*    }*/}
            {/*    `}*/}
            {/*</style>*/}
            <div className='grid-setting'>
                <div className='row mb-1 justify-content-between'>
                    <div className='col-auto'>
                        <Button
                            aria-describedby={idSetting}
                            title={t('تنظیمات')}
                            variant="outlined"
                            className='kendo-setting-btn'
                            onClick={(e)=>setAnchorSetting(e.currentTarget)}
                            disabled={!result?.data?.length}

                        >
                            <SettingsIcon/>
                        </Button>
                        <Popover
                            id={idSetting}
                            open={openSetting}
                            anchorEl={anchorSetting}
                            onClose={()=>setAnchorSetting(null)}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: i18n.dir()==='rtl'?'right':'left',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: i18n.dir()==='rtl'?'right':'left',
                            }}
                            PaperProps={{
                                style: { width: '460px' },
                            }}
                            sx={{direction:i18n.dir()}}
                            className='grid-popover'
                        >
                            <div className='row'>
                                <div className='col-5'>
                                    <h5 className="popover-title">
                                        ستون های قابل نمایش
                                    </h5>
                                    <ul className='field-list'>
                                        {columnsObj.map((item,index)=>(
                                            <li key={index}>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={fields[item.value].grid}
                                                            onChange={(event) => {
                                                                let temp= {...fields}
                                                                temp[item.value].grid=event.target.checked
                                                                setFields(temp)
                                                            }
                                                            }
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
                                        ))}
                                    </ul>
                                </div>
                                <div className='col-7'>
                                    <h5 className="popover-title">
                                        تنظیمات
                                    </h5>
                                    <div className="content form-design p-0">
                                        <div className="title">
                                            <span>{t("تعداد سطر در صفحه")}</span>
                                        </div>
                                        <div className="wrapper">
                                            <div>
                                                <input
                                                    className="form-input"
                                                    type="number"
                                                    id="take"
                                                    name="take"
                                                    onChange={e=>setTake(e.target.value)}
                                                    value={take}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <h5 className="popover-title mt-5">
                                        {t('رنگ آمیزی سطرهای جدول')}
                                    </h5>
                                    <div className='content'>
                                        <div className='row'>
                                            <div className='col-6'>
                                                <div className='title'>
                                                    <span>{t('سطرهای فرد')}</span>
                                                </div>
                                                <ColorPicker view="gradient" value={rowColor1} onChange={c=>setRowColor1(c.value)} />
                                            </div>
                                            <div className='col-6'>
                                                <div className='title'>
                                                    <span>{t('سطرهای زوج')}</span>
                                                </div>
                                                <ColorPicker view="gradient" value={rowColor2} onChange={c=>setRowColor2(c.value)} />
                                            </div>
                                        </div>
                                        <div className='row align-items-center mt-3'>
                                            <div className='col-8'>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={coloring}
                                                            onChange={(event) => setColoring(event.target.checked)}
                                                            name="checked"
                                                            color="primary"
                                                            size="small"
                                                        />
                                                    }
                                                    label={
                                                        <Typography variant="h6">
                                                            رنگ آمیزی سطر با کلیک
                                                        </Typography>
                                                    }
                                                />
                                            </div>
                                            <div className='col-4'>
                                                <ColorPicker view="gradient" value={rowClickColor} onChange={c=>setRowClickColor(c.value)} />
                                            </div>

                                        </div>
                                        <div className='d-flex justify-content-center mt-3'>
                                            <Button
                                                variant="outlined"
                                                color='error'
                                                onClick={()=> {
                                                    setColoring(false)
                                                    setRowColor1(defaultRowColor1)
                                                    setRowColor2(defaultRowColor2)
                                                    gridContainer.current.querySelectorAll('.row-custom-bg').forEach((item)=>{
                                                        item.classList.remove('row-custom-bg')
                                                    })
                                                    setColoring(false)

                                                }}
                                                style={i18n.dir()==='rtl'?{marginRight:'10px'}:{marginLeft:'10px'}}
                                            >
                                                {t('پاک کردن رنگ آمیزی ها')}
                                            </Button>
                                        </div>

                                    </div>
                                </div>
                            </div>

                        </Popover>
                    </div>
                    <div className='col-auto'>
                        <div className='d-flex grid-btn-section'>
                            <div className='grid-btn-section-item'>
                                <Button
                                    aria-describedby={idChart}
                                    variant="outlined"
                                    className='kendo-setting-btn'
                                    title={t('نمودار')}
                                    onClick={(e)=>setAnchorChart(e.currentTarget)}
                                    disabled={!result?.data?.length}
                                >
                                    <BarChartIcon/>
                                </Button>
                                <Popover
                                    id={idChart}
                                    open={openChart}
                                    anchorEl={anchorChart}
                                    onClose={()=>setAnchorChart(null)}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: i18n.dir()==='rtl'?'left':'right',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: i18n.dir()==='rtl'?'left':'right',
                                    }}
                                    PaperProps={{
                                        style: { width: '700px',maxWidth:'100vw' },
                                    }}
                                    sx={{direction:i18n.dir()}}
                                    className='grid-popover chart'
                                >
                                    <div className='row'>
                                        <div className='col-sm-4 col-12'>
                                            <h5 className="popover-title">
                                                {t('تنظیمات')}
                                            </h5>
                                            <div className="title">
                                                <span>{t("نوع نمودار")}</span>
                                            </div>
                                            <SelectBox
                                                dataSource={chartTypes}
                                                rtlEnabled={i18n.dir() == "ltr" ? false : true}
                                                onValueChanged={(e) => setChartType(e.value)}
                                                defaultValue={chartType}
                                                className='selectBox'
                                                noDataText={t('اطلاعات یافت نشد')}
                                                itemRender={Item}
                                                valueExpr="value"
                                                displayExpr='name'
                                                placeholder={''}
                                                name='chartType'
                                                id='chartType'
                                                searchEnabled
                                            />
                                            <div>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={chartMap}
                                                            onChange={(event) =>setChartMap(event.target.checked)
                                                            }
                                                            name="chartMap"
                                                            color="primary"
                                                            size="small"
                                                        />
                                                    }
                                                    label={
                                                        <Typography variant="h6">
                                                            نمایش نقشه راهنما
                                                        </Typography>
                                                    }
                                                    className='mt-3'
                                                />
                                            </div>
                                            <div>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={chartGrid}
                                                            onChange={(event) =>setChartGrid(event.target.checked)
                                                            }
                                                            name="chartGrid"
                                                            color="primary"
                                                            size="small"
                                                        />
                                                    }
                                                    label={
                                                        <Typography variant="h6">
                                                            نمایش خطوط راهنما
                                                        </Typography>
                                                    }
                                                    className='mt-3'
                                                />
                                            </div>

                                            <div className="title mt-3">
                                                <span>{t("مولفه اصلی")}</span>
                                            </div>
                                            <SelectBox
                                                dataSource={columnsObj}
                                                value={mainChartField}
                                                rtlEnabled={i18n.dir() == "ltr" ? false : true}
                                                onValueChanged={(e) => setMainChartField(e.value)}
                                                className='selectBox'
                                                noDataText={t('اطلاعات یافت نشد')}
                                                itemRender={null}
                                                displayExpr="title"
                                                valueExpr="value"
                                                placeholder={''}
                                                name='chartType'
                                                id='chartType'
                                                searchEnabled
                                            />
                                            <h2 className='title mt-3'>مولفه وابسته</h2>
                                            <ul className='field-list'>
                                                {chartType==='pie'?
                                                    <RadioGroup
                                                        name="pie-field"
                                                        defaultChecked={pieDependent}
                                                        defaultValue={pieDependent}
                                                        onChange={e=>setPieDependent(e.target.defaultValue)}
                                                    >
                                                        {chartObj.map((item,index)=>(
                                                            mainChartField!==item.value&&<li key={index}><FormControlLabel value={item.value} control={<Radio />} label={item.title} /></li>
                                                        ))}

                                                    </RadioGroup>

                                                    :chartObj.map((item,index)=>(
                                                        mainChartField!==item.value&&<li key={index}>
                                                            <FormControlLabel
                                                                control={
                                                                    <Checkbox
                                                                        checked={dependentField[item.value]}
                                                                        onChange={(event) => {
                                                                            let temp= {...dependentField}
                                                                            temp[item.value]=event.target.checked
                                                                            setDependentField(temp)
                                                                        }
                                                                        }
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
                                                    ))}
                                            </ul>
                                        </div>
                                        <div className='col-sm-8 col-12' style={{minHeight:'360px'}}>
                                            <h5 className="popover-title">
                                                پیش نمایش
                                            </h5>
                                            {console.log('chartSeries',chartSeries)}
                                            {console.log('xaxis',xaxis)}
                                            {chartSeries.length&&xaxis.length&&chartType !== 'pie'? <>

                                                    <div style={{ direction: 'ltr'}} className={i18n.dir()==='rtl'?'rtl-chart':''}>
                                                        {chartType === 'bar' &&<Chart xaxis={xaxis} chartSeries ={chartSeries}
                                                                                      type={'bar'} height={300} width={'100%'} chartMap={chartMap} chartGrid={chartGrid}/>}
                                                        {chartType === 'line' &&
                                                        <Chart xaxis={xaxis} chartSeries ={chartSeries}
                                                               type={'line'} height={300} width={'100%'} chartMap={chartMap} chartGrid={chartGrid}/>
                                                        }
                                                        {chartType === 'area' &&
                                                        <Chart xaxis={xaxis} chartSeries ={chartSeries}
                                                               type={'area'} height={300} width={'100%'} chartMap={chartMap} chartGrid={chartGrid}/>
                                                        }
                                                        {chartType === 'scatter' &&
                                                        <Chart xaxis={xaxis} chartSeries ={chartSeries}
                                                               type={'scatter'} height={300} width={'100%'} chartMap={chartMap} chartGrid={chartGrid}/>
                                                        }

                                                    </div>

                                                </>
                                                :pieDependent&&mainChartField&&chartType === 'pie' ?
                                                <div style={{ direction: 'ltr'}} className={i18n.dir()==='rtl'?'rtl-chart':''}>
                                                    <PieChart pieLabels={pieLabels} pieSeries={pieSeries} height={300} width={'100%'} chartMap={chartMap} chartGrid={chartGrid}/>
                                                </div>:<div className="d-flex align-items-center justify-content-center h-100"><img src={preview} alt={'chart'}/></div>
                                            }

                                        </div>
                                        <div className='col-12'>
                                            <h5 className="popover-title">
                                                {t('نمودارهای ذخیره شده')}
                                            </h5>
                                           <div className='row'>
                                               <div className='col-12 col-sm-9 col-md-8'>
                                                   {savedCharts.map((item,index)=>(
                                                       <div className='saved-item d-flex' key={index}>
                                                           <span className='index'>{index+1}</span>
                                                           <span className='title'>{item.title}</span>
                                                           <FormControlLabel
                                                               control={
                                                                   <Checkbox
                                                                       checked={savedCharts[index].dashboard}
                                                                       onChange={(event) =>{
                                                                           let temp=savedCharts
                                                                           temp[index].dashboard=event.target.checked
                                                                           console.log('temp',temp)
                                                                           setSavedCharts([...temp])
                                                                       }
                                                                       }
                                                                       name={`savedCharts[${index}].dashboard`}
                                                                       color="primary"
                                                                       size="small"
                                                                   />
                                                               }
                                                               label={
                                                                   <Typography variant="h6">
                                                                       نمایش در داشبورد
                                                                   </Typography>
                                                               }
                                                           />
                                                           <IconButton  variant="contained" color='primary' className='kendo-action-btn' onClick={()=>console.log('view')}>
                                                               <VisibilityIcon/>
                                                           </IconButton >
                                                           <IconButton  variant="contained" color="error" className='kendo-action-btn' onClick={()=>{
                                                               let temp=savedCharts.filter(s=>s.title!==item.title)
                                                               setSavedCharts(temp)
                                                           }}>
                                                               <DeleteIcon/>
                                                           </IconButton >
                                                       </div>
                                                   ))}
                                                   <div className='d-flex'>
                                                       <div  style={{width:'70%'}}>
                                                           <div className='form-design p-0'>
                                                               <div className='title'><span>{t('عنوان')}</span></div>
                                                               <input
                                                                   className="form-input"
                                                                   type="text"
                                                                   id="title"
                                                                   name="title"
                                                                   onChange={(e)=>setNewChart(e.target.value)}
                                                                   value={newChart}
                                                               />
                                                           </div>
                                                       </div>
                                                       <div style={i18n.dir()==='rtl'?{marginRight:'10px'}:{marginLeft:'10px'}}>
                                                           <div className='form-design p-0'>
                                                               <div className='title'><span>‌</span></div>
                                                               <Button
                                                                   variant="outlined"
                                                                   color='success'
                                                                   onClick={()=> {
                                                                       setSavedCharts(s=>[...s, {title:newChart,dashboard:false}])
                                                                       setNewChart('')
                                                                   }}
                                                                   style={{ padding: '3px 15px 4px',fontSize:'12px'}}
                                                               >
                                                                   ذخیره نمودار
                                                               </Button>
                                                           </div>
                                                       </div>
                                                   </div>
                                               </div>
                                           </div>
                                        </div>
                                        <div className='col-12 d-flex justify-content-center'>

                                                <Button
                                                    variant="contained"
                                                    color='success'
                                                    onClick={()=> {
                                                        // navigate("/accounts/ChartTest", { state: { questions: 'hello' } });
                                                        setAnchorChart(null)
                                                    }}
                                                >
                                                    <Link
                                                        to={`/accounts/ChartTest`}
                                                        target={'_blank'}
                                                        className={'link-tag'}>
                                                        باز کردن نمودار
                                                    </Link>
                                                </Button>


                                            <Button
                                                variant="contained"
                                                color='error'
                                                onClick={()=> {
                                                    setAnchorChart(null)
                                                }}
                                                style={i18n.dir()==='rtl'?{marginRight:'10px'}:{marginLeft:'10px'}}
                                            >
                                                {t('انصراف')}
                                            </Button>
                                        </div>
                                    </div>

                                </Popover>
                            </div>
                            <div className='grid-btn-section-item'>
                                <Button
                                    aria-describedby={idEcxel}
                                    variant="outlined"
                                    className='kendo-setting-btn'
                                    title={t('خروجی اکسل')}
                                    onClick={(e)=>setAnchorEcxel(e.currentTarget)}
                                    disabled={!result?.data?.length}
                                >
                                    <IconFileSpreadsheet/>
                                </Button>
                                <Popover
                                    id={idEcxel}
                                    open={openEcxel}
                                    anchorEl={anchorEcxel}
                                    onClose={()=>setAnchorEcxel(null)}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: i18n.dir()==='rtl'?'left':'right',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: i18n.dir()==='rtl'?'left':'right',
                                    }}
                                    PaperProps={{
                                        style: { width: '400px' },
                                    }}
                                    sx={{direction:i18n.dir()}}
                                    className='grid-popover'
                                >
                                    <div className='row'>
                                        <div className='col-6'>
                                            <h5 className="popover-title">
                                                ستون های قابل نمایش
                                            </h5>
                                            <ul className='field-list'>
                                                {columnsObj.map((item,index)=>(
                                                    <li key={index}>
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox
                                                                    checked={fields[item.value].excel}
                                                                    onChange={(event) => {
                                                                        let temp= {...fields}
                                                                        temp[item.value].excel=event.target.checked
                                                                        setFields(temp)
                                                                    }
                                                                    }
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
                                                ))}
                                            </ul>
                                        </div>
                                        <div className='col-6'>
                                            <h5 className="popover-title">
                                                تنظیمات
                                            </h5>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={filterExcelFields}
                                                        onChange={(event) =>setFilterExcelFields(event.target.checked)
                                                        }
                                                        name="filterExcelFields"
                                                        color="primary"
                                                        size="small"
                                                    />
                                                }
                                                label={
                                                    <Typography variant="h6">
                                                        قابل فیلتر شدن
                                                    </Typography>
                                                }
                                            />
                                        </div>
                                        <div className='col-12 d-flex justify-content-center'>
                                            <Button
                                                variant="contained"
                                                color='success'
                                                onClick={()=> {
                                                    excelExport()
                                                    setAnchorEcxel(null)
                                                }}
                                            >
                                                خروجی Excel
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color='error'
                                                onClick={()=> {
                                                    setAnchorEcxel(null)
                                                }}
                                                style={i18n.dir()==='rtl'?{marginRight:'10px'}:{marginLeft:'10px'}}
                                            >
                                                {t('انصراف')}
                                            </Button>
                                        </div>
                                    </div>

                                </Popover>
                            </div>
                            <div className='grid-btn-section-item'>
                                <Button
                                    aria-describedby={idPrint}
                                    variant="outlined"
                                    className='kendo-setting-btn'
                                    title={t('پرینت')}
                                    onClick={(e)=>setAnchorPrint(e.currentTarget)}
                                    disabled={!data?.length}
                                >
                                    <IconPrinter/>
                                </Button>
                                <Popover
                                    id={idPrint}
                                    open={openPrint}
                                    anchorEl={anchorPrint}
                                    onClose={()=>setAnchorPrint(null)}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: i18n.dir()==='rtl'?'left':'right',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: i18n.dir()==='rtl'?'left':'right',
                                    }}
                                    PaperProps={{
                                        style: { width: '400px' },
                                    }}
                                    sx={{direction:i18n.dir()}}
                                    className='grid-popover'
                                >
                                    <div className='row'>
                                        <div className='col-6'>
                                            <h5 className="popover-title">
                                                ستون های قابل نمایش
                                            </h5>
                                            <ul className='field-list'>
                                                {columnsObj.map((item,index)=>(
                                                    <li key={index}>
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox
                                                                    checked={fields[item.value].print}
                                                                    onChange={(event) => {
                                                                        let temp= {...fields}
                                                                        temp[item.value].print=event.target.checked
                                                                        setFields(temp)
                                                                    }
                                                                    }
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
                                                ))}
                                            </ul>
                                        </div>
                                        <div className='col-6'>
                                            <h5 className="popover-title">
                                                تنظیمات
                                            </h5>
                                            <div className="title">
                                                <span>{t("اندازه صفحه")}</span>
                                            </div>
                                            <SelectBox
                                                dataSource={pSize}
                                                rtlEnabled={i18n.dir() == "ltr" ? false : true}
                                                onValueChanged={(e) => setPrintSize(e.value)}
                                                defaultValue={printSize}
                                                className='selectBox'
                                                noDataText={t('اطلاعات یافت نشد')}
                                                itemRender={null}
                                                name='pSize'
                                                id='pSize'
                                                searchEnabled

                                            />
                                        </div>
                                        <div className='col-12 d-flex justify-content-center'>
                                            <Button
                                                variant="contained"
                                                color='success'
                                                onClick={()=> {
                                                    handlePrint()
                                                    setAnchorPrint(null)
                                                }}
                                            >
                                                {t('پرینت')}
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color='error'
                                                onClick={()=> {
                                                    setAnchorPrint(null)
                                                }}
                                                style={i18n.dir()==='rtl'?{marginRight:'10px'}:{marginLeft:'10px'}}
                                            >
                                                {t('انصراف')}
                                            </Button>
                                        </div>
                                    </div>

                                </Popover>
                            </div>
                        </div>

                    </div>

                </div>
            </div>



            <div className={`my-kendo-grid ${i18n.dir()==='rtl'?'rtl-grid':''}`} ref={gridContainer}>
                <LocalizationProvider
                    language={`${i18n.language === 'fa' ? 'fa-IR' : i18n.language === 'ar' ? 'ar' : 'en'}`}>
                    {/*<IntlProvider locale="fa-IR">*/}
                    <ExcelExport
                        data={excelData}
                        ref={_export}
                        fileName="Products.xlsx"
                        filterable={filterExcelFields}
                        dir={i18n.dir()}
                    >

                        {fields.IndexCell.excel &&<ExcelExportColumn field='IndexCell' title="ردیف"/>}
                        {fields.DocumentCode.excel &&<ExcelExportColumn field="DocumentCode" title="کد سند"/>}
                        {fields.DocumentBalance.excel &&<ExcelExportColumn field="DocumentBalance"  title="تراز سند"/>}
                        {fields.DocumentInsertDate.excel &&<ExcelExportColumn field="DocumentInsertDate" title="تاریخ ثبت سند"/>}
                        {fields.DocumentTypeName.excel &&<ExcelExportColumn field="DocumentTypeName" title="نوع سند"/>}
                        {fields.RefDocumentCode.excel &&<ExcelExportColumn field="RefDocumentCode" title="کد سند مرجع"/>}
                        {fields.InsertUser.excel &&
                        <ExcelExportColumn field="InsertUser" title={t('درج')}  />}
                        {fields.LastUpdateUser.excel &&
                        <ExcelExportColumn field="LastUpdateUser" title={t('آخرین تغییر')}  />}
                        {fields.DocumentDescription.excel &&
                        <ExcelExportColumn field="DocumentDescription" title={t('توضیحات سند')}   />}
                        {fields.DocumentState.excel &&
                        <GridColumn field="DocumentState" title={t('وضعیت سند')}   />}

                    </ExcelExport>
                    <div>
                        <style>{`
                            .k-grid tr {
                                background-color: ${rowColor1};
                            }
                            .k-grid tr.k-alt {
                                background-color: ${rowColor2};
                            }
                            
                            .k-grid tr.row-custom-bg {
                                background-color: ${rowClickColor}!important;
                            }
                        `}</style>
                        <Grid
                            // filterable={true}
                            total={Object.values(products).length}
                            data={result}
                            {...dataState}
                            take={take}
                            onDataStateChange={dataStateChange}
                            sortable={true}
                            pageable={true}
                            pageSize={8}
                            reorderable={true}
                            onRowClick={clickRow}
                            onColumnReorder={e=>console.log('reorder',e)}

                            // resizable={true}


                            className={`main-grid ${i18n.dir()} ${coloring?'color-pointer':''}`}

                            // groupable={true}

                        >

                            {fields.IndexCell.grid &&
                            <GridColumn field="IndexCell" filterable={false} width={'50px'} cell={IndexCell} title={t("ردیف")} />}
                             {fields.DocumentCode.grid &&
                            <GridColumn field="DocumentCode" columnMenu={ColumnMenu} width={autoWidth} filter={"numeric"} title={t("کد سند")} />}
                            {fields.DocumentBalance.grid &&
                            <GridColumn field="DocumentBalance" columnMenu={ColumnMenu} cell={CurrencyCell} width={autoWidth} filter={"numeric"} title={t("تراز سند")} />}
                            {fields.DocumentInsertDate.grid && <GridColumn field="DocumentInsertDate"
                                                                      columnMenu={DateMenu}
                                                                      title={t("تاریخ ثبت سند")}
                                                                      filter="date"
                                                                      format="{0:d}"
                                                                      cell={DateCell}
                                                                       width={autoWidth}
                                                                       // width={setPercentage(fieldsW.DocumentInsertDate.grid)}
                                                            />
                            }
                            {fields.DocumentTypeName.grid && <GridColumn field="DocumentTypeName" title={t("نوع سند")}
                                                                 columnMenu={ColumnMenu} width={autoWidth} />}
                            {fields.RefDocumentCode.grid &&
                            <GridColumn field="RefDocumentCode" title={t("کد سند مرجع")} width={autoWidth} filter={"numeric"}
                                        columnMenu={ColumnMenu} />}
                            {fields.InsertUser.grid &&
                            <GridColumn field="InsertUser" width={autoWidth} title={t('درج')}
                                        columnMenu={ColumnMenu}  />}
                             {fields.LastUpdateUser.grid &&
                            <GridColumn field="LastUpdateUser" width={autoWidth} title={t('آخرین تغییر')}
                                        columnMenu={ColumnMenu}  />}
                            {fields.DocumentDescription.grid &&
                            <GridColumn field="DocumentDescription" title={t('توضیحات سند')}
                                        columnMenu={ColumnMenu}  width={'150px'}/>}
                            {fields.DocumentState.grid &&
                            <GridColumn field="DocumentState" title={t('وضعیت سند')}  columnMenu={ColumnMenu}  width={autoWidth} />}
                            <GridColumn title={t('عملیات')} cell={CustomActionCell} width={'140px'} className={'text-center'}/>
                        </Grid>
                    </div>

                    {/*</IntlProvider>*/}
                </LocalizationProvider>
            </div>
            <div style={{display:"none"}} className={`my-kendo-grid ${i18n.dir()==='rtl'?'rtl-grid':''}`}>
                <div className={`print-grid ${i18n.dir()==='ltr'?'ltr-p':''}`} ref={printRef}>

                    <style type="text/css" media="print">{`
                      @page { size: ${printSize} }
                    `}</style>
                    <LocalizationProvider
                        language={`${i18n.language === 'fa' ? 'fa-IR' : i18n.language === 'ar' ? 'ar' : 'en'}`}>
                        <Grid
                            total={Object.values(products).length}
                            take={Object.values(products).length}
                            data={data}
                            pageable={false}
                            className={`main-grid ${i18n.dir()}`}
                        >
                            {fields.IndexCell.print &&
                            <GridColumn field="IndexCell" filterable={false} cell={IndexCell} width={'50px'} title={t("ردیف")} />}
                            {fields.DocumentCode.print &&
                            <GridColumn field="DocumentCode" title={t("کد سند")} />}
                            {fields.DocumentBalance.print &&
                            <GridColumn field="DocumentBalance" title={t("تراز سند")} />}
                            {fields.DocumentInsertDate.print && <GridColumn field="DocumentInsertDate"
                                                                        title={t("تاریخ ثبت سند")}
                                                                        cell={DateCell}
                            />
                            }
                            {fields.DocumentTypeName.print && <GridColumn field="DocumentTypeName" title={t("نوع سند")}  />}
                            {fields.RefDocumentCode.print &&
                            <GridColumn field="RefDocumentCode" title={t("کد سند مرجع")} />}
                            {fields.InsertUser.print &&
                            <GridColumn field="InsertUser" title={t('درج')}  />}
                            {fields.LastUpdateUser.print &&
                            <GridColumn field="LastUpdateUser" title={t('آخرین تغییر')} />}
                            {fields.DocumentDescription.print &&
                            <GridColumn field="DocumentDescription" title={t('توضیحات سند')} width={'150px'}  />}
                            {fields.DocumentState.print &&
                            <GridColumn field="DocumentState" title={t('وضعیت سند')}   />}
                        </Grid>
                    </LocalizationProvider>
                </div>
            </div>

        </div>

    );
};

export default KendoGrid
