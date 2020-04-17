"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const query_string_1 = __importDefault(require("query-string"));
const NavigationService_1 = __importDefault(require("./NavigationService"));
const utils_1 = require("./utils");
class TaroNavigator {
    static bind(Taro) {
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
    static wxNavigateTo(option) {
        let { url, success, fail, complete } = option;
        if (!url) {
            return Promise.reject(new Error('wxNavigateTo(option: NavigateOption) option.url is undefined'));
        }
        if (url.startsWith('/')) {
            url = url.substr(1);
        }
        let obj = query_string_1.default.parseUrl(url);
        try {
            NavigationService_1.default.push({ routeName: obj.url, params: obj.query });
        }
        catch (error) {
            return utils_1.errorHandler(error, fail, complete);
        }
        return utils_1.successHandler(success, complete);
    }
    static wxRedirectTo(option) {
        let { url, success, fail, complete } = option;
        if (!url) {
            return Promise.reject(new Error('wxNavigateTo(option: NavigateOption) option.url is undefined'));
        }
        if (url.startsWith('/')) {
            url = url.substr(1);
        }
        let obj = query_string_1.default.parseUrl(url);
        try {
            NavigationService_1.default.replace({ routeName: obj.url, params: obj.query });
        }
        catch (error) {
            return utils_1.errorHandler(error, fail, complete);
        }
        return utils_1.successHandler(success, complete);
    }
    static wxNavigateBack(option) {
        let { delta = 1, success, fail, complete } = option || {};
        try {
            NavigationService_1.default.pop({ n: delta });
        }
        catch (error) {
            return utils_1.errorHandler(error, fail, complete);
        }
        return utils_1.successHandler(success, complete);
    }
    static wxSwitchTab(option) {
        let { url, success, fail, complete } = option;
        if (!url) {
            return Promise.reject(new Error('wxNavigateTo(option: NavigateOption) option.url is undefined'));
        }
        if (url.startsWith('/')) {
            url = url.substr(1);
        }
        let obj = query_string_1.default.parseUrl(url);
        try {
            NavigationService_1.default.navigate({ routeName: obj.url, params: obj.query });
        }
        catch (error) {
            return utils_1.errorHandler(error, fail, complete);
        }
        return utils_1.successHandler(success, complete);
    }
    static wxGetCurrentPages() {
        const routes = NavigationService_1.default.getRoutes();
        if (routes.length > 0) {
            return routes.map(item => {
                return { route: item.routeName };
            });
        }
        return [];
    }
    static wxReLaunch(option) {
        let { url, success, fail, complete } = option;
        const pages = this.wxGetCurrentPages();
        const length = pages.length;
        try {
            if (length > 0) {
                this.wxNavigateBack({ delta: length });
            }
            this.wxRedirectTo({ url });
        }
        catch (error) {
            return utils_1.errorHandler(error, fail, complete);
        }
        return utils_1.successHandler(success, complete);
    }
}
exports.default = TaroNavigator;
