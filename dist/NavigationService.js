"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_navigation_1 = require("react-navigation");
let _navigator;
let _currentRouteName;
let _previousRouteName;
let _routes = [];
const setTopLevelNavigator = (navigatorRef) => {
    _navigator = navigatorRef;
};
const setCurrentRouteName = (name) => {
    _currentRouteName = name;
};
const setPreviousRouteName = (name) => {
    _previousRouteName = name;
};
const setRoutes = (routes) => {
    _routes = routes;
};
const setParams = (options) => {
    _navigator && _navigator.dispatch(react_navigation_1.NavigationActions.setParams(options));
};
const getNavigator = () => _navigator;
const getCurrentRouteName = () => _currentRouteName;
const getPreviousRouteName = () => _previousRouteName;
const getRoutes = () => _routes;
/**
 * 会复用栈内已存在的页面
 * @param routeName
 * @param params
 */
const navigate = (options) => {
    _navigator && _navigator.dispatch(react_navigation_1.NavigationActions.navigate(options));
};
/**
 * 无论如何都会向栈增加页面
 * @param routeName
 * @param params
 * @param action
 * @param key
 */
const push = (options) => {
    _navigator && _navigator.dispatch(react_navigation_1.StackActions.push(options));
};
const goBack = (options) => {
    _navigator && _navigator.dispatch(react_navigation_1.NavigationActions.back(options));
};
const reset = (options) => {
    _navigator && _navigator.dispatch(react_navigation_1.StackActions.reset(options));
};
const replace = (options) => {
    _navigator && _navigator.dispatch(react_navigation_1.StackActions.replace(options));
};
const popToTop = (options) => {
    _navigator && _navigator.dispatch(react_navigation_1.StackActions.popToTop(options));
};
const pop = (options) => {
    _navigator && _navigator.dispatch(react_navigation_1.StackActions.pop(options));
};
const NavigationService = {
    setTopLevelNavigator,
    setCurrentRouteName,
    getCurrentRouteName,
    setPreviousRouteName,
    getPreviousRouteName,
    setRoutes,
    getRoutes,
    setParams,
    getNavigator,
    navigate,
    push,
    goBack,
    reset,
    replace,
    popToTop,
    pop,
};
exports.default = NavigationService;
