import React from "react";
import {useTranslation} from "react-i18next";


const TotalTitle = (props) => {
    const { t, i18n } = useTranslation();
    return (
        <td colSpan={props.colSpan} style={props.style}>
            {t('جمع')}
        </td>
    );
};

export default React.memo(TotalTitle)