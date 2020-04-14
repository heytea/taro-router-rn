import QueryString from 'query-string';
import NavigationService from './NavigationService';
import { errorHandler, successHandler, SuccessFun, FailFun, CompleteFun } from './utils';

export interface NavigateOption {
  url?: string;
  success?: SuccessFun;
  fail?: FailFun;
  complete?: CompleteFun;
  delta?: number;
}

export default class TaroProvider {
  static bind(Taro: Taro) {
    Taro.navigateTo = this.wxNavigateTo.bind(this);
    Taro.redirectTo = this.wxRedirectTo.bind(this);
    Taro.navigateBack = this.wxNavigateBack.bind(this);
    Taro.switchTab = this.wxSwitchTab.bind(this);
    Taro.getCurrentPages = this.wxGetCurrentPages.bind(this);
    Taro.reLaunch = this.wxReLaunch.bind(this);
    // Taro.showTabBar = this.showTabBar.bind(this);
    // Taro.hideTabBar = this.hideTabBar.bind(this);
    // Taro.showTabBarRedDot = this.showTabBarRedDot.bind(this);
    // Taro.hideTabBarRedDot = this.hideTabBarRedDot.bind(this);
    // Taro.setTabBarBadge = this.setTabBarBadge.bind(this);
    // Taro.removeTabBarBadge = this.removeTabBarBadge.bind(this);
    // Taro.setTabBarItem = this.setTabBarItem.bind(this);
  }

  static wxNavigateTo(option: NavigateOption) {
    let { url, success, fail, complete } = option;
    if (!url) {
      return Promise.reject(
        new Error('wxNavigateTo(option: NavigateOption) option.url is undefined'),
      );
    }
    if (url.startsWith('/')) {
      url = url.substr(1);
    }
    let obj = QueryString.parseUrl(url);
    try {
      NavigationService.push({ routeName: obj.url, params: obj.query });
    } catch (error) {
      return errorHandler(error, fail, complete);
    }
    return successHandler(success, complete);
  }

  static wxRedirectTo(option: NavigateOption) {
    let { url, success, fail, complete } = option;
    if (!url) {
      return Promise.reject(
        new Error('wxNavigateTo(option: NavigateOption) option.url is undefined'),
      );
    }
    if (url.startsWith('/')) {
      url = url.substr(1);
    }

    let obj = QueryString.parseUrl(url);
    try {
      NavigationService.replace({ routeName: obj.url, params: obj.query });
    } catch (error) {
      return errorHandler(error, fail, complete);
    }
    return successHandler(success, complete);
  }

  static wxNavigateBack(option?: NavigateOption) {
    let { delta = 1, success, fail, complete } = option || {};
    try {
      NavigationService.pop({ n: delta });
    } catch (error) {
      return errorHandler(error, fail, complete);
    }
    return successHandler(success, complete);
  }

  static wxSwitchTab(option: NavigateOption) {
    let { url, success, fail, complete } = option;
    if (!url) {
      return Promise.reject(
        new Error('wxNavigateTo(option: NavigateOption) option.url is undefined'),
      );
    }
    if (url.startsWith('/')) {
      url = url.substr(1);
    }
    let obj = QueryString.parseUrl(url);
    try {
      NavigationService.navigate({ routeName: obj.url, params: obj.query });
    } catch (error) {
      return errorHandler(error, fail, complete);
    }
    return successHandler(success, complete);
  }

  static wxGetCurrentPages() {
    const routes = NavigationService.getRoutes();
    if (routes.length > 0) {
      return routes.map(item => {
        return { route: item.routeName };
      });
    }
    return [];
  }

  static wxReLaunch(option: NavigateOption) {
    let { url, success, fail, complete } = option;
    const pages = this.wxGetCurrentPages();
    const length = pages.length;
    try {
      if (length > 0) {
        this.wxNavigateBack({ delta: length });
      }
      this.wxRedirectTo({ url });
    } catch (error) {
      return errorHandler(error, fail, complete);
    }
    return successHandler(success, complete);
  }
}
