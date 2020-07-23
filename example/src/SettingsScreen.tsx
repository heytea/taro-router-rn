import React from 'react';
import { View, Button, StatusBar } from 'react-native';
import Taro from './taro/Taro';

export default class SettingsScreen extends React.Component {
  static config = {
    // rn: {
    //   statusBar: {
    //     backgroundColor: 'blue',
    //     barStyle: 'light-content',
    //   },
    // },
  };
  componentDidMount() {
    Taro.setNavigationBarTitle({ title: '设置' });
  }
  componentDidShow() {
    console.log('componentDidShow');
  }
  componentDidHide() {
    console.log('componentDidHide');
  }
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {/* other code from before here */}
        <Button
          title="settings Go to Details"
          onPress={() => {
            Taro.navigateTo({ url: 'pages/invoice/batch_company/index' });
          }}
        />
      </View>
    );
  }
}