import React from 'react';
import { ScrollView, YellowBox, View, Text, RefreshControl } from 'react-native';
import { errorHandler, successHandler } from './utils';
import LoadingView from './LoadingView';
import { getNavigationOption } from './initRouter';
import {
  _globalTabBarBadgeConfig,
  _globalTabBarRedDotConfig,
  _methodStack,
  _globalTabBarStyleConfig,
  _globalTabBarItemConfig,
  _globalTabBarVisibleConfig,
} from './config';
import { SafeAreaView } from 'react-native-safe-area-context';
import TaroNavigator from './TaroNavigator';

function getWrappedScreen(Screen: any, globalNavigationOptions: KV = {}, Taro: Taro) {
  interface IProps {
    navigation: any;
    route: any;
  }
  interface IState {
    refreshing: boolean;
  }
  class WrappedScreen extends React.Component<IProps, IState> {
    private screenRef: React.RefObject<any>;
    private subsDidFocus?: any;
    private subsWillBlur?: any;
    constructor(props: IProps) {
      super(props);
      YellowBox.ignoreWarnings(['Calling `getNode()` on the ref of an Animated']);
      this.screenRef = React.createRef<any>();
      this.state = {
        refreshing: false,
      };
    }

    static lastTitle = '';

    static getParam(route: any, key: string, defaultValue: any) {
      if (!route || !route.params || !route.params[key]) {
        return defaultValue;
      }
      return route.params[key];
    }

    static navigationOptions = ({ route }: { route: any }) => {
      const options: any = {};
      const title = WrappedScreen.getParam(route, '_tabBarTitle', WrappedScreen.lastTitle);
      WrappedScreen.lastTitle = title;
      const headerTintColor = WrappedScreen.getParam(route, '_headerTintColor', undefined);
      if (headerTintColor) {
        options.headerTintColor = headerTintColor;
      }
      const backgroundColor = WrappedScreen.getParam(route, '_headerBackgroundColor', undefined);
      if (backgroundColor) {
        options.headerStyle = {
          backgroundColor,
        };
      }
      const isNavigationBarLoadingShow = WrappedScreen.getParam(route, '_isNavigationBarLoadingShow', false);
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

    UNSAFE_componentWillMount() {
      this.initBinding();
      this.subsDidFocus = this.props.navigation.addListener('focus', () => {
        this.initBinding();
        this.getScreenInstance().componentDidShow && this.getScreenInstance().componentDidShow();
      });
      this.subsWillBlur = this.props.navigation.addListener('blur', () => {
        this.getScreenInstance().componentDidHide && this.getScreenInstance().componentDidHide();
      });
      // 4.x
      // this.subsDidFocus = this.props.navigation.addListener('didFocus', payload => {
      //   this.initBinding();
      //   this.getScreenInstance().componentDidShow && this.getScreenInstance().componentDidShow();
      // });
      // this.subsWillBlur = this.props.navigation.addListener('willBlur', payload => {
      //   this.getScreenInstance().componentDidHide && this.getScreenInstance().componentDidHide();
      // });
    }

    componentDidMount() {
      TaroNavigator.bind(Taro, this.props.route.name);
    }

    componentWillUnmount() {
      // 5.x
      this.subsDidFocus && this.subsDidFocus();
      this.subsWillBlur && this.subsWillBlur();
      // 4.x
      // this.subsDidFocus && this.subsDidFocus.remove();
      // this.subsWillBlur && this.subsWillBlur.remove();
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
      // Taro.pageScrollTo = this.pageScrollTo.bind(this);
      // 下拉刷新
      Taro.startPullDownRefresh = this.startPullDownRefresh.bind(this); // 原Taro有bug
      Taro.stopPullDownRefresh = this.stopPullDownRefresh.bind(this);
      // TabBar
      Taro.setTabBarBadge = this.setTabBarBadge.bind(this);
      Taro.removeTabBarBadge = this.removeTabBarBadge.bind(this);
      Taro.showTabBarRedDot = this.showTabBarRedDot.bind(this);
      Taro.hideTabBarRedDot = this.hideTabBarRedDot.bind(this);
      Taro.setTabBarStyle = this.setTabBarStyle.bind(this); // 原 Taro 未实现
      Taro.setTabBarItem = this.setTabBarItem.bind(this);
      Taro.showTabBar = this.showTabBar.bind(this);
      Taro.hideTabBar = this.hideTabBar.bind(this);
      // 生命周期
      // ✅componentDidShow
      // ✅componentDidHide
      // ✅onPullDownRefresh
      // useDidShow
      // useDidHide
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
          _headerBackgroundColor: backgroundColor,
        });
      } catch (error) {
        return errorHandler(error, fail, complete);
      }
      return successHandler(success, complete);
    }

    // 在 navigation bar 上显示加载圈
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

    /**
     * 开始下拉刷新。调用后触发下拉刷新动画，效果与用户手动下拉刷新一致。
     */
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

    /**
     * 停止当前页面下拉刷新
     */
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

    /**
     * 为 tabBar 某一项的右上角添加文本
     * @param {NavigatorBadgeOption} option index:tabBar 的哪一项，从左边算起; text: 显示的文本，超过 4 个字符则显示成 ...
     */
    private setTabBarBadge(option: NavigatorBadgeOption) {
      const { index, text, success, fail, complete } = option;
      try {
        _globalTabBarBadgeConfig[`${index}`] = {
          _tabBarBadgeIndex: index,
          _tabBarBadgeText: text,
          _stackIndex: _methodStack.index++,
        };
        this.props.navigation.setParams(_globalTabBarBadgeConfig);
      } catch (error) {
        return errorHandler(error, fail, complete);
      }
      return successHandler(success, complete);
    }

    /**
     * 移除 tabBar 某一项右上角的文本
     * @param option index: tabBar 的哪一项，从左边算起
     */
    private removeTabBarBadge(option: NavigatorBadgeRemoveOption) {
      const { index, success, fail, complete } = option;
      try {
        delete _globalTabBarBadgeConfig[`${index}`];
        this.props.navigation.setParams(_globalTabBarBadgeConfig);
      } catch (error) {
        return errorHandler(error, fail, complete);
      }
      return successHandler(success, complete);
    }

    /**
     * 显示 tabBar 某一项的右上角的红点
     * @param option index: tabBar 的哪一项，从左边算起
     */
    private showTabBarRedDot(option: NavigatorRedDotOption) {
      const { index, success, fail, complete } = option;
      try {
        _globalTabBarRedDotConfig[`${index}`] = {
          _tabBarRedDotIndex: index,
          _stackIndex: _methodStack.index++,
        };
        this.props.navigation.setParams(_globalTabBarRedDotConfig);
      } catch (error) {
        return errorHandler(error, fail, complete);
      }
      return successHandler(success, complete);
    }

    /**
     * 隐藏 tabBar 某一项的右上角的红点
     * @param option index: tabBar 的哪一项，从左边算起
     */
    private hideTabBarRedDot(option: NavigatorRedDotOption) {
      const { index, success, fail, complete } = option;
      try {
        delete _globalTabBarRedDotConfig[`${index}`];
        this.props.navigation.setParams(_globalTabBarRedDotConfig);
      } catch (error) {
        return errorHandler(error, fail, complete);
      }
      return successHandler(success, complete);
    }

    /**
     * 动态设置 tabBar 的整体样式
     */
    private setTabBarStyle(option?: NavigatorStyleOption) {
      const { color, selectedColor, backgroundColor, borderStyle, success, fail, complete } = option || {};
      try {
        _globalTabBarStyleConfig._tabColor = color;
        _globalTabBarStyleConfig._tabSelectedColor = selectedColor;
        _globalTabBarStyleConfig._tabBackgroundColor = backgroundColor;
        _globalTabBarStyleConfig._tabBorderStyle = borderStyle;
        this.props.navigation.setParams(_globalTabBarStyleConfig);
      } catch (error) {
        return errorHandler(error, fail, complete);
      }
      return successHandler(success, complete);
    }

    /**
     * 动态设置 tabBar 某一项的内容
     * @param option
     */
    private setTabBarItem(option: NavigatorItemOption) {
      const { index, text, iconPath, selectedIconPath, success, fail, complete } = option;
      try {
        _globalTabBarItemConfig[`${index}`] = {
          _tabBarItemIndex: index,
          _tabBarItemText: text,
          _tabBarItemIconPath: iconPath,
          _tabBarItemSelectedIconPath: selectedIconPath,
          _stackIndex: _methodStack.index++,
        };
        this.props.navigation.setParams(_globalTabBarItemConfig);
      } catch (error) {
        return errorHandler(error, fail, complete);
      }
      return successHandler(success, complete);
    }

    private showTabBar(option?: NavigatorTabBarOption) {
      const { success, fail, complete } = option || {};
      try {
        _globalTabBarVisibleConfig._tabBarVisible = true;
        this.props.navigation.setParams(_globalTabBarVisibleConfig);
      } catch (error) {
        return errorHandler(error, fail, complete);
      }
      return successHandler(success, complete);
    }

    private hideTabBar(option?: NavigatorTabBarOption) {
      const { success, fail, complete } = option || {};
      try {
        _globalTabBarVisibleConfig._tabBarVisible = false;
        this.props.navigation.setParams(_globalTabBarVisibleConfig);
      } catch (error) {
        return errorHandler(error, fail, complete);
      }
      return successHandler(success, complete);
    }

    private handlePullRefresh = () => {
      this.setState({ refreshing: true });
      this.getScreenInstance().onPullDownRefresh && this.getScreenInstance().onPullDownRefresh();
    };

    render() {
      const { enablePullDownRefresh, disableScroll } = getNavigationOption(Screen.config);
      // 页面配置优先级 > 全局配置
      let isScreenEnablePullDownRefresh =
        enablePullDownRefresh === undefined ? globalNavigationOptions.enablePullDownRefresh : enablePullDownRefresh;
      return disableScroll ? (
        <SafeAreaView style={{ height: '100%', width: '100%' }}>
          <Screen ref={this.screenRef} {...this.props} />
        </SafeAreaView>
      ) : (
        <SafeAreaView style={{ height: '100%', width: '100%' }}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ minHeight: '100%' }}
            alwaysBounceVertical
            scrollEventThrottle={5}
            refreshControl={
              isScreenEnablePullDownRefresh ? (
                <RefreshControl refreshing={this.state.refreshing} onRefresh={this.handlePullRefresh} />
              ) : undefined
            }>
            <Screen ref={this.screenRef} {...this.props} />
          </ScrollView>
        </SafeAreaView>
      );
    }
  }
  return WrappedScreen;
}

export default getWrappedScreen;
