import QueryString from 'query-string';
import NavigationService from './NavigationService';

export interface wxNavigateToOption {
  url: string;
  success: () => void;
  fail: () => void;
  complete: () => void;
}

export default class bindTaroNavigate {
  static bind(Taro: Taro) {
    Taro.navigateTo = this.wxNavigateTo.bind(this);
    // Taro.redirectTo = this.wxRedirectTo.bind(this)
    // Taro.navigateBack = this.wxNavigateBack.bind(this)
    // Taro.switchTab = this.wxSwitchTab.bind(this)
    // Taro.getCurrentPages = this.wxGetCurrentPages.bind(this)
    // Taro.reLaunch = this.wxReLaunch.bind(this)
    // Taro.showTabBar = this.showTabBar.bind(this)
    // Taro.hideTabBar = this.hideTabBar.bind(this)
    // Taro.showTabBarRedDot = this.showTabBarRedDot.bind(this)
    // Taro.hideTabBarRedDot = this.hideTabBarRedDot.bind(this)
    // Taro.setTabBarBadge = this.setTabBarBadge.bind(this)
    // Taro.removeTabBarBadge = this.removeTabBarBadge.bind(this)
    // Taro.setTabBarItem = this.setTabBarItem.bind(this)
  }

  static wxNavigateTo(option: wxNavigateToOption) {
    let { url, success, fail, complete } = option;
    if (url.startsWith('/')) {
      url = url.substr(1);
    }
    let obj = QueryString.parseUrl(url);
    console.log('wxNavigateTo obj', obj);
    try {
      NavigationService.push(obj.url, obj.query);
    } catch (error) {}
  }
}
