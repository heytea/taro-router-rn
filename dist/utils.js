"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function upperCaseFirstLetter(string) {
    if (typeof string !== 'string') {
        return string;
    }
    string = string.replace(/^./, (match) => match.toUpperCase());
    return string;
}
function getParameterError({ name = '', para, correct, wrong, }) {
    const parameter = para ? `parameter.${para}` : 'parameter';
    const errorType = upperCaseFirstLetter(wrong === null ? 'Null' : typeof wrong);
    return `${name}:fail parameter error: ${parameter} should be ${correct} instead of ${errorType}`;
}
function shouldBeObject(target) {
    if (target && typeof target === 'object') {
        return { res: true };
    }
    return {
        res: false,
        msg: getParameterError({
            correct: 'Object',
            wrong: target,
        }),
    };
}
exports.shouldBeObject = shouldBeObject;
function isFunction(f) {
    return typeof f === 'function';
}
exports.isFunction = isFunction;
function isUrl(value) {
    const protocolAndDomainRE = /^(?:\w+:)?\/\/(\S+)$/;
    const localhostDomainRE = /^localhost[:?\d]*(?:[^:?\d]\S*)?$/;
    const nonLocalhostDomainRE = /^[^\s.]+\.\S{2,}$/;
    if (typeof value !== 'string') {
        return false;
    }
    let match = value.match(protocolAndDomainRE);
    if (!match) {
        return false;
    }
    let everythingAfterProtocol = match[1];
    if (!everythingAfterProtocol) {
        return false;
    }
    if (localhostDomainRE.test(everythingAfterProtocol) || nonLocalhostDomainRE.test(everythingAfterProtocol)) {
        return true;
    }
    return false;
}
exports.isUrl = isUrl;
function successHandler(success, complete) {
    success && isFunction(success) && success();
    complete && isFunction(complete) && complete();
    return Promise.resolve(true);
}
exports.successHandler = successHandler;
function errorHandler(error, fail, complete) {
    fail && isFunction(fail) && fail(error);
    complete && isFunction(complete) && complete();
    return Promise.reject(error);
}
exports.errorHandler = errorHandler;
exports.HEADER_CONFIG_MAP = {
    navigationBarTitleText: 'title',
    navigationBarTextStyle: 'headerTintColor',
    navigationBarBackgroundColor: 'backgroundColor',
    enablePullDownRefresh: 'enablePullDownRefresh',
    navigationStyle: 'navigationStyle',
    disableScroll: 'disableScroll',
    backgroundColor: 'backgroundColor',
    stackNavigatorOptions: 'stackNavigatorOptions',
    rn: 'rn',
};
function getNavigationOption(config) {
    let navigationOption = {};
    if (typeof config !== 'object') {
        return navigationOption;
    }
    Object.keys(config).forEach((key) => {
        if (exports.HEADER_CONFIG_MAP[key]) {
            navigationOption[exports.HEADER_CONFIG_MAP[key]] = config[key];
        }
    });
    return navigationOption;
}
exports.getNavigationOption = getNavigationOption;
function getRnNavigationOption(screenRnConfig, globalRnConfig) {
    let config = screenRnConfig ? screenRnConfig : globalRnConfig;
    if (!config) {
        return undefined;
        // config = { statusBar: {}, navigationBarTitleStyle: {}, navigationBarBottomStyle: {}, navigationBarMenus: [] };
    }
    else {
        config.statusBar = config.statusBar ? config.statusBar : {};
        config.navigationBarTitleStyle = config.navigationBarTitleStyle ? config.navigationBarTitleStyle : {};
        config.navigationBarBottomStyle = config.navigationBarBottomStyle ? config.navigationBarBottomStyle : {};
        // config.navigationBarMenus = config.navigationBarMenus ? config.navigationBarMenus : [];
    }
    const rn = {
        // 以下属性，Taro官方不存在，喜茶自定义
        statusBar: {
            backgroundColor: config.statusBar.backgroundColor ? config.statusBar.backgroundColor : '#fff',
            barStyle: config.statusBar.barStyle ? config.statusBar.barStyle : 'dark-content',
            translucent: config.statusBar.translucent,
        },
        navigationBarTitleStyle: {
            color: config.navigationBarTitleStyle.color ? config.navigationBarTitleStyle.color : '#343434',
            fontSize: config.navigationBarTitleStyle.fontSize ? config.navigationBarTitleStyle.fontSize : 19,
            fontFamily: config.navigationBarTitleStyle.fontFamily ? config.navigationBarTitleStyle.fontFamily : undefined,
            fontWeight: config.navigationBarTitleStyle.fontWeight ? config.navigationBarTitleStyle.fontWeight : '400',
        },
        navigationBarHeight: config.navigationBarHeight ? config.navigationBarHeight : 44,
        navigationBarShadow: config.navigationBarShadow ? config.navigationBarShadow : false,
        navigationBarBottomStyle: {
            height: config.navigationBarBottomStyle.height ? config.navigationBarBottomStyle.height : 1,
            width: config.navigationBarBottomStyle.width ? config.navigationBarBottomStyle.width : '100%',
            backgroundColor: config.navigationBarBottomStyle.backgroundColor
                ? config.navigationBarBottomStyle.backgroundColor
                : '#ccc',
        },
        navigationBarBackgroundColor: config.navigationBarBackgroundColor ? config.navigationBarBackgroundColor : '#fff',
        navigationBarTitlePosition: config.navigationBarTitlePosition ? config.navigationBarTitlePosition : 'center',
        navigationBarBackIcon: config.navigationBarBackIcon
            ? config.navigationBarBackIcon
            : require('./img/arrow_back.png'),
        navigationBarMenus: config.navigationBarMenus
            ? config.navigationBarMenus
            : [
                {
                    icon: undefined,
                    text: '',
                    color: '#343434',
                    click: () => { },
                },
            ],
    };
    return rn;
}
exports.getRnNavigationOption = getRnNavigationOption;
