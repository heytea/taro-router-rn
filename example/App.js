/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import Taro from './src/taro/Taro';

import HomeScreen from './src/HomeScreen';
import SettingsScreen from './src/SettingsScreen';
import DetailsScreen from './src/DetailsScreen';

import assetsImgBarBuyActivePng from './src/assets/img/buy-active.png';
import assetsImgBarBuyPng from './src/assets/img/buy.png';
import assetsImgBarTakeActivePng from './src/assets/img/take-active.png';
import assetsImgBarTakePng from './src/assets/img/take.png';
import { initRouter } from './src/taro-router-rn/initRouter';
import InfoScreen from './src/InfoScreen';

const config = {
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '',
    navigationBarTextStyle: 'black',
    enablePullDownRefresh: true,
    // rn: {
    //   // 以下属性，Taro官方不存在，喜茶自定义
    //   statusBar: {
    //     backgroundColor: 'red',
    //     barStyle: 'light-content',
    //     translucent: false,
    //   }, // 手机状态栏
    //   navigationBarTitleStyle: {
    //     color: '',
    //     fontSize: 13,
    //     fontFamily: '',
    //     fontWeight: '400',
    //   },
    //   navigationBarBackgroundColor: '#fff',
    //   navigationBarHeight: 50, // 导航栏高度
    //   navigationBarShadow: false, // 导航栏是否有阴影
    //   navigationBarBottomStyle: {
    //     height: 2,
    //     width: '100%',
    //     backgroundColor: '#eee',
    //   }, // 导航栏底部线样式, object | undefined
    //   navigationBarTitlePosition: 'left', // 导航栏标题位置，'left', 'center', 'right'
    //   navigationBarBackIcon: '', // 导航栏返回按钮图标
    //   navigationBarMenus: [
    //     {
    //       icon: '', // 图片路径 | undefined
    //       text: '', // 文字 | undefined
    //       color: '', // 文字颜色
    //       click: () => {}, // 点击回调
    //     },
    //   ], // 导航栏菜单按钮
    // },
  },
  tabBar: {
    color: '#BFBDBC',
    selectedColor: '#000',
    borderStyle: 'black',
    backgroundColor: '#F7F7F7',
    list: [
      {
        selectedIconPath: assetsImgBarBuyActivePng,
        iconPath: assetsImgBarBuyPng,
        pagePath: 'pages/index/index',
        text: '点单',
      },
      {
        selectedIconPath: assetsImgBarTakeActivePng,
        iconPath: assetsImgBarTakePng,
        pagePath: 'pages/code/code',
        text: '设置',
      },
    ],
  },
  subPackages: [
    {
      root: 'pages/invoice',
      name: 'invoice',
    },
    {
      root: 'pages/order',
      name: 'order',
    },
  ],
};
const RootStack = initRouter(
  [
    ['pages/index/index', HomeScreen],
    ['pages/code/code', SettingsScreen],
    ['pages/invoice/batch_company/index', DetailsScreen],
    ['pages/invoice/info/index', InfoScreen],
  ],
  Taro,
  config,
);

class App extends React.Component {
  render() {
    return <RootStack />;
  }
}

export default App;
