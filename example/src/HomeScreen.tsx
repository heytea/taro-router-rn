import React from 'react';
import { View, Button } from 'react-native';
import Taro from './taro/Taro';

export interface IProps {}

export default class HomeScreen extends React.Component<IProps> {
  static config = {
    // navigationStyle: 'custom',
    rn: {
      statusBar: {
        backgroundColor: 'white',
      },
      navigationBarMenus: [
        {
          text: '按钮1',
          color: '#9e9e9e',
          click: () => {
            console.log('按钮1');
          },
        },
        {
          icon: 'http://static.heytea.com/taro_trial/v1/img/bar/home-icon-normal.png',
          text: '按钮2',
          color: '#9e9e9e',
          click: () => {
            console.log('按钮2');
          },
        },
      ],
    },
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
  componentDidMount() {
    Taro.setNavigationBarTitle({ title: '自定义标题' });
  }
  componentDidShow() {
    console.log('componentDidShow');
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
