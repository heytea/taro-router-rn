import React, { useEffect } from 'react';
import { View, Button } from 'react-native';
import Taro from './taro/Taro';

function InfoScreen() {
  useEffect(() => {
    Taro.setNavigationBarTitle({ title: '详情' });
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button
        title="switchTab"
        onPress={() => {
          Taro.switchTab({
            url: 'pages/code/code',
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
            url: 'pages/code/code',
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
    </View>
  );
}

export default InfoScreen;
