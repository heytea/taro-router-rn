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
const TaroNavigator_1 = __importDefault(require("./TaroNavigator"));
const getWrappedScreen_1 = __importDefault(require("./getWrappedScreen"));
const utils_1 = require("./utils");
exports.getNavigationOption = utils_1.getNavigationOption;
const config_1 = require("./config");
// 获取TabBar类型路由配置
function getTabBarRouterConfig(pageList, tabBar, navigationOptions, Taro) {
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
            routerConfig[currentTabBar[0]] = getStackNavigator(stackPageList, navigationOptions, Taro);
        }
    });
    return routerConfig;
}
// 获取Stack类型路由配置
function getStackRouterConfig(pageList, navigationOptions, Taro) {
    const routerConfig = {};
    pageList.forEach((item) => {
        const key = item[0];
        const screen = item[1];
        const wrappedScreen = getWrappedScreen_1.default(screen, navigationOptions, Taro);
        routerConfig[key] = {
            screen: wrappedScreen,
        };
    });
    return routerConfig;
}
// 底部导航栏是否显示
function getTabBarVisible(navigation) {
    const currentRoute = navigation.state.routes[navigation.state.index];
    const tabBarVisible = currentRoute.params ? currentRoute.params._tabBarVisible : undefined;
    if (typeof tabBarVisible === 'boolean') {
        return tabBarVisible;
    }
    return navigation.state.index === 0;
}
function getBottomTabNavigator(pageList, tabBar, navigationOptions, Taro) {
    const routerConfig = getTabBarRouterConfig(pageList, tabBar, navigationOptions, Taro);
    return react_navigation_tabs_1.createBottomTabNavigator(routerConfig, {
        defaultNavigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ focused }) => {
                const { routeName } = navigation.state;
                const tabBarListItem = tabBar.list.find((item) => item.pagePath === routeName);
                const tabBarIndex = tabBar.list.findIndex((item) => item.pagePath === routeName);
                return (react_1.default.createElement(HomeIconWithBadge_1.default, { index: tabBarIndex, focused: focused, icon: tabBarListItem && tabBarListItem.iconPath, selectedIcon: tabBarListItem && tabBarListItem.selectedIconPath, text: tabBarListItem && tabBarListItem.text, color: config_1._globalTabBarStyleConfig._tabColor ? config_1._globalTabBarStyleConfig._tabColor : tabBar.color, selectedColor: config_1._globalTabBarStyleConfig._tabSelectedColor
                        ? config_1._globalTabBarStyleConfig._tabSelectedColor
                        : tabBar.selectedColor }));
            },
            tabBarVisible: getTabBarVisible(navigation),
        }),
        tabBarOptions: {
            showLabel: false,
            activeTintColor: tabBar.selectedColor || '#3cc51f',
            inactiveTintColor: tabBar.color || '#7A7E83',
        },
        tabBarComponent: (props) => {
            let bgColor = tabBar.backgroundColor || '#ffffff';
            if (config_1._globalTabBarStyleConfig._tabBackgroundColor) {
                bgColor = config_1._globalTabBarStyleConfig._tabBackgroundColor;
            }
            const borderTopColor = !config_1._globalTabBarStyleConfig._tabBorderStyle || config_1._globalTabBarStyleConfig._tabBorderStyle === 'black'
                ? '#cecece'
                : '#fff';
            return (react_1.default.createElement(react_navigation_tabs_1.BottomTabBar, Object.assign({}, props, { style: {
                    backgroundColor: bgColor,
                    borderTopColor,
                } })));
        },
    });
}
function getStackNavigator(pageList, navigationOptions, Taro) {
    const routerConfig = getStackRouterConfig(pageList, navigationOptions, Taro);
    console.log('routerConfig', routerConfig);
    return react_navigation_stack_1.createStackNavigator(routerConfig, {
    // headerMode: navigationOptions.rn ? 'none' : 'screen',
    });
}
function createRouter(pageList, appConfig, Taro) {
    const { window } = appConfig;
    const tabBar = appConfig.tabBar;
    const navigationOptions = utils_1.getNavigationOption(window);
    if (tabBar && tabBar.list && Array.isArray(tabBar.list) && tabBar.list.length > 0) {
        return react_navigation_1.createAppContainer(getBottomTabNavigator(pageList, tabBar, navigationOptions, Taro));
    }
    else {
        return react_navigation_1.createAppContainer(getStackNavigator(pageList, navigationOptions, Taro));
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
    const AppContainer = createRouter(pageList, appConfig, Taro);
    const element = (react_1.default.createElement(AppContainer, { ref: (navigatorRef) => {
            NavigationService_1.default.setTopLevelNavigator(navigatorRef);
            // 绑定Taro的路由跳转方法
            TaroNavigator_1.default.bind(Taro);
        }, onNavigationStateChange: (prevState, currentState) => {
            const currentRouteName = getActiveRouteName(currentState);
            const previousRouteName = getActiveRouteName(prevState);
            NavigationService_1.default.setCurrentRouteName(currentRouteName);
            NavigationService_1.default.setPreviousRouteName(previousRouteName);
            NavigationService_1.default.setRoutes(currentState.routes);
        } }));
    return () => element;
};
exports.initRouter = initRouter;
