import React, { useEffect, useState, Fragment } from 'react';
import { View, Text } from '@tarojs/components';
import { AtTabs, AtTabsPane, AtIcon, AtBadge } from 'taro-ui';
import BuilderSearch from './builder';
import './index.scss';

const LinkageSearch = (props: any) => {
    const { tabs, tabList, selectTabsInitInfo } = props;
    const [selectTab, setStelectTab] = useState<string>('');
    const [selectMold, setSelectMold] = useState<string>('');
    const [selectDatas, setSelectDatas] = useState<any[]>([]);
    //   const [tabsFullDatas, setTabsFullDatas] = useState<any>(selectTabsInitInfo || {});
    const tabsFullDatas: any = selectTabsInitInfo || {}
    // useEffect(() => {
    //     if (JSON.stringify(selectTabsInitInfo) != JSON.stringify(tabsFullDatas)) {
    //         setTabsFullDatas(selectTabsInitInfo)
    //     }
    // }, [selectTabsInitInfo])

    const handleReset = () => {
        let arr: any = tabsFullDatas[selectTab];
        arr = tabsFullDatas[selectTab];

        const resetArr = resetChecked(arr);

        if (selectMold === 'select-cascader') {
            getCascaderResult(selectTab, true)
        } else {
            tabsFullDatas[selectTab] = resetArr
        }
        handleConfirm()
    };

    const resetChecked = (arr: any[]) => arr.map(item => {
        item.checked = false
        return item
    })

    // 初始化筛选框
    const handleClickSelectInit = () => {
        props.onInitSelect && props.onInitSelect()


    }

    const handleConfirm = () => {
        let objConfirmRes = {};
        for (const k in tabs) {
            let { keys, mold } = tabs[k];
            if (mold == 'select-cascader') {
                let cascaderData: any = getCascaderResult(keys) || [];
                cascaderData = cascaderData.filter(item => !!item.checked)
                objConfirmRes[keys + 'Data'] = cascaderData;
            } else {
                let q = tabsFullDatas[keys].filter(item => !!item.checked);
                objConfirmRes[keys + 'Data'] = q;
            }


        }

        setStelectTab('')
        props.handlConfirmFn && props.handlConfirmFn(objConfirmRes)
    };

    const handleClickTabs = (value, mold) => {
        handleSelectTab(value);
        setSelectMold(mold)

        props.onClickTabs && props.onClickTabs(value);
    };

    const handleSelectTab = (value) => {
        if (selectTab === value || !value) {
            setStelectTab('');
        } else {
            setStelectTab(value);
        }

    };

    const getBadgeValue = (value, mold) => {
        let arr: any = tabsFullDatas[value];

        if (mold === 'select-cascader') {
            arr = getCascaderResult(value);
        }
        arr = arr || [];

        let checkedNum: number = getCheckedNum(arr);
        return checkedNum ? { value: checkedNum } : {};
    };

    const getCascaderResult = (keys, isReset = false) => {
        const tempArr: any = [];
        let curRes = tabsFullDatas[keys] || [];
        curRes.forEach(item => {
            let arr: any = deepCascaderArray(item);
            tempArr.push(...arr);
        })

        if (isReset) {
            tempArr.forEach(v => {
                v.checked = false;
            })
            const majorResultJson = JSON.parse(JSON.stringify(curRes));
            tabsFullDatas[selectTab] = majorResultJson
            handleSubTabChange(0);
        }

        return tempArr;
    }

    const deepCascaderArray = (data) => {
        let arrs: any = [];
        if (!!data.children && !!data.children.length) {
            for (let i = 0; i < data.children.length; i++) {
                if (!!Array.isArray(data.children[i].children))
                    arrs = arrs.concat(deepCascaderArray(data.children[i]));
                else
                    arrs.push(data.children[i]);

            }
        }
        return arrs;
    }

    const getCheckedNum = (arr: any[]): number => {
        let i = 0;
        arr.forEach(item => {
            if (item.checked) i++;
        })
        return i;
    }

    const handleListClick = (item) => {
        tabsFullDatas[selectTab] = item;
        setStelectTab(selectTab)
        setSelectDatas(item)
    };

    const handleSubTabChange = (value) => {
        tabsFullDatas[selectTab].forEach((element, index) => {
            element.checked = value == index ? true : false;
        });
        if (selectMold === 'select-cascader') {

        }
    }

    const getComponentDatas = (value) => {
        return tabsFullDatas[value]
    }
    return (
        <View className='search-main-box'>
            <View className={`search-nav-tab ${selectTab ? 'nav-tab-no-radius' : ''}`} onClick={handleClickSelectInit}>
                {
                    tabs.map((item: any) => (
                        <View
                            key={item.keys}
                            className={`search-tab-item ${selectTab === item.keys ? 'actived' : ''}`}
                            onClick={() => handleClickTabs(item.keys, item.mold)}
                        >
                            <AtBadge
                                {...getBadgeValue(item.keys, item.mold)}
                                className="badge-color"
                                key={item.keys}
                            >
                                <Text className="tab-bar-text">{item.name}&emsp;</Text>
                            </AtBadge>
                            {
                                selectTab === item.keys
                                    ? <AtIcon value="chevron-up" size="14" color="#ff6e00" className="nav-tab-ico" />
                                    : <AtIcon value="chevron-down" size="14" color="#A6A8AE" className="nav-tab-ico" />
                            }
                        </View>
                    ))
                }
            </View>
            <View className={`search-box ${!selectTab ? 'no-open' : ''} ${!!props.autoHeight} ? box-auto-height : ''`}>
                {
                    !!selectTab && (
                        <Fragment>
                            <View className="search-center">
                                {
                                    tabs.map((item: any) => (
                                        // 动态组件渲染
                                        item.keys == selectTab &&
                                        BuilderSearch.ComponentRender({
                                            name: item.mold, //componentName
                                            props: {
                                                tabList: tabList[item.keys],
                                                datas: getComponentDatas(item.keys),
                                                onChange: handleListClick,
                                                onSubTabChange: handleSubTabChange
                                            }
                                        })
                                    ))
                                }

                            </View>
                            <View className="search-footer">
                                <View className="btn reset-btn" onClick={handleReset}>重置</View>
                                <View className="btn confirm-btn" onClick={handleConfirm}>确定</View>
                            </View>
                        </Fragment>
                    )
                }
            </View>
            {selectTab && <View className="floating-layer" onClick={() => handleSelectTab('')} catchMove={true}></View>}
        </View>
    );
};
export default LinkageSearch;