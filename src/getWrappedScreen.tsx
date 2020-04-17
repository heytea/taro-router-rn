import React from 'react';
import {
  ScrollView,
  YellowBox,
  View,
  Text,
  RefreshControl,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import {
  NavigationScreenProp,
  NavigationRoute,
  NavigationParams,
  NavigationEventSubscription,
} from 'react-navigation';
import {
  errorHandler,
  successHandler,
  NavigatorTabBarOption,
  NavigatorTitleOption,
  NavigatorBarColorOption,
  NavigationOption,
} from './utils';
import LoadingView from './LoadingView';
import { getNavigationOption } from './initRouter';

function getWrappedScreen(Screen: any, globalNavigationOptions: KV = {}, Taro: Taro) {
  interface IProps {
    navigation: NavigationScreenProp<WrappedScreen>;
  }
  interface IState {
    refreshing: boolean;
  }
  class WrappedScreen extends React.Component<IProps, IState> {
    private screenRef: React.RefObject<any>;
    private subsDidFocus?: NavigationEventSubscription;
    private subsWillBlur?: NavigationEventSubscription;
    constructor(props: IProps) {
      super(props);
      YellowBox.ignoreWarnings(['Calling `getNode()` on the ref of an Animated']);
      this.screenRef = React.createRef<any>();
      this.state = {
        refreshing: false,
      };
    }

    static navigationOptions = ({
      navigation,
    }: {
      navigation: NavigationScreenProp<NavigationRoute<NavigationParams>, NavigationParams>;
    }) => {
      const options: any = {};
      const title = navigation.getParam('_tabBarTitle', '');
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
      options.headerTitle = () => (
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
      this.subsDidFocus = this.props.navigation.addListener('didFocus', payload => {
        this.getScreenInstance().componentDidShow && this.getScreenInstance().componentDidShow();
      });
      this.subsWillBlur = this.props.navigation.addListener('willBlur', payload => {
        this.getScreenInstance().componentDidHide && this.getScreenInstance().componentDidHide();
      });
    }

    componentWillUnmount() {
      this.subsDidFocus && this.subsDidFocus.remove();
      this.subsWillBlur && this.subsWillBlur.remove();
    }

    /**
     * @description 如果 Screen 被包裹过（如：@connect），
     * 需提供获取包裹前 Screen 实例的方法 getWrappedInstance 并暴露出被包裹组件的 config
     * @returns {*}
     */
    private getScreenInstance() {
      if (this.screenRef.current && this.screenRef.current.getWrappedInstance) {
        return this.screenRef.current.getWrappedInstance() || {};
      } else {
        return this.screenRef.current || {};
      }
    }

    private initBinding() {
      // 导航栏
      Taro.setNavigationBarTitle = this.setNavigationBarTitle.bind(this);
      Taro.setNavigationBarColor = this.setNavigationBarColor.bind(this);
      Taro.showNavigationBarLoading = this.showNavigationBarLoading.bind(this);
      Taro.hideNavigationBarLoading = this.hideNavigationBarLoading.bind(this);
      // 滚动
      // 不支持RN Taro.pageScrollTo = this.pageScrollTo.bind(this);
      // 下拉刷新
      Taro.startPullDownRefresh = this.startPullDownRefresh.bind(this);
      Taro.stopPullDownRefresh = this.stopPullDownRefresh.bind(this);
      // TabBar
      // Taro.setTabBarBadge = this.setTabBarBadge.bind(this);
      // Taro.removeTabBarBadge = this.removeTabBarBadge.bind(this);
      // Taro.showTabBarRedDot = this.showTabBarRedDot.bind(this);
      // Taro.hideTabBarRedDot = this.hideTabBarRedDot.bind(this);
      // Taro.setTabBarStyle = this.setTabBarStyle.bind(this);
      // Taro.setTabBarItem = this.setTabBarItem.bind(this);
      Taro.showTabBar = this.showTabBar.bind(this);
      Taro.hideTabBar = this.hideTabBar.bind(this);
      // 生命周期
      // ✅componentDidShow
      // ✅componentDidHide
      // ✅onPullDownRefresh
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

    private startPullDownRefresh(option?: NavigationOption) {
      const { success, fail, complete } = option || {};
      try {
        this.setState({
          refreshing: true,
        });
      } catch (error) {
        return errorHandler(error, fail, complete);
      }
      return successHandler(success, complete);
    }

    private stopPullDownRefresh(option?: NavigationOption) {
      const { success, fail, complete } = option || {};
      try {
        this.setState({
          refreshing: false,
        });
      } catch (error) {
        return errorHandler(error, fail, complete);
      }
      return successHandler(success, complete);
    }

    private onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      this;
    };

    private handlePullRefresh = () => {
      this.setState({ refreshing: true });
      this.getScreenInstance().onPullDownRefresh && this.getScreenInstance().onPullDownRefresh();
    };

    render() {
      const { enablePullDownRefresh, disableScroll } = getNavigationOption(Screen.config);
      // 页面配置优先级 > 全局配置
      let isScreenEnablePullDownRefresh =
        enablePullDownRefresh === undefined
          ? globalNavigationOptions.enablePullDownRefresh
          : enablePullDownRefresh;
      console.log('isScreenEnablePullDownRefresh', isScreenEnablePullDownRefresh);
      return disableScroll ? (
        <Screen {...this.props} />
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ minHeight: '100%' }}
          alwaysBounceVertical
          scrollEventThrottle={5}
          onScroll={this.onScroll}
          refreshControl={
            isScreenEnablePullDownRefresh ? (
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.handlePullRefresh}
              />
            ) : (
              undefined
            )
          }>
          <Screen ref={this.screenRef} {...this.props} />
        </ScrollView>
      );
    }
  }
  return WrappedScreen;
}

export default getWrappedScreen;
