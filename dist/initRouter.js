"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const HomeIconWithBadge_1 = __importDefault(require("./HomeIconWithBadge"));
const react_navigation_1 = require("react-navigation");
const react_navigation_stack_1 = require("react-navigation-stack");
const react_navigation_tabs_1 = require("react-navigation-tabs");
const NavigationService_1 = __importDefault(require("./NavigationService"));
const TaroProvider_1 = __importDefault(require("./TaroProvider"));
const HEADER_CONFIG_MAP = {
    navigationBarTitleText: 'title',
    navigationBarTextStyle: 'headerTintColor',
    navigationBarBackgroundColor: 'backgroundColor',
    enablePullDownRefresh: 'enablePullDownRefresh',
    navigationStyle: 'navigationStyle',
    disableScroll: 'disableScroll',
    backgroundColor: 'backgroundColor',
    stackNavigatorOptions: 'stackNavigatorOptions',
};
function getNavigationOption(config) {
    let navigationOption = {};
    if (typeof config !== 'object') {
        return navigationOption;
    }
    Object.keys(config).forEach((key) => {
        if (HEADER_CONFIG_MAP[key]) {
            navigationOption[HEADER_CONFIG_MAP[key]] = config[key];
        }
    });
    return navigationOption;
}
exports.getNavigationOption = getNavigationOption;
// 获取TabBar类型路由配置
function getTabBarRouterConfig(pageList, tabBar, navigationOptions) {
    const routerConfig = {};
    const tabBarRouterNames = tabBar.list.reduce((acc, cur) => acc + ' ' + cur.pagePath, '');
    tabBar.list.forEach((item) => {
        const currentTabPagePath = item.pagePath;
        const currentTabBar = pageList.find((pageItem) => pageItem[0] === currentTabPagePath); // 找到该tabBar对应在pageList中的一项
        if (currentTabBar) {
            const childStackList = pageList.filter((pathItem) => tabBarRouterNames.indexOf(pathItem[0]) < 0); // 将不存在于tabBar.list里的page作为子stack page
            let stackPageList = [];
            stackPageList.push(currentTabBar);
            stackPageList = stackPageList.concat(childStackList);
            routerConfig[currentTabBar[0]] = getStackNavigator(stackPageList, navigationOptions);
        }
    });
    return routerConfig;
}
// 获取Stack类型路由配置
function getStackRouterConfig(pageList) {
    const routerConfig = {};
    pageList.forEach((item) => {
        const key = item[0];
        const value = item[1];
        routerConfig[key] = value;
    });
    return routerConfig;
}
function getTabBarVisible(navigation) {
    // const currentRoute = navigation.state.routes[navigation.state.index];
    // const currentRouteName = currentRoute.routeName;
    // console.log('currentRouteName', currentRouteName);
    return navigation.state.index === 0;
}
function getBottomTabNavigator(pageList, tabBar, navigationOptions) {
    const routerConfig = getTabBarRouterConfig(pageList, tabBar, navigationOptions);
    return react_navigation_tabs_1.createBottomTabNavigator(routerConfig, {
        defaultNavigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ focused, horizontal, tintColor }) => {
                const { routeName } = navigation.state;
                const tabBarListItem = tabBar.list.find((item) => item.pagePath === routeName);
                // const tabBarIndex = tabBar.list.findIndex(item => item.pagePath === routeName) + 1;
                return (react_1.default.createElement(HomeIconWithBadge_1.default, { focused: focused, icon: tabBarListItem && tabBarListItem.iconPath, selectedIcon: tabBarListItem && tabBarListItem.selectedIconPath, text: tabBarListItem && tabBarListItem.text, color: tabBar.color, selectedColor: tabBar.selectedColor }));
            },
            tabBarVisible: getTabBarVisible(navigation),
        }),
        tabBarOptions: {
            showLabel: false,
            activeTintColor: tabBar.selectedColor || '#3cc51f',
            inactiveTintColor: tabBar.color || '#7A7E83',
            activeBackgroundColor: tabBar.backgroundColor || '#ffffff',
            inactiveBackgroundColor: tabBar.backgroundColor || '#ffffff',
            style: tabBar.borderStyle
                ? {
                    backgroundColor: tabBar.borderStyle,
                }
                : {},
        },
    });
}
function getStackNavigator(pageList, navigationOptions) {
    const routerConfig = getStackRouterConfig(pageList);
    // 让rn支持背景颜色设置,支持透明色
    let stackNavigatorOptions = navigationOptions.stackNavigatorOptions || {};
    let navigatorOptions = Object.assign({ cardStyle: {
            // 第一层颜色设置
            backgroundColor: navigationOptions.backgroundColor,
        }, transitionConfig: () => ({
            containerStyle: {
                // 第二层颜色设置
                backgroundColor: navigationOptions.backgroundColor,
            },
        }) }, stackNavigatorOptions);
    return react_navigation_stack_1.createStackNavigator(routerConfig, Object.assign({ headerMode: {} }, navigatorOptions));
}
function createRouter(pageList, appConfig) {
    const { window } = appConfig;
    const tabBar = appConfig.tabBar;
    const navigationOptions = getNavigationOption(window);
    if (tabBar && tabBar.list && Array.isArray(tabBar.list) && tabBar.list.length > 0) {
        return react_navigation_1.createAppContainer(getBottomTabNavigator(pageList, tabBar, navigationOptions));
    }
    else {
        return react_navigation_1.createAppContainer(getStackNavigator(pageList, navigationOptions));
    }
}
// gets the current screen from navigation state
function getActiveRouteName(navigationState) {
    if (!navigationState) {
        return null;
    }
    const route = navigationState.routes[navigationState.index];
    // dive into nested navigators
    if (route.routes) {
        return getActiveRouteName(route);
    }
    return route.routeName;
}
const initRouter = (pageList, Taro, appConfig) => {
    const AppContainer = createRouter(pageList, appConfig);
    const element = (react_1.default.createElement(AppContainer, { theme: "light", ref: (navigatorRef) => {
            NavigationService_1.default.setTopLevelNavigator(navigatorRef);
            // 绑定Taro的路由跳转方法
            TaroProvider_1.default.bind(Taro);
        }, onNavigationStateChange: (prevState, currentState, action) => {
            const currentRouteName = getActiveRouteName(currentState);
            const previousRouteName = getActiveRouteName(prevState);
            NavigationService_1.default.setCurrentRouteName(currentRouteName);
            NavigationService_1.default.setPreviousRouteName(previousRouteName);
            NavigationService_1.default.setRoutes(currentState.routes);
        } }));
    return () => element;
};
exports.initRouter = initRouter;
