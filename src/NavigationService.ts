import { NavigationActions, StackActions, NavigationContainerComponent, NavigationParams, NavigationPopToTopActionPayload, NavigationNavigateAction } from 'react-navigation';

let _navigator: NavigationContainerComponent | null;

const setTopLevelNavigator = (navigatorRef: NavigationContainerComponent | null) => {
  _navigator = navigatorRef;
};

const getNavigator = () => _navigator;

/**
 * 会复用栈内已存在的页面
 * @param routeName 
 * @param params 
 */
const navigate = (routeName: string, params?: NavigationParams | undefined) => {
  _navigator && _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    }),
  );
};

/**
 * 无论如何都会向栈增加页面
 * @param routeName 
 * @param params 
 * @param action 
 * @param key 
 */
const push = (routeName: string, params?: NavigationParams, action?: NavigationNavigateAction, key?: string) => {
  _navigator && _navigator.dispatch(
    StackActions.push({
      routeName,
      params,
      action,
      key,
    })
  )
}

const goBack = (pageKey?: string | null | undefined) => {
  _navigator && _navigator.dispatch(NavigationActions.back({ key: pageKey }));
};

const reset = (index: number, routeName: string, key?: string | null | undefined) => {
  const resetAction = StackActions.reset({
    index,
    actions: [NavigationActions.navigate({ routeName })],
    key,
  });
  _navigator && _navigator.dispatch(resetAction);
};

const replace = (routeName: string) => {
  _navigator && _navigator.dispatch(StackActions.replace({ routeName }));
};

const popToTop = (options?: NavigationPopToTopActionPayload) => {
  _navigator && _navigator.dispatch(StackActions.popToTop(options));
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

export default NavigationService;
