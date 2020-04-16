import React from 'react';
import { ScrollView, YellowBox, View, Text } from 'react-native';
import { NavigationScreenProp, NavigationRoute, NavigationParams } from 'react-navigation';
import {
  errorHandler,
  successHandler,
  NavigatorTabBarOption,
  NavigatorTitleOption,
  NavigatorBarColorOption,
  NavigationOption,
} from './utils';
import LoadingView from './LoadingView';

function getWrappedScreen(Screen: any, Taro: Taro) {
  interface IProps {
    navigation: NavigationScreenProp<WrappedScreen>;
  }
  interface IState {}
  class WrappedScreen extends React.Component<IProps, IState> {
    constructor(props: IProps) {
      super(props);
      YellowBox.ignoreWarnings(['Calling `getNode()` on the ref of an Animated']);
    }

    static navigationOptions = ({
      navigation,
    }: {
      navigation: NavigationScreenProp<NavigationRoute<NavigationParams>, NavigationParams>;
    }) => {
      const options: any = {};
      const title = navigation.getParam('_tabBarTitle', navigation.state.routeName);
      const headerTintColor = navigation.getParam('_headerTintColor', undefined);
      if (headerTintColor) {
        options.headerTintColor = headerTintColor;
      }
      const backgroundColor = navigation.getParam('_backgroundColor', undefined);
      if (backgroundColor) {
        options.headerStyle = {
          backgroundColor,
        };
      }
      const isNavigationBarLoadingShow = navigation.getParam('_isNavigationBarLoadingShow', false);
      options.headerTitle = (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {isNavigationBarLoadingShow && <LoadingView tintColor={headerTintColor} />}
          <Text
            style={{
              flexDirection: 'row',
              flex: 1,
              fontSize: 17,
              fontWeight: '600',
              textAlign: 'center',
              color: headerTintColor,
            }}>
            {title}
          </Text>
        </View>
      );
      return options;
    };

    componentDidMount() {
      this.initBinding();
    }

    private initBinding() {
      Taro.showTabBar = this.showTabBar.bind(this);
      Taro.hideTabBar = this.hideTabBar.bind(this);
      Taro.setNavigationBarTitle = this.setNavigationBarTitle.bind(this);
      Taro.setNavigationBarColor = this.setNavigationBarColor.bind(this);
      Taro.showNavigationBarLoading = this.showNavigationBarLoading.bind(this);
      Taro.hideNavigationBarLoading = this.hideNavigationBarLoading.bind(this);
    }

    private showTabBar(option?: NavigatorTabBarOption) {
      const { animation = false, success, fail, complete } = option || {};
      try {
        this.props.navigation.setParams({
          _tabBarVisible: true,
          _animation: animation,
        });
      } catch (error) {
        return errorHandler(error, fail, complete);
      }
      return successHandler(success, complete);
    }

    private hideTabBar(option?: NavigatorTabBarOption) {
      const { animation = false, success, fail, complete } = option || {};
      try {
        this.props.navigation.setParams({
          _tabBarVisible: false,
          _animation: animation,
        });
      } catch (error) {
        return errorHandler(error, fail, complete);
      }
      return successHandler(success, complete);
    }

    private setNavigationBarTitle(option?: NavigatorTitleOption) {
      const { title = '', success, fail, complete } = option || {};
      try {
        this.props.navigation.setParams({
          _tabBarTitle: title,
        });
      } catch (error) {
        return errorHandler(error, fail, complete);
      }
      return successHandler(success, complete);
    }

    private setNavigationBarColor(option?: NavigatorBarColorOption) {
      const { frontColor, backgroundColor, success, fail, complete } = option || {};
      try {
        this.props.navigation.setParams({
          _headerTintColor: frontColor,
          _backgroundColor: backgroundColor,
        });
      } catch (error) {
        return errorHandler(error, fail, complete);
      }
      return successHandler(success, complete);
    }

    private showNavigationBarLoading(option?: NavigationOption) {
      const { success, fail, complete } = option || {};
      try {
        this.props.navigation.setParams({
          _isNavigationBarLoadingShow: true,
        });
      } catch (error) {
        return errorHandler(error, fail, complete);
      }
      return successHandler(success, complete);
    }

    private hideNavigationBarLoading(option?: NavigationOption) {
      const { success, fail, complete } = option || {};
      try {
        this.props.navigation.setParams({
          _isNavigationBarLoadingShow: false,
        });
      } catch (error) {
        return errorHandler(error, fail, complete);
      }
      return successHandler(success, complete);
    }

    render() {
      console.log('1');
      return (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ minHeight: '100%' }}
          alwaysBounceVertical>
          <Screen {...this.props} />
        </ScrollView>
      );
    }
  }
  return WrappedScreen;
}

export default getWrappedScreen;
