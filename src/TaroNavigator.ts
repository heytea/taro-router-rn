import QueryString from 'query-string';
import NavigationService from './NavigationService';
import { errorHandler, successHandler, NavigateOption, NavigateBackOption } from './utils';

export default class TaroNavigator {
  static bind(Taro: Taro) {
    Taro.navigateTo = this.wxNavigateTo;
    Taro.redirectTo = this.wxRedirectTo;
    Taro.navigateBack = this.wxNavigateBack;
    Taro.switchTab = this.wxSwitchTab.bind;
    Taro.getCurrentPages = this.wxGetCurrentPages;
    Taro.reLaunch = this.wxReLaunch;

    // ✅Taro.setNavigationBarTitle = this.setNavigationBarTitle.bind(this);
    // ✅Taro.setNavigationBarColor = this.setNavigationBarColor.bind(this);
    // ✅Taro.showNavigationBarLoading = this.showNavigationBarLoading.bind(this);
    // ✅Taro.hideNavigationBarLoading = this.hideNavigationBarLoading.bind(this);

    // Taro.pageScrollTo = this.pageScrollTo.bind(this);

    // Taro.startPullDownRefresh = this.startPullDownRefresh.bind(this);
    // Taro.stopPullDownRefresh = this.stopPullDownRefresh.bind(this);

    // Taro.setTabBarBadge = this.setTabBarBadge.bind(this);
    // Taro.removeTabBarBadge = this.removeTabBarBadge.bind(this);
    // Taro.showTabBarRedDot = this.showTabBarRedDot.bind(this);
    // Taro.hideTabBarRedDot = this.hideTabBarRedDot.bind(this);
    // Taro.setTabBarStyle = this.setTabBarStyle.bind(this);
    // Taro.setTabBarItem = this.setTabBarItem.bind(this);
    // ✅Taro.showTabBar = this.showTabBar.bind(this);
    // ✅Taro.hideTabBar = this.hideTabBar.bind(this);
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

  static wxNavigateBack(option?: NavigateBackOption) {
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
