import React from 'react';
import { Image } from 'react-native';
import HomeIconWithBadge from './HomeIconWithBadge';
import { createAppContainer, NavigationState, NavigationRoute, NavigationParams } from 'react-navigation';
import { createStackNavigator, CardStyleInterpolators } from 'react-navigation-stack';
import { createBottomTabNavigator, NavigationTabProp, BottomTabBar } from 'react-navigation-tabs';
import NavigationService from './NavigationService';
import TaroNavigator from './TaroNavigator';
import getWrappedScreen from './getWrappedScreen';
import { getNavigationOption } from './utils';
import { _globalTabBarStyleConfig } from './config';

// 获取TabBar类型路由配置
function getTabBarRouterConfig(pageList: PageList, tabBar: TabBar, navigationOptions: KV, Taro: Taro) {
  const routerConfig: KV = {};
  const tabBarRouterNames = tabBar.list.reduce((acc, cur) => acc + ' ' + cur.pagePath, '');
  tabBar.list.forEach((item) => {
    const currentTabPagePath = item.pagePath;
    const currentTabBar = pageList.find((pageItem) => pageItem[0] === currentTabPagePath); // 找到该tabBar对应在pageList中的一项
    if (currentTabBar) {
      const childStackList = pageList.filter((pathItem) => tabBarRouterNames.indexOf(pathItem[0]) < 0); // 将不存在于tabBar.list里的page作为子stack page
      let stackPageList: PageList = [];
      stackPageList.push(currentTabBar);
      stackPageList = stackPageList.concat(childStackList);
      routerConfig[currentTabBar[0]] = getStackNavigator(stackPageList, navigationOptions, Taro);
    }
  });
  return routerConfig;
}

// 获取Stack类型路由配置
function getStackRouterConfig(pageList: PageList, navigationOptions: KV, Taro: Taro) {
  const routerConfig: KV = {};
  pageList.forEach((item) => {
    const key = item[0];
    const screen = item[1];

    const wrappedScreen = getWrappedScreen(screen, navigationOptions, Taro);
    routerConfig[key] = {
      screen: wrappedScreen,
    };
  });
  return routerConfig;
}

// 底部导航栏是否显示
function getTabBarVisible(navigation: NavigationTabProp<NavigationRoute<NavigationParams>, any>) {
  const currentRoute = navigation.state.routes[navigation.state.index];
  const tabBarVisible = currentRoute.params ? currentRoute.params._tabBarVisible : undefined;
  if (typeof tabBarVisible === 'boolean') {
    return tabBarVisible;
  }
  return navigation.state.index === 0;
}

function getBottomTabNavigator(pageList: PageList, tabBar: TabBar, navigationOptions: object, Taro: Taro) {
  const routerConfig = getTabBarRouterConfig(pageList, tabBar, navigationOptions, Taro);
  return createBottomTabNavigator(routerConfig, {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;
        const tabBarListItem = tabBar.list.find((item) => item.pagePath === routeName);
        const tabBarIndex = tabBar.list.findIndex((item) => item.pagePath === routeName);

        return (
          <HomeIconWithBadge
            index={tabBarIndex}
            focused={focused}
            icon={tabBarListItem && tabBarListItem.iconPath}
            selectedIcon={tabBarListItem && tabBarListItem.selectedIconPath}
            text={tabBarListItem && tabBarListItem.text}
            color={_globalTabBarStyleConfig._tabColor ? _globalTabBarStyleConfig._tabColor : tabBar.color}
            selectedColor={
              _globalTabBarStyleConfig._tabSelectedColor
                ? _globalTabBarStyleConfig._tabSelectedColor
                : tabBar.selectedColor
            }
          />
        );
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
      if (_globalTabBarStyleConfig._tabBackgroundColor) {
        bgColor = _globalTabBarStyleConfig._tabBackgroundColor;
      }
      const borderTopColor =
        !_globalTabBarStyleConfig._tabBorderStyle || _globalTabBarStyleConfig._tabBorderStyle === 'black'
          ? '#cecece'
          : '#fff';
      return (
        <BottomTabBar
          {...props}
          style={{
            backgroundColor: bgColor,
            borderTopColor,
          }}
        />
      );
    },
  });
}

function getStackNavigator(pageList: PageList, navigationOptions: KV, Taro: Taro) {
  const routerConfig = getStackRouterConfig(pageList, navigationOptions, Taro);
  return createStackNavigator(routerConfig, {
    headerMode: navigationOptions.navigationStyle === 'custom' || navigationOptions.rn ? 'none' : 'screen',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#fff',
        shadowColor: 'transparent',
        shadowOpacity: 0,
        borderBottomWidth: 0,
        borderBottomColor: 'transparent',
        elevation: 0,
      },
      // headerBackImage: () => (
      //   <Image style={{ width: 12, height: 24, marginLeft: 16 }} source={require('./img/back.png')} />
      // ),
      gestureDirection: 'horizontal',
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      transitionSpec: {
        open: {
          animation: 'spring',
          config: {
            stiffness: 1000,
            damping: 500,
            mass: 3,
            overshootClamping: true,
            restDisplacementThreshold: 0.01,
            restSpeedThreshold: 0.01,
          },
        },
        close: {
          animation: 'spring',
          config: {
            stiffness: 1000,
            damping: 500,
            mass: 3,
            overshootClamping: true,
            restDisplacementThreshold: 0.01,
            restSpeedThreshold: 0.01,
          },
        },
      },
    },
  });
}

function createRouter(pageList: PageList, appConfig: any, Taro: Taro) {
  const { window } = appConfig;
  const tabBar: TabBar = appConfig.tabBar;
  const navigationOptions = getNavigationOption(window);
  if (tabBar && tabBar.list && Array.isArray(tabBar.list) && tabBar.list.length > 0) {
    return createAppContainer(getBottomTabNavigator(pageList, tabBar, navigationOptions, Taro));
  } else {
    return createAppContainer(getStackNavigator(pageList, navigationOptions, Taro));
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
  const AppContainer = createRouter(pageList, appConfig, Taro);
  const element = (
    <AppContainer
      ref={(navigatorRef) => {
        NavigationService.setTopLevelNavigator(navigatorRef);
        // 绑定Taro的路由跳转方法
        TaroNavigator.bind(Taro);
      }}
      onNavigationStateChange={(prevState, currentState) => {
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
