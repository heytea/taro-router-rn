"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function upperCaseFirstLetter(string) {
    if (typeof string !== 'string') {
        return string;
    }
    string = string.replace(/^./, match => match.toUpperCase());
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
exports.default = {
    shouldBeObject,
    isFunction,
    successHandler,
    errorHandler,
};
