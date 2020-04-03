import React from 'react';
import HomeIconWithBadge from './HomeIconWithBadge';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import SafeAreaView from 'react-native-safe-area-view';
import NavigationService from './NavigationService';
import bindTaroNavigate from './bindTaroNavigate';

// function getTaroTabBarIconConfig(index, key) {
//   const _taroTabBarIconConfig = global._taroTabBarIconConfig || {}
//   return _taroTabBarIconConfig[index] && _taroTabBarIconConfig[index][key]
// }

// function getRouteParam(navigation, name) {
//   let routeState = navigation.state.routes[navigation.state.index]
//   return routeState.params && routeState.params[name]
// }

// function getTabBarVisibleFlag(navigation) {
//   const tabBarVisible = getRouteParam(navigation, '_tabBarVisible')
//   if (typeof tabBarVisible === 'boolean') {
//     return tabBarVisible
//   } else {
//     return navigation.state.index === 0 // 第一级不显示 tabBar
//   }
// }

/**
 * @param pageList
 * @param Taro
 * @param navigationOptions config.navigationOptions
 * @returns {*}
 */
// function getRootStack({ pageList, Taro, navigationOptions }) {
//   let RouteConfigs = {}
//   pageList.forEach(v => {
//     const pageKey = v[0]
//     const Screen = v[1]
//     RouteConfigs[pageKey] = getWrappedScreen(Screen, Taro, navigationOptions)
//   })

//   // 让rn支持背景颜色设置,支持透明色
//   let stackNavigatorOptions = navigationOptions.stackNavigatorOptions || {}
//   let navigatorOptions = {
//     cardStyle: { // 第一层颜色设置
//       backgroundColor: navigationOptions.backgroundColor
//     },
//     transitionConfig: () => ({
//       containerStyle: { // 第二层颜色设置
//         backgroundColor: navigationOptions.backgroundColor
//       }
//     }),
//     ...stackNavigatorOptions
//   }
//   return createStackNavigator(RouteConfigs, { headerLayoutPreset: 'center', ...navigatorOptions })
// }

// function getRootStackPageList({ pageList, tabBar, currentTabPath }) {
//   const tabPathList = tabBar.list.map(item => item.pagePath)
//   const currentPage = pageList.find(item => item[0] === currentTabPath)
//   if (currentPage === undefined) {
//     throw new Error('tabBar 的 pagePath 必须是 pages 配置页面')
//   }
//   const newPageList = pageList.filter(item => tabPathList.indexOf(item[0]) === -1) // 去除 tabPathList 里的 pagePat
//   newPageList.unshift(currentPage)
//   return newPageList
// }

// function getTabRouteConfig({ pageList, Taro, tabBar, navigationOptions }) {
//   let RouteConfigs = {}
//   // newPageList 去除了 tabBar 配置里面的页面，但包含当前 tabBar 页面
//   // 防止页面跳转时 tabBar 和 stack 相互干扰，保证每个 tabBar 堆栈的独立性
//   tabBar.list.forEach((item) => {
//     const currentTabPath = item.pagePath
//     const rootStackPageList = getRootStackPageList({ pageList, tabBar, currentTabPath })
//     RouteConfigs[currentTabPath] = getRootStack({ pageList: rootStackPageList, Taro, navigationOptions })
//   })
//   return RouteConfigs
// }

// function getTabBarRootStack({ pageList, Taro, tabBar, navigationOptions }) {
//   const RouteConfigs = getTabRouteConfig({ pageList, Taro, tabBar, navigationOptions })
//   // TODO tabBar.position
//   return createBottomTabNavigator(RouteConfigs, {
//     initialRouteName: pageList[0][0], // app.json里pages的顺序，第一项是默认打开页
//     navigationOptions: ({ navigation }) => ({ // 这里得到的是 tab 的 navigation
//       tabBarIcon: ({ focused, tintColor }) => {
//         const { routeName } = navigation.state
//         const iconConfig = tabBar.list.find(item => item.pagePath === routeName)
//         const tabBarIndex = tabBar.list.findIndex(item => item.pagePath === routeName) + 1
//         const isRedDotShow = getTaroTabBarIconConfig(tabBarIndex, 'isRedDotShow')
//         const isBadgeShow = getTaroTabBarIconConfig(tabBarIndex, 'isBadgeShow')
//         const badgeText = getTaroTabBarIconConfig(tabBarIndex, 'badgeText')
//         const selectedIconPath = getTaroTabBarIconConfig(tabBarIndex, 'itemSelectedIconPath')
//         const iconPath = getTaroTabBarIconConfig(tabBarIndex, 'itemIconPath')
//         return (
//           <TabBarIcon
//             focused={focused}
//             iconConfig={iconConfig}
//             isRedDotShow={isRedDotShow}
//             badgeText={badgeText}
//             isBadgeShow={isBadgeShow}
//             selectedIconPath={selectedIconPath || iconConfig.selectedIconPath}
//             iconPath={iconPath || iconConfig.iconPath}
//           />
//         )
//       },
//       tabBarLabel: (() => {
//         const { routeName } = navigation.state
//         const tabBarIndex = tabBar.list.findIndex(item => item.pagePath === routeName) + 1
//         const itemText = getTaroTabBarIconConfig(tabBarIndex, 'itemText')
//         return itemText || tabBar.list.find(item => item.pagePath === navigation.state.routeName).text
//       })(),
//       tabBarVisible: getTabBarVisibleFlag(navigation)
//     }),
//     /**
//      * color ✅
//      * selectedColor ✅
//      * backgroundColor ✅
//      * borderStyle 🤔
//      * position ❌
//      * custom ❌
//      */
//     tabBarOptions: {
//       backBehavior: 'none',
//       activeTintColor: tabBar.selectedColor || '#3cc51f',
//       inactiveTintColor: tabBar.color || '#7A7E83',
//       activeBackgroundColor: tabBar.backgroundColor || '#ffffff',
//       inactiveBackgroundColor: tabBar.backgroundColor || '#ffffff',
//       style: tabBar.borderStyle ? {
//         backgroundColor: tabBar.borderStyle
//       } : {}
//     }
//   })
// }

/**
 * @description
 * @param pageList  [['pages/index/index', pagesindexindex]]
 * @param Taro
 * @param navigationOptions 头部导航相关配置 App.config.navigationOptions 全局
 * @param tabBar  tabBar相关配置 App.config.tabBar
 * @returns {*}
 */
// const initRouter = (pageList, Taro, {window = {}, tabBar}) => {
//   const navigationOptions = getNavigationOptions(window)
//   if (tabBar && tabBar.list) {
//     return createAppContainer(getTabBarRootStack({pageList, Taro, tabBar, navigationOptions}))
//   } else {
//     return createAppContainer(getRootStack({pageList, Taro, navigationOptions}))
//   }
// }

const HEADER_CONFIG_MAP: KV = {
  navigationBarTitleText: 'title', // 导航栏标题文字内容
  navigationBarTextStyle: 'headerTintColor', // 导航栏标题颜色，仅支持 black/white
  navigationBarBackgroundColor: 'backgroundColor', // 导航栏背景颜色
  enablePullDownRefresh: 'enablePullDownRefresh', // 是否全局开启下拉刷新，暂时放这里吧
  navigationStyle: 'navigationStyle', // 导航栏样式，仅支持以下值：default 默认样式 custom 自定义导航栏，只保留右上角胶囊按钮
  disableScroll: 'disableScroll', // 设置为 true 则页面整体不能上下滚动；只在页面配置中有效，无法在 app.json 中设置该项
  backgroundColor: 'backgroundColor', // 容器背景颜色
  stackNavigatorOptions: 'stackNavigatorOptions' // 支持直接透传createStackNavigator方法的配置
}

function getNavigationOption(config: KV) {
  let navigationOption: KV = {}
  if (typeof config !== 'object') {
    return navigationOption;
  }
  Object.keys(config).forEach(key => {
    if (HEADER_CONFIG_MAP[key]) {
      navigationOption[HEADER_CONFIG_MAP[key]] = config[key];
    }
  })
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
      const childStackList = pageList.filter(pathItem => tabBarRouterNames.indexOf(pathItem[0]) < 0); // 将不存在于tabBar.list里的page作为子stack page
      let stackPageList: PageList = [];
      stackPageList.push(currentTabBar);
      stackPageList = stackPageList.concat(childStackList);
      routerConfig[currentTabBar[0]] = getStackNavigator(stackPageList, navigationOptions);
    }
  });
  console.log('routerConfig', routerConfig);
  return routerConfig;
}

// 获取Stack类型路由配置
function getStackRouterConfig(pageList: PageList) {
  const routerConfig: KV = {};
  pageList.forEach(item => {
    const key = item[0]
    const value = item[1]
    routerConfig[key] = value;
  });
  return routerConfig;
}

function getTabBarVisible(navigation) {

  return true;
}

function getBottomTabNavigator(pageList: PageList, tabBar: TabBar, navigationOptions: object) {
  const routerConfig = getTabBarRouterConfig(pageList, tabBar, navigationOptions);
  return createBottomTabNavigator(
    routerConfig,
    {
      defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, horizontal, tintColor }) => {
          const { routeName } = navigation.state;
          const tabBarListItem = tabBar.list.find(item => item.pagePath === routeName);
          const tabBarIndex = tabBar.list.findIndex(item => item.pagePath === routeName) + 1;
          console.log('tabBarIndex', tabBarIndex);

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
        tabBarVisible: getTabBarVisible(navigation)
      }),
      tabBarOptions: {
        showLabel: false,
        activeTintColor: tabBar.selectedColor || '#3cc51f',
        inactiveTintColor: tabBar.color || '#7A7E83',
        activeBackgroundColor: tabBar.backgroundColor || '#ffffff',
        inactiveBackgroundColor: tabBar.backgroundColor || '#ffffff',
        style: tabBar.borderStyle ? {
          backgroundColor: tabBar.borderStyle
        } : {}
      }
    }
  );
}

function getStackNavigator(pageList: PageList, navigationOptions: KV) {
  const routerConfig = getStackRouterConfig(pageList);
  // 让rn支持背景颜色设置,支持透明色
  let stackNavigatorOptions = navigationOptions.stackNavigatorOptions || {}
  let navigatorOptions = {
    cardStyle: { // 第一层颜色设置
      backgroundColor: navigationOptions.backgroundColor
    },
    transitionConfig: () => ({
      containerStyle: { // 第二层颜色设置
        backgroundColor: navigationOptions.backgroundColor
      }
    }),
    ...stackNavigatorOptions
  }
  return createStackNavigator(routerConfig, { headerLayoutPreset: 'center', ...navigatorOptions });
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

const initRouter = (pageList: PageList, Taro: Taro, appConfig: any) => {
  const AppContainer = createRouter(pageList, appConfig);
  const element = <AppContainer
    theme="light"
    ref={navigatorRef => {
      NavigationService.setTopLevelNavigator(navigatorRef);
    }} />;
  // 绑定Taro的路由跳转方法
  bindTaroNavigate.bind(Taro);
  return () => element;
}

export {
  getNavigationOption,
  initRouter
}
