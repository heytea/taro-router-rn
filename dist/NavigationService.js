"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_navigation_1 = require("react-navigation");
let _navigator;
const setTopLevelNavigator = (navigatorRef) => {
    _navigator = navigatorRef;
};
const getNavigator = () => _navigator;
/**
 * 会复用栈内已存在的页面
 * @param routeName
 * @param params
 */
const navigate = (routeName, params) => {
    _navigator &&
        _navigator.dispatch(react_navigation_1.NavigationActions.navigate({
            routeName,
            params,
        }));
};
/**
 * 无论如何都会向栈增加页面
 * @param routeName
 * @param params
 * @param action
 * @param key
 */
const push = (routeName, params, action, key) => {
    _navigator &&
        _navigator.dispatch(react_navigation_1.StackActions.push({
            routeName,
            params,
            action,
            key,
        }));
};
const goBack = (pageKey) => {
    _navigator && _navigator.dispatch(react_navigation_1.NavigationActions.back({ key: pageKey }));
};
const reset = (index, routeName, key) => {
    const resetAction = react_navigation_1.StackActions.reset({
        index,
        actions: [react_navigation_1.NavigationActions.navigate({ routeName })],
        key,
    });
    _navigator && _navigator.dispatch(resetAction);
};
const replace = (routeName) => {
    _navigator && _navigator.dispatch(react_navigation_1.StackActions.replace({ routeName }));
};
const popToTop = (options) => {
    _navigator && _navigator.dispatch(react_navigation_1.StackActions.popToTop(options));
};
const NavigationService = {
    setTopLevelNavigator,
    getNavigator,
    navigate,
    push,
    goBack,
    reset,
    replace,
    popToTop,
};
exports.default = NavigationService;
