import React from 'react';
import { StackActions, CommonActions } from '@react-navigation/native';

export const navigationRef = React.createRef<any>();
interface NavigationParams {
  [key: string]: any;
}
interface NavigationNavigateActionPayload {
  routeName: string;
  params?: NavigationParams;
  key?: string;
}
interface NavigationNavigatePopPayload {
  n?: number;
}
function navigate(option: NavigationNavigateActionPayload) {
  navigationRef.current &&
    navigationRef.current.dispatch(CommonActions.navigate({ name: option.routeName, params: option.params }));
}

function push(option: NavigationNavigateActionPayload) {
  navigationRef.current && navigationRef.current.dispatch(StackActions.push(option.routeName, option.params));
}

function goBack() {
  navigationRef.current && navigationRef.current.dispatch(CommonActions.goBack());
}

// export function reset(option: NavigationResetActionPayload) {
//   navigationRef.current &&
//     navigationRef.current.dispatch(CommonActions.reset({ index: option.index, routes: option.actions }));
// }

function replace(option: NavigationNavigateActionPayload) {
  navigationRef.current && navigationRef.current.dispatch(StackActions.replace(option.routeName, option.params));
}

function popToTop() {
  navigationRef.current && navigationRef.current.dispatch(StackActions.popToTop());
}

function pop(option: NavigationNavigatePopPayload) {
  const { n = 1 } = option || {};
  navigationRef.current && navigationRef.current.dispatch(StackActions.pop(n));
}

export default {
  navigate,
  push,
  goBack,
  replace,
  popToTop,
  pop,
};
