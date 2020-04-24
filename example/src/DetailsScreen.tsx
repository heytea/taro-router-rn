import React, { useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import Taro from './Taro';
import { useRoute } from '@react-navigation/native';
import { inject, observer } from 'mobx-react';
import { user } from './Store';

function DetailsScreen(props) {
  useEffect(() => {
    Taro.setNavigationBarTitle({ title: '详情' });
  }, []);

  const route = useRoute();
  console.log('params', route.params);

  const { name, setName } = user;
  console.log(name);
  setName('haha');
  console.log('propspropspropsprops', props.store);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text
        onPress={() => {
          Taro.showTabBar();
          Taro.setNavigationBarColor({
            frontColor: '#782',
            backgroundColo: '#000',
          });
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

export default inject('store')(observer(DetailsScreen));
