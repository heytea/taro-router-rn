"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const query_string_1 = __importDefault(require("query-string"));
const NavigationService_1 = __importDefault(require("./NavigationService"));
const utils_1 = require("./utils");
class TaroProvider {
    static bind(Taro) {
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
exports.default = TaroProvider;
