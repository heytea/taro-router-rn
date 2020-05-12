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
