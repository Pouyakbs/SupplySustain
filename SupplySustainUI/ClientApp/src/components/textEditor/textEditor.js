import React, { useEffect, useState } from "react";

import HtmlEditor, {
  Toolbar, MediaResizing, ImageUpload, Item,
} from 'devextreme-react/html-editor';
import './textEditor.css';
import { useTranslation } from "react-i18next";
import { loadMessages, locale } from "devextreme/localization";
import * as faMessages from '../../locales/fa/fa.json';
import * as enMessages from 'devextreme/localization/messages/en.json';
import * as arMessages from 'devextreme/localization/messages/ar.json';
// import Globalize from 'globalize';



const sizeValues = ['8pt', '10pt', '12pt', '14pt', '18pt', '24pt', '36pt'];
const fontValues = ['Arial', 'Courier New', 'Georgia', 'Impact', 'Lucida Console', 'Tahoma', 'Times New Roman', 'Verdana'];
const headerValues = [false, 1, 2, 3, 4, 5];



const TextEditor=({getValue})=>{

  const { t, i18n } = useTranslation();

    const [isMultiline,setIsMultiline]=useState(true)
    const [currentTab,setCurrentTab]=useState(['file', 'url'])
  //
  // useEffect(()=>{
  //
  //   console.log('i18n.language:',i18n.language==='fa'?"fa-IR":i18n.language==='ar'?'ar':'en')
  //   locale(i18n.language==='fa'?"fa-IR":i18n.language==='ar'?'ar':'en')
  //   loadMessages(faMessages,arMessages,enMessages);
  // },[i18n.language])
    

    function multilineChanged(e) {
  
      setIsMultiline(e.value)
    }
  
    function valueChanged(e) {
    
      getValue(e.value)
      
    }
  
    function currentTabChanged(e) {
      
      setCurrentTab( e.value)
    }


    return (
      <div className="widget-container">
        <HtmlEditor
          height="300px"
          valueType='html'
          onValueChanged={valueChanged}
          rtlEnabled={i18n.dir()==='rtl'}
        >
          <MediaResizing enabled={true} />
          <ImageUpload tabs={currentTab} fileUploadMode="base64" />
          <Toolbar multiline={isMultiline}>
            <Item name="undo" />
            <Item name="redo" />
            <Item name="separator" />
            <Item
              name="size"
              acceptedValues={sizeValues}
            />
            <Item
              name="font"
              acceptedValues={fontValues}
            />
            <Item name="separator" />
            <Item name="bold" />
            <Item name="italic" />
            <Item name="strike" />
            <Item name="underline" />
            <Item name="separator" />
            <Item name="alignLeft" />
            <Item name="alignCenter" />
            <Item name="alignRight" />
            <Item name="alignJustify" />
            <Item name="separator" />
            <Item name="orderedList" />
            <Item name="bulletList" />
            <Item name="separator" />
            <Item
              name="header"
              acceptedValues={headerValues}
            />
            <Item name="separator" />
            <Item name="color" />
            <Item name="background" />
            <Item name="separator" />
            <Item name="link" />
            <Item name="image" />
            <Item name="separator" />
            <Item name="clear" />
            <Item name="codeBlock" />
            <Item name="blockquote" />
            <Item name="separator" />
            <Item name="insertTable" />
            <Item name="deleteTable" />
            <Item name="insertRowAbove" />
            <Item name="insertRowBelow" />
            <Item name="deleteRow" />
            <Item name="insertColumnLeft" />
            <Item name="insertColumnRight" />
            <Item name="deleteColumn" />
          </Toolbar>
        </HtmlEditor>
        
      </div>
    );

  
}

export default TextEditor;