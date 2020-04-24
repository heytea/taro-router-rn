import React from 'react';
import HomeIconWithBadge from './HomeIconWithBadge';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator, BottomTabBar } from '@react-navigation/bottom-tabs';
import getWrappedScreen from './getWrappedScreen';
import { getNavigationOption } from './utils';
import { navigationRef } from './NavigationService';
import { _globalTabBarStyleConfig, _globalTabBarVisibleConfig } from './config';

function getStackNavigator(pageList: PageList, navigationOptions: KV, Taro: Taro) {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator headerMode="screen">
      {pageList.map((item) => {
        const key = item[0];
        const screen = getWrappedScreen(item[1], navigationOptions, Taro);
        return <Stack.Screen name={key} component={screen} options={screen.navigationOptions} />;
      })}
    </Stack.Navigator>
  );
}

function getBottomTabConfig(pageList: PageList, tabBar: TabBar, navigationOptions: KV, Taro: Taro) {
  const routerConfig: BottomTabConfig[] = [];
  const tabBarRouterNames = tabBar.list.reduce((acc, cur) => acc + ' ' + cur.pagePath, '');
  tabBar.list.forEach((item) => {
    const currentTabPagePath = item.pagePath;
    const currentTabBar = pageList.find((pageItem) => pageItem[0] === currentTabPagePath); // 找到该tabBar对应在pageList中的一项
    if (currentTabBar) {
      const childStackList = pageList.filter((pathItem) => tabBarRouterNames.indexOf(pathItem[0]) < 0); // 将不存在于tabBar.list里的page作为子stack page
      let stackPageList: PageList = [];
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

function getTabBarVisible(route: any) {
  const tabVisible = _globalTabBarVisibleConfig._tabBarVisible;
  if (typeof tabVisible === 'boolean') {
    return tabVisible;
  }
  if (route && route.state) {
    return route.state.index === 0;
  }
  return undefined;
}

function getBottomTabNavigator(pageList: PageList, tabBar: TabBar, navigationOptions: object, Taro: Taro) {
  const Tab = createBottomTabNavigator();
  const tabBarConfig = getBottomTabConfig(pageList, tabBar, navigationOptions, Taro);
  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        return {
          tabBarIcon: ({ focused }) => {
            const routeName = route.name;
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
          tabBarVisible: getTabBarVisible(route),
        };
      }}
      tabBarOptions={{
        showLabel: false,
        activeTintColor: tabBar.selectedColor || '#3cc51f',
        inactiveTintColor: tabBar.color || '#7A7E83',
      }}
      tabBar={(props) => {
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
              borderTopColor,
              backgroundColor: bgColor,
            }}
          />
        );
      }}>
      {tabBarConfig.map((item) => {
        const c = () => item.element;
        return <Tab.Screen name={item.name} component={c} />;
      })}
    </Tab.Navigator>
  );
}

const initRouter = (pageList: PageList, Taro: Taro, appConfig: any) => {
  const { window } = appConfig;
  const tabBar: TabBar = appConfig.tabBar;
  const navigationOptions = getNavigationOption(window);
  const isTab = tabBar && tabBar.list && Array.isArray(tabBar.list) && tabBar.list.length > 0;
  const element = (
    <NavigationContainer ref={navigationRef}>
      {isTab
        ? getBottomTabNavigator(pageList, tabBar, navigationOptions, Taro)
        : getStackNavigator(pageList, navigationOptions, Taro)}
    </NavigationContainer>
  );
  return () => element;
};

export { getNavigationOption, initRouter };
