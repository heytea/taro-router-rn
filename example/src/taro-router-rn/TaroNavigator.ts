import QueryString from 'query-string';
import NavigationService from './NavigationService';
import { errorHandler, successHandler } from './utils';

export default class TaroNavigator {
  static bind(Taro: Taro) {
    Taro.navigateTo = this.wxNavigateTo;
    Taro.redirectTo = this.wxRedirectTo;
    Taro.navigateBack = this.wxNavigateBack;
    Taro.switchTab = this.wxSwitchTab;
    Taro.getCurrentPages = this.wxGetCurrentPages;
    Taro.reLaunch = this.wxReLaunch;
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
    } catch (error) {
      return errorHandler(error, fail, complete);
    }
    return successHandler(success, complete);
  }

  /**
   * 关闭当前页面，跳转到应用内的某个页面。但是不允许跳转到 tabbar 页面。
   */
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
    } catch (error) {
      return errorHandler(error, fail, complete);
    }
    return successHandler(success, complete);
  }

  static wxNavigateBack(option?: NavigateBackOption) {
    let { delta = 1, success, fail, complete } = option || {};
    try {
      NavigationService.pop({ n: delta });
    } catch (error) {
      return errorHandler(error, fail, complete);
    }
    return successHandler(success, complete);
  }

  /**
   * 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
   */
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
      NavigationService.popToTop();
      NavigationService.navigate({ routeName: obj.url, params: obj.query });
    } catch (error) {
      return errorHandler(error, fail, complete);
    }
    return successHandler(success, complete);
  }

  static wxGetCurrentPages() {
    const routes = NavigationService.getRoutes();
    if (routes.length > 0) {
      return routes.map((item) => {
        return { route: item.routeName };
      });
    }
    return [];
  }

  /**
   * 关闭所有页面，打开到应用内的某个页面
   */
  static wxReLaunch(option: NavigateOption) {
    let { url, success, fail, complete } = option;
    if (!url) {
      return Promise.reject(new Error('wxNavigateTo(option: NavigateOption) option.url is undefined'));
    }
    let obj = QueryString.parseUrl(url);
    try {
      NavigationService.popToTop();
      NavigationService.replace({ routeName: obj.url, params: obj.query });
    } catch (error) {
      return errorHandler(error, fail, complete);
    }
    return successHandler(success, complete);
  }
}
