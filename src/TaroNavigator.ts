import QueryString from 'query-string';
import NavigationService from './NavigationService';
import { errorHandler, successHandler } from './utils';

export default class TaroNavigator {
  static hasBind = false;
  static currentPages: string[] = [];

  static bind(Taro: Taro, initRouteName: string) {
    if (TaroNavigator.hasBind) {
      return;
    }
    Taro.navigateTo = this.wxNavigateTo;
    Taro.redirectTo = this.wxRedirectTo;
    Taro.navigateBack = this.wxNavigateBack;
    Taro.switchTab = this.wxSwitchTab;
    Taro.getCurrentPages = this.wxGetCurrentPages;
    Taro.reLaunch = this.wxReLaunch;
    TaroNavigator.currentPages = [initRouteName];
    TaroNavigator.hasBind = true;
  }

  static wxNavigateTo(option: NavigateOption) {
    let { url, success, fail, complete } = option;
    if (!url) {
      return Promise.reject(new Error('wxNavigateTo(option: NavigateOption) option.url is undefined'));
    }
    if (url.startsWith('/')) {
      url = url.substr(1);
    }
    let obj = QueryString.parseUrl(url);
    try {
      NavigationService.push({ routeName: obj.url, params: obj.query });
      TaroNavigator.currentPages.push(obj.url);
    } catch (error) {
      return errorHandler(error, fail, complete);
    }
    return successHandler(success, complete);
  }

  static wxRedirectTo(option: NavigateOption) {
    let { url, success, fail, complete } = option;
    if (!url) {
      return Promise.reject(new Error('wxNavigateTo(option: NavigateOption) option.url is undefined'));
    }
    if (url.startsWith('/')) {
      url = url.substr(1);
    }

    let obj = QueryString.parseUrl(url);
    try {
      NavigationService.replace({ routeName: obj.url, params: obj.query });
      if (TaroNavigator.currentPages.length > 0) {
        TaroNavigator.currentPages[TaroNavigator.currentPages.length - 1] = obj.url;
      }
    } catch (error) {
      return errorHandler(error, fail, complete);
    }
    return successHandler(success, complete);
  }

  static wxNavigateBack(option?: NavigateBackOption) {
    let { delta = 1, success, fail, complete } = option || {};
    try {
      NavigationService.pop({ n: delta });
      if (TaroNavigator.currentPages.length > 0) {
        const end = TaroNavigator.currentPages.length - 1 - delta;
        TaroNavigator.currentPages.slice(0, end);
      }
    } catch (error) {
      return errorHandler(error, fail, complete);
    }
    return successHandler(success, complete);
  }

  static wxSwitchTab(option: NavigateOption) {
    let { url, success, fail, complete } = option;
    if (!url) {
      return Promise.reject(new Error('wxNavigateTo(option: NavigateOption) option.url is undefined'));
    }
    if (url.startsWith('/')) {
      url = url.substr(1);
    }
    let obj = QueryString.parseUrl(url);
    try {
      NavigationService.navigate({ routeName: obj.url, params: obj.query });
      TaroNavigator.currentPages.push(obj.url);
    } catch (error) {
      return errorHandler(error, fail, complete);
    }
    return successHandler(success, complete);
  }

  static wxGetCurrentPages() {
    return TaroNavigator.currentPages;
  }

  static wxReLaunch(option: NavigateOption) {
    let { url = 'index', success, fail, complete } = option;
    try {
      NavigationService.popToTop();
      this.wxRedirectTo({ url });
      TaroNavigator.currentPages = [url];
    } catch (error) {
      return errorHandler(error, fail, complete);
    }
    return successHandler(success, complete);
  }
}
