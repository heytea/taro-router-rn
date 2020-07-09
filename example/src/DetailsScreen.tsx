import React, { useEffect } from 'react';
import { View, Text, Image, Button } from 'react-native';
import Taro from './taro/Taro';

function DetailsScreen() {
  useEffect(() => {
    Taro.setNavigationBarTitle({ title: '详情' });
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text
        onPress={() => {
          Taro.showTabBar();
          Taro.setNavigationBarColor({ frontColor: '#782', backgroundColo: '#000' });
          Taro.showNavigationBarLoading();
          Taro.setTabBarBadge({ index: 1, text: '9' });
          console.log(Taro.getCurrentPages());
        }}>
        Details!
      </Text>
      <Text
        onPress={() => {
          Taro.hideTabBar();
          Taro.hideNavigationBarLoading();
          Taro.removeTabBarBadge({ index: 1 });
          Taro.setTabBarItem({
            index: 0,
            text: 'text',
            iconPath: 'https://gw.alicdn.com/tps/TB1W_X6OXXXXXcZXVXXXXXXXXXX-400-400.png',
            selectedIconPath: 'https://img.alicdn.com/tps/TB1ld1GNFXXXXXLapXXXXXXXXXX-200-200.png',
          });
        }}>
        Close
      </Text>
      <Button
        title="switchTab"
        onPress={() => {
          Taro.switchTab({
            url: 'pages/index/index',
            success: () => {
              console.log('success');
            },
            fail: async (e: any) => {
              console.log(e);
            },
          });
        }}
      />
      <Button
        title="reLaunch"
        onPress={() => {
          Taro.reLaunch({
            url: 'pages/invoice/info/index',
            success: () => {
              console.log('success');
            },
            fail: async (e: any) => {
              console.log(e);
            },
          });
        }}
      />
      <Button
        title="redirectTo"
        onPress={() => {
          Taro.redirectTo({
            url: 'pages/invoice/info/index',
            success: () => {
              console.log('success');
            },
            fail: async (e: any) => {
              console.log(e);
            },
          });
        }}
      />

      <Image
        source={{
          uri:
            'https://pics7.baidu.com/feed/5243fbf2b2119313aa9f232e8cda75d193238dbd.jpeg?token=b6c4a534caebc394d89a72ea8efe4b07',
        }}
        style={{ width: 200, height: 200 }}
      />
    </View>
  );
}

DetailsScreen.config = {
  // navigationStyle: 'custom',
  // rn: {
  //   statusBar: {
  //     backgroundColor: 'blue',
  //     barStyle: 'light-content',
  //   }, // 手机状态栏
  //   navigationBarTitleStyle: {
  //     color: '',
  //     fontSize: 13,
  //     fontFamily: '',
  //     fontWeight: '400',
  //   },
  //   navigationBarHeight: 50, // 导航栏高度
  //   navigationBarShadow: false, // 导航栏是否有阴影
  //   navigationBarBottomStyle: {
  //     height: 2,
  //     width: '100%',
  //     backgroundColor: '#eee',
  //   }, // 导航栏底部线样式, object | undefined
  //   navigationBarTitlePosition: 'center', // 导航栏标题位置，'left', 'center', 'right'
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
};

export default DetailsScreen;
