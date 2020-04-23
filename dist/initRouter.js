"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const HomeIconWithBadge_1 = __importDefault(require("./HomeIconWithBadge"));
const native_1 = require("@react-navigation/native");
const stack_1 = require("@react-navigation/stack");
const bottom_tabs_1 = require("@react-navigation/bottom-tabs");
const getWrappedScreen_1 = __importDefault(require("./getWrappedScreen"));
const utils_1 = require("./utils");
exports.getNavigationOption = utils_1.getNavigationOption;
const NavigationService_1 = require("./NavigationService");
const config_1 = require("./config");
function getStackNavigator(pageList, navigationOptions, Taro) {
    const Stack = stack_1.createStackNavigator();
    return (react_1.default.createElement(Stack.Navigator, { headerMode: "screen" }, pageList.map(item => {
        const key = item[0];
        const screen = getWrappedScreen_1.default(item[1], navigationOptions, Taro);
        return react_1.default.createElement(Stack.Screen, { name: key, component: screen, options: screen.navigationOptions });
    })));
}
function getBottomTabConfig(pageList, tabBar, navigationOptions, Taro) {
    const routerConfig = [];
    const tabBarRouterNames = tabBar.list.reduce((acc, cur) => acc + ' ' + cur.pagePath, '');
    tabBar.list.forEach(item => {
        const currentTabPagePath = item.pagePath;
        const currentTabBar = pageList.find(pageItem => pageItem[0] === currentTabPagePath); // 找到该tabBar对应在pageList中的一项
        if (currentTabBar) {
            const childStackList = pageList.filter(pathItem => tabBarRouterNames.indexOf(pathItem[0]) < 0); // 将不存在于tabBar.list里的page作为子stack page
            let stackPageList = [];
            stackPageList.push(currentTabBar);
            stackPageList = stackPageList.concat(childStackList);
            routerConfig.push({
                name: currentTabBar[0],
                element: getStackNavigator(stackPageList, navigationOptions, Taro),
            });
        }
    });
    console.log('routerConfig', routerConfig);
    return routerConfig;
}
function getTabBarVisible(route) {
    const tabVisible = config_1._globalTabBarVisibleConfig._tabBarVisible;
    if (typeof tabVisible === 'boolean') {
        return tabVisible;
    }
    if (route && route.state) {
        return route.state.index === 0;
    }
    return undefined;
}
function getBottomTabNavigator(pageList, tabBar, navigationOptions, Taro) {
    const Tab = bottom_tabs_1.createBottomTabNavigator();
    const tabBarConfig = getBottomTabConfig(pageList, tabBar, navigationOptions, Taro);
    return (react_1.default.createElement(Tab.Navigator, { screenOptions: ({ route }) => {
            return {
                tabBarIcon: ({ focused }) => {
                    const routeName = route.name;
                    const tabBarListItem = tabBar.list.find(item => item.pagePath === routeName);
                    const tabBarIndex = tabBar.list.findIndex(item => item.pagePath === routeName);
                    return (react_1.default.createElement(HomeIconWithBadge_1.default, { index: tabBarIndex, focused: focused, icon: tabBarListItem && tabBarListItem.iconPath, selectedIcon: tabBarListItem && tabBarListItem.selectedIconPath, text: tabBarListItem && tabBarListItem.text, color: config_1._globalTabBarStyleConfig._tabColor ? config_1._globalTabBarStyleConfig._tabColor : tabBar.color, selectedColor: config_1._globalTabBarStyleConfig._tabSelectedColor
                            ? config_1._globalTabBarStyleConfig._tabSelectedColor
                            : tabBar.selectedColor }));
                },
                tabBarVisible: getTabBarVisible(route),
            };
        }, tabBarOptions: {
            showLabel: false,
            activeTintColor: tabBar.selectedColor || '#3cc51f',
            inactiveTintColor: tabBar.color || '#7A7E83',
        }, tabBar: props => {
            let bgColor = tabBar.backgroundColor || '#ffffff';
            if (config_1._globalTabBarStyleConfig._tabBackgroundColor) {
                bgColor = config_1._globalTabBarStyleConfig._tabBackgroundColor;
            }
            const borderTopColor = !config_1._globalTabBarStyleConfig._tabBorderStyle || config_1._globalTabBarStyleConfig._tabBorderStyle === 'black'
                ? '#cecece'
                : '#fff';
            return (react_1.default.createElement(bottom_tabs_1.BottomTabBar, Object.assign({}, props, { style: {
                    borderTopColor,
                    backgroundColor: bgColor,
                } })));
        } }, tabBarConfig.map(item => {
        const c = () => item.element;
        return react_1.default.createElement(Tab.Screen, { name: item.name, component: c });
    })));
}
const initRouter = (pageList, Taro, appConfig) => {
    const { window } = appConfig;
    const tabBar = appConfig.tabBar;
    const navigationOptions = utils_1.getNavigationOption(window);
    const isTab = tabBar && tabBar.list && Array.isArray(tabBar.list) && tabBar.list.length > 0;
    const element = (react_1.default.createElement(native_1.NavigationContainer, { ref: NavigationService_1.navigationRef }, isTab
        ? getBottomTabNavigator(pageList, tabBar, navigationOptions, Taro)
        : getStackNavigator(pageList, navigationOptions, Taro)));
    return () => element;
};
exports.initRouter = initRouter;
