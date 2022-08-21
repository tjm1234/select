import React, { useState, useEffect } from 'react';
import { Register } from '../../factory';
import { View, Text } from '@tarojs/components';

import './index.scss'
import { AtIcon } from 'taro-ui';


type SelectListProps = {
} & IProps;

const SelectList: React.FC<SelectListProps> = (props: SelectListProps) => {
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
        <View className="list-item-box">
            {
                localValue.map((item: any) => (
                    <View
                        key={item.objectValue}
                        className={`list-item ${item.checked ? 'actived' : ''}`}
                        onClick={() => handleListClick(item)}
                    >
                        <Text>{item.objectName}&emsp;</Text>
                        {
                            item.checked &&
                            <AtIcon value="check" size="14" color="#ff6e00"
                                className="list-item-ico" />
                        }
                    </View>
                ))
            }
        </View>
    )
}

export default Register({ name: "select-list" })(SelectList)