"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const native_1 = require("@react-navigation/native");
exports.navigationRef = react_1.default.createRef();
function navigate(option) {
    exports.navigationRef.current &&
        exports.navigationRef.current.dispatch(native_1.CommonActions.navigate({ name: option.routeName, params: option.params }));
}
function push(option) {
    exports.navigationRef.current && exports.navigationRef.current.dispatch(native_1.StackActions.push(option.routeName, option.params));
}
function goBack() {
    exports.navigationRef.current && exports.navigationRef.current.dispatch(native_1.CommonActions.goBack());
}
// export function reset(option: NavigationResetActionPayload) {
//   navigationRef.current &&
//     navigationRef.current.dispatch(CommonActions.reset({ index: option.index, routes: option.actions }));
// }
function replace(option) {
    exports.navigationRef.current && exports.navigationRef.current.dispatch(native_1.StackActions.replace(option.routeName, option.params));
}
function popToTop() {
    exports.navigationRef.current && exports.navigationRef.current.dispatch(native_1.StackActions.popToTop());
}
function pop(option) {
    const { n = 1 } = option || {};
    exports.navigationRef.current && exports.navigationRef.current.dispatch(native_1.StackActions.pop(n));
}
exports.default = {
    navigate,
    push,
    goBack,
    replace,
    popToTop,
    pop,
};
