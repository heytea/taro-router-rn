import {
  NavigationActions,
  StackActions,
  NavigationContainerComponent,
  NavigationPopToTopActionPayload,
  NavigationReplaceActionPayload,
  NavigationResetActionPayload,
  NavigationBackActionPayload,
  NavigationPushActionPayload,
  NavigationNavigateActionPayload,
  NavigationPopActionPayload,
  NavigationRoute,
} from 'react-navigation';

let _navigator: NavigationContainerComponent | null;
let _currentRouteName: string | null;
let _previousRouteName: string | null;
let _routes: NavigationRoute[] = [];

const setTopLevelNavigator = (navigatorRef: NavigationContainerComponent | null) => {
  _navigator = navigatorRef;
};

const setCurrentRouteName = (name: string | null) => {
  _currentRouteName = name;
};

const setPreviousRouteName = (name: string | null) => {
  _previousRouteName = name;
};

const setRoutes = (routes: NavigationRoute[]) => {
  _routes = routes;
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
const navigate = (options: NavigationNavigateActionPayload) => {
  _navigator && _navigator.dispatch(NavigationActions.navigate(options));
};

/**
 * 无论如何都会向栈增加页面
 * @param routeName
 * @param params
 * @param action
 * @param key
 */
const push = (options: NavigationPushActionPayload) => {
  _navigator && _navigator.dispatch(StackActions.push(options));
};

const goBack = (options?: NavigationBackActionPayload) => {
  _navigator && _navigator.dispatch(NavigationActions.back(options));
};

const reset = (options: NavigationResetActionPayload) => {
  _navigator && _navigator.dispatch(StackActions.reset(options));
};

const replace = (options: NavigationReplaceActionPayload) => {
  _navigator && _navigator.dispatch(StackActions.replace(options));
};

const popToTop = (options?: NavigationPopToTopActionPayload) => {
  _navigator && _navigator.dispatch(StackActions.popToTop(options));
};

const pop = (options: NavigationPopActionPayload) => {
  _navigator && _navigator.dispatch(StackActions.pop(options));
};

const NavigationService = {
  setTopLevelNavigator,
  setCurrentRouteName,
  getCurrentRouteName,
  setPreviousRouteName,
  getPreviousRouteName,
  setRoutes,
  getRoutes,
  getNavigator,
  navigate,
  push,
  goBack,
  reset,
  replace,
  popToTop,
  pop,
};

export default NavigationService;
