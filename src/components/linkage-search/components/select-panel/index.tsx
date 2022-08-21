import React, { useState, useEffect } from 'react';
import { Register } from '../../factory';
import { View } from '@tarojs/components';

import './index.scss'


type SelectPanelProps = {
} & IProps;

const SelectPanel: React.FC<SelectPanelProps> = (props: SelectPanelProps) => {
    const {  datas } = props;
    const [localValue, setLocalValue] = useState<any>(datas || []);
    
    useEffect(() => {
        if (!!datas && localValue != datas) {
            setLocalValue(datas)
        }
    }, [datas])


    const handleListClick = (item) => {
        const { objectValue } = item;
        item.checked = !item.checked;
        const index = localValue.findIndex(team => team.objectValue === objectValue);
        const datasJson = JSON.parse(JSON.stringify(localValue));
        datasJson[index] = item;
        setLocalValue(datasJson);
        props.onChange && props.onChange(datasJson);
    };

    return (
        <View className="select-panel-box">
            {
                datas.map((item: any) => (
                    <View
                        className={`select-panel-item clamp2 ${item.checked ? 'actived' : ''} `}
                        onClick={() => handleListClick(item)}
                    >{item.objectName}</View>
                ))
            }
            {[1, 2].includes(datas.length % 3) &&
                <View className="select-panel-item clamp2" style={{ visibility: "hidden" }} />}
        </View>
    )
}

export default Register({ name: "select-panel" })(SelectPanel)