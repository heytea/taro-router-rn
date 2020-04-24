import React from 'react';
import Taro from './src/Taro';
import { Provider } from 'mobx-react';
import Store from './src/Store';

import HomeScreen from './src/HomeScreen';
import SettingsScreen from './src/SettingsScreen';
import DetailsScreen from './src/DetailsScreen';

import assetsImgBarBuyActivePng from './src/assets/img/buy-active.png';
import assetsImgBarBuyPng from './src/assets/img/buy.png';
import assetsImgBarTakeActivePng from './src/assets/img/take-active.png';
import assetsImgBarTakePng from './src/assets/img/take.png';
import { initRouter } from './src/taro-route-rn/initRouter';

const config = {
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '',
    navigationBarTextStyle: 'black',
    enablePullDownRefresh: true,
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
        text: '订单',
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
  ],
  Taro,
  config,
);

class App extends React.Component {
  render() {
    return (
      <Provider store={Store}>
        <RootStack />
      </Provider>
    );
  }
}

export default App;
