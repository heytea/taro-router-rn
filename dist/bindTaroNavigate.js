"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const query_string_1 = __importDefault(require("query-string"));
const NavigationService_1 = __importDefault(require("./NavigationService"));
class bindTaroNavigate {
    static bind(Taro) {
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
    static wxNavigateTo(option) {
        let { url, success, fail, complete } = option;
        if (url.startsWith('/')) {
            url = url.substr(1);
        }
        let obj = query_string_1.default.parseUrl(url);
        console.log('wxNavigateTo obj', obj);
        try {
            NavigationService_1.default.push(obj.url, obj.query);
        }
        catch (error) { }
    }
}
exports.default = bindTaroNavigate;
