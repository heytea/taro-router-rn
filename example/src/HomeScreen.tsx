import React from 'react';
import { View, Button } from 'react-native';
import Taro from './taro/Taro';

export interface IProps {}

export default class HomeScreen extends React.Component<IProps> {
  static config = {
    navigationStyle: 'custom',
  };

  private visible: boolean;
  constructor(props: IProps) {
    super(props);
    this.visible = true;
  }
  static navigationOptions = ({ navigation }: { navigation: any }) => {
    return {
      title: navigation.getParam('showBar', false),
    };
  };
  componentDidMount() {}
  componentDidShow() {
    console.log('componentDidShow');
    Taro.setNavigationBarTitle({ title: '首页' });
  }
  componentDidHide() {
    console.log('componentDidHide');
  }
  async onPullDownRefresh() {
    console.log('onPullDownRefresh');
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 3000);
  }
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {/* other code from before here */}
        <Button
          title="Go to Details"
          onPress={() => {
            Taro.navigateTo({
              url: 'pages/invoice/batch_company/index?title=haha&subtitle=nice',
              success: () => {
                console.log('success');
              },
              fail: async (e: any) => {
                console.log(e);
              },
            });
            // Taro.setNavigationBarColor({ backgroundColor: '#000' });
            // Taro.startPullDownRefresh();
            // Taro.setTabBarBadge({ index: 1, text: '9' });
            // Taro.showTabBarRedDot({ index: 0 });
            // console.log(_methodStack.index);
            // Taro.setTabBarStyle({
            //   color: '#FF0000',
            //   selectedColor: '#00FF00',
            //   backgroundColor: '#0000FF',
            //   borderStyle: 'white',
            // });
            // Taro.setTabBarItem({
            //   index: 0,
            //   text: 'text',
            //   iconPath: 'https://gw.alicdn.com/tps/TB1W_X6OXXXXXcZXVXXXXXXXXXX-400-400.png',
            //   selectedIconPath: 'https://img.alicdn.com/tps/TB1ld1GNFXXXXXLapXXXXXXXXXX-200-200.png',
            // });
            // Taro.showTabBar();
          }}
        />
        <Button
          title="Stop"
          onPress={() => {
            // Taro.hideTabBar();
            // Taro.stopPullDownRefresh();
            Taro.removeTabBarBadge({ index: 1 });
            // Taro.hideTabBarRedDot({ index: 0 });
          }}
        />
      </View>
    );
  }
}
