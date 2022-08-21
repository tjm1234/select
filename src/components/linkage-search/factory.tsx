import React from 'react';

const componentPool: RegisterConfig[] = [];
const componentNames: string[] = [];
let anonymousIndex = 0;

export interface RegisterBasicConfig {
    name?: string;
    props?: any;
    [keyName: string]: any;
}
export interface RegisterConfig {
    name?: string;
    component: React.ComponentType;
}
// 注册组件
export const Register = (config: RegisterBasicConfig) => {
    return function <T extends React.ComponentType>(component: T): T {
        const renderer = ComponentRegister({
            ...config,
            component: component
        });
        return renderer.component as T;
    };
}
// 注册组件
export const ComponentRegister = (config: RegisterConfig): RegisterConfig => {
    config.name = config.name || `anonymous-${anonymousIndex++}`;

    // 检查组件name是否是否使用
    if (~componentNames.indexOf(config.name)) {
        throw new Error(
            `The component with name "${config.name}" has already exists, please try another name!`
        );
    }
    componentNames.push(config.name);
    componentPool.push(config)
    return config;
}

/**
 * 获取组件
 * @param config 组件调用配置
 */
export const getComponentFromPool = (config: RegisterBasicConfig): RegisterConfig => {
    for(let i = 0; i< componentPool.length; i++) {
        let item = componentPool[i];
        if (item.name === config.name) {
            return item;
        }
    }
    throw new Error(
        `The componet with name "${config.name}" has not registered yet!`
    )
}

/**
 * 渲染组件
 */
export const ComponentRender = (config: RegisterBasicConfig) => {
    let render = getComponentFromPool(config);
    return <render.component 
        {...config.props}
    />
}