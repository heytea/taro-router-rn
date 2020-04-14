import React from 'react';
import HomeIconWithBadge from './HomeIconWithBadge';
import { createAppContainer, NavigationState } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import NavigationService from './NavigationService';
import TaroProvider from './TaroProvider';

const HEADER_CONFIG_MAP: KV = {
  navigationBarTitleText: 'title', // 导航栏标题文字内容
  navigationBarTextStyle: 'headerTintColor', // 导航栏标题颜色，仅支持 black/white
  navigationBarBackgroundColor: 'backgroundColor', // 导航栏背景颜色
  enablePullDownRefresh: 'enablePullDownRefresh', // 是否全局开启下拉刷新，暂时放这里吧
  navigationStyle: 'navigationStyle', // 导航栏样式，仅支持以下值：default 默认样式 custom 自定义导航栏，只保留右上角胶囊按钮
  disableScroll: 'disableScroll', // 设置为 true 则页面整体不能上下滚动；只在页面配置中有效，无法在 app.json 中设置该项
  backgroundColor: 'backgroundColor', // 容器背景颜色
  stackNavigatorOptions: 'stackNavigatorOptions', // 支持直接透传createStackNavigator方法的配置
};

function getNavigationOption(config: KV) {
  let navigationOption: KV = {};
  if (typeof config !== 'object') {
    return navigationOption;
  }
  Object.keys(config).forEach(key => {
    if (HEADER_CONFIG_MAP[key]) {
      navigationOption[HEADER_CONFIG_MAP[key]] = config[key];
    }
  });
  return navigationOption;
}

// 获取TabBar类型路由配置
function getTabBarRouterConfig(pageList: PageList, tabBar: TabBar, navigationOptions: KV) {
  const routerConfig: KV = {};
  const tabBarRouterNames = tabBar.list.reduce((acc, cur) => acc + ' ' + cur.pagePath, '');
  tabBar.list.forEach(item => {
    const currentTabPagePath = item.pagePath;
    const currentTabBar = pageList.find(pageItem => pageItem[0] === currentTabPagePath); // 找到该tabBar对应在pageList中的一项
    if (currentTabBar) {
      const childStackList = pageList.filter(
        pathItem => tabBarRouterNames.indexOf(pathItem[0]) < 0,
      ); // 将不存在于tabBar.list里的page作为子stack page
      let stackPageList: PageList = [];
      stackPageList.push(currentTabBar);
      stackPageList = stackPageList.concat(childStackList);
      routerConfig[currentTabBar[0]] = getStackNavigator(stackPageList, navigationOptions);
    }
  });
  return routerConfig;
}

// 获取Stack类型路由配置
function getStackRouterConfig(pageList: PageList) {
  const routerConfig: KV = {};
  pageList.forEach(item => {
    const key = item[0];
    const value = item[1];
    routerConfig[key] = value;
  });
  return routerConfig;
}

function getTabBarVisible(navigation) {
  return true;
}

function getBottomTabNavigator(pageList: PageList, tabBar: TabBar, navigationOptions: object) {
  const routerConfig = getTabBarRouterConfig(pageList, tabBar, navigationOptions);
  return createBottomTabNavigator(routerConfig, {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        const tabBarListItem = tabBar.list.find(item => item.pagePath === routeName);
        const tabBarIndex = tabBar.list.findIndex(item => item.pagePath === routeName) + 1;

        return (
          <HomeIconWithBadge
            focused={focused}
            icon={tabBarListItem && tabBarListItem.iconPath}
            selectedIcon={tabBarListItem && tabBarListItem.selectedIconPath}
            text={tabBarListItem && tabBarListItem.text}
            color={tabBar.color}
            selectedColor={tabBar.selectedColor}
          />
        );
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

function getStackNavigator(pageList: PageList, navigationOptions: KV) {
  const routerConfig = getStackRouterConfig(pageList);
  // 让rn支持背景颜色设置,支持透明色
  let stackNavigatorOptions = navigationOptions.stackNavigatorOptions || {};
  let navigatorOptions = {
    cardStyle: {
      // 第一层颜色设置
      backgroundColor: navigationOptions.backgroundColor,
    },
    transitionConfig: () => ({
      containerStyle: {
        // 第二层颜色设置
        backgroundColor: navigationOptions.backgroundColor,
      },
    }),
    ...stackNavigatorOptions,
  };
  return createStackNavigator(routerConfig, {
    headerMode: {},
    ...navigatorOptions,
  });
}

function createRouter(pageList: PageList, appConfig: any) {
  const { window } = appConfig;
  const tabBar: TabBar = appConfig.tabBar;
  const navigationOptions = getNavigationOption(window);
  if (tabBar && tabBar.list && Array.isArray(tabBar.list) && tabBar.list.length > 0) {
    return createAppContainer(getBottomTabNavigator(pageList, tabBar, navigationOptions));
  } else {
    return createAppContainer(getStackNavigator(pageList, navigationOptions));
  }
}

// gets the current screen from navigation state
function getActiveRouteName(navigationState: NavigationState): string | null {
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

const initRouter = (pageList: PageList, Taro: Taro, appConfig: any) => {
  const AppContainer = createRouter(pageList, appConfig);
  const element = (
    <AppContainer
      theme="light"
      ref={navigatorRef => {
        NavigationService.setTopLevelNavigator(navigatorRef);
        // 绑定Taro的路由跳转方法
        TaroProvider.bind(Taro);
      }}
      onNavigationStateChange={(prevState, currentState, action) => {
        const currentRouteName = getActiveRouteName(currentState);
        const previousRouteName = getActiveRouteName(prevState);
        NavigationService.setCurrentRouteName(currentRouteName);
        NavigationService.setPreviousRouteName(previousRouteName);
        NavigationService.setRoutes(currentState.routes);
      }}
    />
  );
  return () => element;
};

export { getNavigationOption, initRouter };
