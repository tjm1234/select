import React, { useState, useEffect } from 'react';
import { Register } from '../../factory';
import { View, Text } from '@tarojs/components';

import './index.scss'
import { AtIcon, AtTabs, AtTabsPane } from 'taro-ui';


type SelectCascaderProps = {
    tabList?: any;
} & IProps;

const SelectCascader: React.FC<SelectCascaderProps> = (props: SelectCascaderProps) => {
    const { datas, tabList } = props;
    const [localValue, setLocalValue] = useState<any>(datas || []);
    let propsCur = Math.max(datas.findIndex(item => item.checked == true), 0);
    const [current, setCurrent] = useState<number>(propsCur); //  默认切换页
    useEffect(() => {
        if (!!datas && localValue != datas) {
            setLocalValue(datas)
        }
    }, [datas])
    const level = !!localValue[current] && localValue[current].level ? localValue[current].level : 3;   // 找到第几层

    const handleClickAtTabs = (value) => {
        setCurrent(value)
        props.onSubTabChange && props.onSubTabChange(value)
    };


    const onClickCategory = (item) => {
        const majorResultJson = JSON.parse(JSON.stringify(localValue));
        majorResultJson[current].children.forEach((team, index) => {
            if (team.objectValue === item.objectValue) {
                team.checked = !team.checked;
                if (!team.checked) {
                    team.children.forEach(e => e.checked = false)
                    if (index != 0) majorResultJson[current].children[0].checked = true;
                    props.onChange && props.onChange(majorResultJson);
                }
            } else {
                team.checked = false;
            }
        })
        setLocalValue(majorResultJson);
    };

    const onClickDiscipline = (item) => {
        const majorResultJson = JSON.parse(JSON.stringify(localValue));
        const category = majorResultJson[current].children || []; // [categoryIndex]
        const categoryIndex = Math.max(category.findIndex(v => v.checked), 0) // 找到index
        const discipline = category[categoryIndex] ? category[categoryIndex].children : [];
        discipline.forEach(team => {
            if (team.objectValue === item.objectValue) {
                team.checked = !team.checked;

            } else if (level != 2) {
                team.checked = false;
            }
        })
        setLocalValue(majorResultJson);
        if (level == 2) props.onChange && props.onChange(majorResultJson);
    };


    const onClickSpeciality = (item) => {
        item.checked = !item.checked;
        const majorResultJson = JSON.parse(JSON.stringify(localValue));
        setLocalValue(majorResultJson)
        props.onChange && props.onChange(majorResultJson);
    };

//     const deepCascaderDatas = (data)=> {
//         let arrs:any = [];
//         if (!!data.children && !!data.children.length) {
//             for(let i=0;i<data.children.length;i++) {
//                 if(!!Array.isArray(data.children[i].children)) 
//                     arrs = arrs.concat( deepCascaderDatas(data.children[i]) );
//                 else 
//                     arrs.push(data.children[i]);

//             }
//         }
//         return arrs;
//     }

//    if(!!localValue.length) {
//     let c = deepCascaderDatas(localValue[0]);
//     console.log(c,'deepCascaderDatas')
//    }
    

    return (
        <View className='select-cascader-box'>
            <AtTabs current={current} tabList={tabList} onClick={handleClickAtTabs}>
                {
                    !!localValue && !!localValue.length &&
                    localValue.map(((item: any, index: number) => {
                        const category = item.children || []; // [categoryIndex]
                        const categoryIndex = Math.max(category.findIndex(v => v.checked), 0) // 找到index
                        const discipline = category[categoryIndex] ? category[categoryIndex].children : [];
                        const disciplineIndex = Math.max(discipline.findIndex(v => v.checked), 0)// 找到index
                        const speciality = discipline[disciplineIndex] ? discipline[disciplineIndex].children : [];

                        return (
                            <AtTabsPane current={current} index={index}>
                                <View className="specialty-box">
                                    <View className="study-type-box">
                                        {
                                            category.map((categoryItem: any) => (
                                                <View
                                                    className={`study-type-list ${categoryItem.checked ? 'actived' : ''}`}
                                                    onClick={() => onClickCategory(categoryItem)}>
                                                    <Text>{categoryItem.objectName}&emsp;</Text>
                                                </View>
                                            ))
                                        }
                                    </View>
                                    {/* <View className="study-family-box"> */}
                                    <View className="study-type-box">
                                        {
                                            !!discipline && !!discipline.length &&
                                            discipline.map((disciplineItem: any) => (
                                                <View
                                                    className={`study-type-list ${disciplineItem.checked ? 'actived' : ''}`}
                                                    onClick={() => onClickDiscipline(disciplineItem)}>
                                                    <Text>{disciplineItem.objectName}&emsp;</Text>
                                                    <AtIcon value="check" size="14"
                                                        color="#ff6e00"
                                                        className="list-item-ico" />
                                                </View>
                                            ))
                                        }
                                    </View>

                                    {
                                        level > 2 &&
                                        <View className="study-type-box">
                                            {
                                                !!speciality && !!speciality.length &&
                                                speciality.map((specialityItem: any) => (
                                                    <View
                                                        className={`study-type-list ${specialityItem.checked ? 'actived' : ''}`}
                                                        onClick={() => onClickSpeciality(specialityItem)}>
                                                        <Text>{specialityItem.objectName}&emsp;</Text>
                                                        <AtIcon value="check" size="14"
                                                            color="#ff6e00"
                                                            className="list-item-ico" />
                                                    </View>
                                                ))
                                            }
                                        </View>}
                                    {/* </View> */}
                                </View>
                            </AtTabsPane>
                        )
                    }
                    ))
                }
            </AtTabs>
        </View>
    )
}

export default Register({ name: "select-cascader" })(SelectCascader)