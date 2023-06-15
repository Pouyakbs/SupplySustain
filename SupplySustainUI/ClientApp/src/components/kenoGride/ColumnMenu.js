import React, {useRef, useState} from 'react';
import { GridColumnMenuFilter, GridColumnMenuCheckboxFilter } from '@progress/kendo-react-grid';
import products from './product.json';
import { DropDownList} from "@progress/kendo-react-dropdowns";
import {useTranslation} from "react-i18next";
import DatePicker from "react-multi-date-picker";
import {renderCalendarLocaleSwitch, renderCalendarSwitch} from "../../utils/calenderLang";
import {julianIntToDate} from "../../utils/dateConvert";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import {getLangDate} from "../../utils/getLangDate";

export const ColumnMenu = props => {
    return <div>
        <GridColumnMenuFilter {...props} expanded={true} />
    </div>;
};

export const ColumnMenuCheckboxFilter = props => {
    return <div>
        <GridColumnMenuCheckboxFilter {...props} data={products} expanded={true} />
    </div>;
};




export const DateMenu=(props)=> {
    const { t, i18n } = useTranslation();

    const dateRef1=useRef()
    const dateRef2=useRef()

    const logicList=[
        {title:t("یا"),value:"or"},
        {title:t("و"),value:"and"},
    ]
    const operators=[
        {title:t("برابر باشد با"),value:"eq"},
        {title:t("برابر نباشد با"),value:"neq"},
        {title:t("بعد و مساوی باشد با"),value:"gte"},
        {title:t("بعد باشد"),value:"gt"},
        {title:t("قبل باشد"),value:"lt"},
        {title:t("قبل یا مساوی باشد با"),value:"lte"},
        {title:t("برابر با هیچ"),value:"isnull"},
        {title:t("برابر با هیچ نباشد"),value:"isnotnull"},
    ]


    const [select1,setSelect1]=useState(props?.filter?props?.filter?.filters[0]?.operator:'eq')
    const [select2,setSelect2]=useState(props?.filter?props?.filter?.filters[0]?.operator:'eq')
    const [logic,setLogic]=useState(props?.filter?.logic?props?.filter?.logic:logicList[0].value)
    const [date1,setDate1]=useState(props?.filter?.filters[0]?.value?props?.filter?.filters[0]?.value:'')
    const [date2,setDate2]=useState(props?.filter?.filters[1]?.value?props?.filter?.filters[1]?.value:'')



    const filterValue = () => {
        let filter1 = {
            field: props.column.field,
            operator: select1,
            value: new Date(date1)
        };
        let filter2 = {
            field: props.column.field,
            operator: select2,
            value: new Date(date2)
        };
        props.onFilterChange({filters: [filter1,filter2], logic: logic}, null);
        props.onCloseMenu();
    };
    const clearFilter = () => {
        props.onFilterChange(null, null);
        props.onCloseMenu();
    };

    return (
      <>
          <div className={i18n.dir()==='rtl'?'rtl-filter':''} style={{width:'100%'}}>

              <div className="k-columnmenu-item "><span className="k-icon k-i-filter"></span>{t('فیلتر')}</div>
              <div className="k-columnmenu-item-content">
                  <div className="k-child-animation-container">
                      <div className="kendo-grid-filter-menu-container">
                          <form className="k-filter-menu k-group k-reset k-state-border-up">
                              <div className="k-filter-menu-container">
                                  <DropDownList
                                    className="k-dropdownlist k-picker k-picker-md k-rounded-md k-picker-solid"
                                    data={operators}
                                    defaultValue={props?.filter?.filters[0]?.operator?(operators?.filter(item=>item.value===props?.filter?.filters[0]?.operator))[0]:operators[0]}
                                    textField="title"
                                    dataItemKey="value"
                                    onFocus={()=> dateRef1?.current?.closeCalendar()}
                                    onChange={(e)=>setSelect1(e.value.value)}
                                  />
                                  <div className="position-relative filter-date-picker">
                                      <DatePicker
                                        name={"firstDate"}
                                        id={"firstDate"}
                                        ref={dateRef1}
                                        value={props?.filter?.filters[0]?.value?getLangDate(i18n.language,props?.filter?.filters[0]?.value):''}
                                        calendar={renderCalendarSwitch(i18n.language)}
                                        locale={renderCalendarLocaleSwitch(i18n.language)}
                                        onChange={(val) => {
                                            setDate1(julianIntToDate(val.toJulianDay()))
                                        }}
                                      />
                                      <CalendarMonthIcon className={`calender-btn  ${i18n.dir() == "ltr" ? 'action-ltr' : ''}`} />
                                  </div>
                                  <DropDownList
                                    className="k-dropdownlist k-picker k-filter-and k-picker-md k-rounded-md k-picker-solid"
                                    data={logicList}
                                    defaultValue={props?.filter?.logic?(logicList.filter(item=>item.value===props?.filter?.logic))[0]:logicList[0]}
                                    textField="title"
                                    dataItemKey="value"
                                    onFocus={()=> dateRef1?.current?.closeCalendar()}
                                    onChange={(e)=>setLogic(e.value.value)}
                                  />
                                  <DropDownList
                                    className="k-dropdownlist k-picker k-picker-md k-rounded-md k-picker-solid"
                                    data={operators}
                                    defaultValue={props?.filter?.filters[1]?.operator?(operators?.filter(item=>item.value===props?.filter?.filters[1]?.operator))[0]:operators[0]}
                                    textField="title"
                                    dataItemKey="value"
                                    onFocus={()=> dateRef2?.current?.closeCalendar()}
                                    onChange={(e)=>setSelect2(e.value.value)}
                                  />
                                  <div className='position-relative filter-date-picker'>
                                      <DatePicker
                                        name={"secondDate"}
                                        id={"secondDate"}
                                        ref={dateRef2}
                                        calendar={renderCalendarSwitch(i18n.language)}
                                        locale={renderCalendarLocaleSwitch(i18n.language)}
                                        value={props?.filter?.filters[1]?.value?getLangDate(i18n.language,props?.filter?.filters[1]?.value):''}
                                        onChange={(val) => setDate2(julianIntToDate(val.toJulianDay()))}
                                      />
                                      <CalendarMonthIcon className={`calender-btn  ${i18n.dir() == "ltr" ? 'action-ltr' : ''}`} />
                                  </div>

                                  <div className="k-actions k-actions-stretched" onFocus={()=> dateRef2?.current?.closeCalendar()}>
                                      <button type="reset" onClick={clearFilter}
                                              className="k-button k-button-md k-button-solid k-button-solid-base k-rounded-md">
                                          <span className="k-button-text">{t('حذف فیلتر')}</span></button>
                                      <button type='button' onClick={filterValue} disabled={!date1&&!date2}
                                              className="k-button k-button-md k-button-solid k-button-solid-primary k-rounded-md">
                                          <span className="k-button-text">{t('فیلتر')}</span></button>
                                  </div>

                              </div>
                          </form>
                      </div>
                  </div>
              </div>
          </div>
      </>
    );
}
