"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable react-native/no-inline-styles */
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const react_navigation_1 = require("react-navigation");
const utils_1 = require("./utils");
const LoadingView_1 = __importDefault(require("./LoadingView"));
const initRouter_1 = require("./initRouter");
const config_1 = require("./config");
const NavigationService_1 = __importDefault(require("./NavigationService"));
const CustomHeader_1 = __importDefault(require("./CustomHeader"));
function getWrappedScreen(Screen, globalNavigationOptions = {}, Taro) {
    let screenTitle = '';
    class WrappedScreen extends react_1.default.Component {
        constructor(props) {
            super(props);
            this.handlePullRefresh = () => {
                this.setState({ refreshing: true });
                this.getScreenInstance().onPullDownRefresh && this.getScreenInstance().onPullDownRefresh();
            };
            this.handleBackPress = () => {
                NavigationService_1.default.goBack();
            };
            react_native_1.YellowBox.ignoreWarnings(['Calling `getNode()` on the ref of an Animated']);
            this.screenRef = react_1.default.createRef();
            this.state = {
                refreshing: false,
            };
        }
        UNSAFE_componentWillMount() {
            this.initBinding();
            this.subsDidFocus = this.props.navigation.addListener('didFocus', () => {
                this.initBinding();
                this.getScreenInstance().componentDidShow && this.getScreenInstance().componentDidShow();
            });
            this.subsWillBlur = this.props.navigation.addListener('willBlur', () => {
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
        getScreenInstance() {
            if (this.screenRef.current && this.screenRef.current.getWrappedInstance) {
                return this.screenRef.current.getWrappedInstance() || {};
            }
            else {
                return this.screenRef.current || {};
            }
        }
        initBinding() {
            // 导航栏
            Taro.setNavigationBarTitle = this.setNavigationBarTitle.bind(this);
            Taro.setNavigationBarColor = this.setNavigationBarColor.bind(this);
            Taro.showNavigationBarLoading = this.showNavigationBarLoading.bind(this);
            Taro.hideNavigationBarLoading = this.hideNavigationBarLoading.bind(this);
            // 滚动
            // 不支持RN Taro.pageScrollTo = this.pageScrollTo.bind(this);
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
        setNavigationBarTitle(option) {
            const { title = '', success, fail, complete } = option || {};
            try {
                this.props.navigation.setParams({
                    _tabBarTitle: title,
                });
            }
            catch (error) {
                return utils_1.errorHandler(error, fail, complete);
            }
            return utils_1.successHandler(success, complete);
        }
        setNavigationBarColor(option) {
            const { frontColor, backgroundColor, success, fail, complete } = option || {};
            try {
                this.props.navigation.setParams({
                    _headerTintColor: frontColor,
                    _headerBackgroundColor: backgroundColor,
                });
            }
            catch (error) {
                return utils_1.errorHandler(error, fail, complete);
            }
            return utils_1.successHandler(success, complete);
        }
        // 在 navigation bar 上显示加载圈
        showNavigationBarLoading(option) {
            const { success, fail, complete } = option || {};
            try {
                this.props.navigation.setParams({
                    _isNavigationBarLoadingShow: true,
                });
            }
            catch (error) {
                return utils_1.errorHandler(error, fail, complete);
            }
            return utils_1.successHandler(success, complete);
        }
        hideNavigationBarLoading(option) {
            const { success, fail, complete } = option || {};
            try {
                this.props.navigation.setParams({
                    _isNavigationBarLoadingShow: false,
                });
            }
            catch (error) {
                return utils_1.errorHandler(error, fail, complete);
            }
            return utils_1.successHandler(success, complete);
        }
        /**
         * 开始下拉刷新。调用后触发下拉刷新动画，效果与用户手动下拉刷新一致。
         */
        startPullDownRefresh(option) {
            const { success, fail, complete } = option || {};
            try {
                this.setState({
                    refreshing: true,
                });
            }
            catch (error) {
                return utils_1.errorHandler(error, fail, complete);
            }
            return utils_1.successHandler(success, complete);
        }
        /**
         * 停止当前页面下拉刷新
         */
        stopPullDownRefresh(option) {
            const { success, fail, complete } = option || {};
            try {
                this.setState({
                    refreshing: false,
                });
            }
            catch (error) {
                return utils_1.errorHandler(error, fail, complete);
            }
            return utils_1.successHandler(success, complete);
        }
        /**
         * 为 tabBar 某一项的右上角添加文本
         * @param {NavigatorBadgeOption} option index:tabBar 的哪一项，从左边算起; text: 显示的文本，超过 4 个字符则显示成 ...
         */
        setTabBarBadge(option) {
            const { index, text, success, fail, complete } = option;
            try {
                config_1._globalTabBarBadgeConfig[`${index}`] = {
                    _tabBarBadgeIndex: index,
                    _tabBarBadgeText: text,
                    _stackIndex: config_1._methodStack.index++,
                };
                this.props.navigation.setParams(config_1._globalTabBarBadgeConfig);
            }
            catch (error) {
                return utils_1.errorHandler(error, fail, complete);
            }
            return utils_1.successHandler(success, complete);
        }
        /**
         * 移除 tabBar 某一项右上角的文本
         * @param option index: tabBar 的哪一项，从左边算起
         */
        removeTabBarBadge(option) {
            const { index, success, fail, complete } = option;
            try {
                delete config_1._globalTabBarBadgeConfig[`${index}`];
                this.props.navigation.setParams(config_1._globalTabBarBadgeConfig);
            }
            catch (error) {
                return utils_1.errorHandler(error, fail, complete);
            }
            return utils_1.successHandler(success, complete);
        }
        /**
         * 显示 tabBar 某一项的右上角的红点
         * @param option index: tabBar 的哪一项，从左边算起
         */
        showTabBarRedDot(option) {
            const { index, success, fail, complete } = option;
            try {
                config_1._globalTabBarRedDotConfig[`${index}`] = {
                    _tabBarRedDotIndex: index,
                    _stackIndex: config_1._methodStack.index++,
                };
                this.props.navigation.setParams(config_1._globalTabBarRedDotConfig);
            }
            catch (error) {
                return utils_1.errorHandler(error, fail, complete);
            }
            return utils_1.successHandler(success, complete);
        }
        /**
         * 隐藏 tabBar 某一项的右上角的红点
         * @param option index: tabBar 的哪一项，从左边算起
         */
        hideTabBarRedDot(option) {
            const { index, success, fail, complete } = option;
            try {
                delete config_1._globalTabBarRedDotConfig[`${index}`];
                this.props.navigation.setParams(config_1._globalTabBarRedDotConfig);
            }
            catch (error) {
                return utils_1.errorHandler(error, fail, complete);
            }
            return utils_1.successHandler(success, complete);
        }
        /**
         * 动态设置 tabBar 的整体样式
         */
        setTabBarStyle(option) {
            const { color, selectedColor, backgroundColor, borderStyle, success, fail, complete } = option || {};
            try {
                config_1._globalTabBarStyleConfig._tabColor = color;
                config_1._globalTabBarStyleConfig._tabSelectedColor = selectedColor;
                config_1._globalTabBarStyleConfig._tabBackgroundColor = backgroundColor;
                config_1._globalTabBarStyleConfig._tabBorderStyle = borderStyle;
                this.props.navigation.setParams(config_1._globalTabBarStyleConfig);
            }
            catch (error) {
                return utils_1.errorHandler(error, fail, complete);
            }
            return utils_1.successHandler(success, complete);
        }
        /**
         * 动态设置 tabBar 某一项的内容
         * @param option
         */
        setTabBarItem(option) {
            const { index, text, iconPath, selectedIconPath, success, fail, complete } = option;
            try {
                config_1._globalTabBarItemConfig[`${index}`] = {
                    _tabBarItemIndex: index,
                    _tabBarItemText: text,
                    _tabBarItemIconPath: iconPath,
                    _tabBarItemSelectedIconPath: selectedIconPath,
                    _stackIndex: config_1._methodStack.index++,
                };
                this.props.navigation.setParams(config_1._globalTabBarItemConfig);
            }
            catch (error) {
                return utils_1.errorHandler(error, fail, complete);
            }
            return utils_1.successHandler(success, complete);
        }
        showTabBar(option) {
            const { animation = false, success, fail, complete } = option || {};
            try {
                this.props.navigation.setParams({
                    _tabBarVisible: true,
                    _animation: animation,
                });
            }
            catch (error) {
                return utils_1.errorHandler(error, fail, complete);
            }
            return utils_1.successHandler(success, complete);
        }
        hideTabBar(option) {
            const { animation = false, success, fail, complete } = option || {};
            try {
                this.props.navigation.setParams({
                    _tabBarVisible: false,
                    _animation: animation,
                });
            }
            catch (error) {
                return utils_1.errorHandler(error, fail, complete);
            }
            return utils_1.successHandler(success, complete);
        }
        render() {
            const screenNavigationOptions = initRouter_1.getNavigationOption(Screen.config);
            const rnConfig = utils_1.getRnNavigationOption(screenNavigationOptions.rn, globalNavigationOptions.rn);
            console.log('rnConfig', rnConfig);
            return rnConfig ? (react_1.default.createElement(react_navigation_1.SafeAreaView, { style: { flex: 1, flexDirection: 'column' } },
                react_1.default.createElement(react_native_1.StatusBar, { backgroundColor: rnConfig.statusBar.backgroundColor, barStyle: rnConfig.statusBar.barStyle }),
                react_1.default.createElement(CustomHeader_1.default, { rnConfig: rnConfig, screenTitle: screenTitle, backPress: this.handleBackPress }),
                react_1.default.createElement(react_native_1.View, { style: {
                        height: rnConfig.navigationBarBottomStyle.height,
                        width: rnConfig.navigationBarBottomStyle.width,
                        backgroundColor: rnConfig.navigationBarBottomStyle.backgroundColor,
                    } }),
                rnConfig.navigationBarShadow && (react_1.default.createElement(react_native_1.View, { style: { width: '100%', height: 0.5, backgroundColor: '#aaa', elevation: 2 } })),
                react_1.default.createElement(Screen, Object.assign({}, this.props)))) : (react_1.default.createElement(Screen, Object.assign({}, this.props)));
            // TODO: iOS 刘海屏状态栏背景色问题
            // const safeAreaViewBgColor = rnConfig ? rnConfig.statusBar.backgroundColor : '#fff';
            // if (Platform.OS === 'android') {
            //   return (
            //     <SafeAreaView style={{ height: '100%', width: '100%' }}>
            //       {rnConfig && (
            //         <StatusBar backgroundColor={rnConfig.statusBar.backgroundColor} barStyle={rnConfig.statusBar.barStyle} />
            //       )}
            //       {rnConfig && (
            //         <View
            //           style={{
            //             display: 'flex',
            //             flexDirection: 'row',
            //             alignItems: 'center',
            //             position: 'relative',
            //             height: rnConfig.navigationBarHeight,
            //             backgroundColor: rnConfig.navigationBarBackgroundColor,
            //           }}>
            //           {/* 标题 */}
            //           <View
            //             style={{
            //               position: 'absolute',
            //               width: '100%',
            //               height: '100%',
            //               display: 'flex',
            //               alignItems: rnConfig.navigationBarTitlePosition === 'left' ? 'flex-start' : 'center',
            //               justifyContent: 'center',
            //               padding: 48,
            //             }}>
            //             <Text
            //               style={{
            //                 color: rnConfig.navigationBarTitleStyle.color,
            //                 fontSize: rnConfig.navigationBarTitleStyle.fontSize,
            //                 fontFamily: rnConfig.navigationBarTitleStyle.fontFamily,
            //                 fontWeight: rnConfig.navigationBarTitleStyle.fontWeight,
            //                 height: rnConfig.navigationBarTitleStyle.fontSize,
            //                 includeFontPadding: false,
            //               }}>
            //               {screenTitle}
            //             </Text>
            //           </View>
            //           {/* 返回键 */}
            //           <TouchableOpacity onPress={this.handleBackPress}>
            //             <Image
            //               style={{ height: 30, width: 30, marginStart: 8 }}
            //               source={
            //                 typeof rnConfig.navigationBarBackIcon === 'string'
            //                   ? { uri: rnConfig.navigationBarBackIcon }
            //                   : rnConfig.navigationBarBackIcon
            //               }
            //             />
            //           </TouchableOpacity>
            //           {/* 菜单键 */}
            //           <View
            //             style={{
            //               position: 'absolute',
            //               right: 0,
            //               height: '100%',
            //               display: 'flex',
            //               flexDirection: 'row',
            //               alignItems: 'center',
            //             }}>
            //             {rnConfig.navigationBarMenus.map((item: any, index: number) => {
            //               return (
            //                 <TouchableOpacity
            //                   key={`navigation-bar-menus-${index}`}
            //                   onPress={() => {
            //                     item.click && item.click();
            //                   }}>
            //                   {item.icon ? (
            //                     <Image
            //                       style={{ height: 30, width: 30, marginEnd: 16 }}
            //                       source={typeof item.icon === 'string' ? { uri: item.icon } : item.icon}
            //                     />
            //                   ) : (
            //                     <Text style={{ marginEnd: 16, color: item.color ? item.color : '#343434', fontSize: 16 }}>
            //                       {item.text}
            //                     </Text>
            //                   )}
            //                 </TouchableOpacity>
            //               );
            //             })}
            //           </View>
            //         </View>
            //       )}
            //       {rnConfig && (
            //         <View
            //           style={{
            //             height: rnConfig.navigationBarBottomStyle.height,
            //             width: rnConfig.navigationBarBottomStyle.width,
            //             backgroundColor: rnConfig.navigationBarBottomStyle.backgroundColor,
            //           }}
            //         />
            //       )}
            //       {rnConfig && rnConfig.navigationBarShadow && (
            //         <View
            //           style={{
            //             width: '100%',
            //             height: 0.5,
            //             backgroundColor: '#aaa',
            //             elevation: 2,
            //           }}
            //         />
            //       )}
            //       <Screen {...this.props} />
            //     </SafeAreaView>
            //   );
            // } else {
            // return <Screen {...this.props} />;
            // }
            // TODO: 不再支持PullDownRefresh，因为使用ScrollView可能会导致子容器高度发生变化
            // 页面配置优先级 > 全局配置
            // let isScreenEnablePullDownRefresh =
            //   enablePullDownRefresh === undefined ? globalNavigationOptions.enablePullDownRefresh : enablePullDownRefresh;
            // return disableScroll ? (
            //   <SafeAreaView style={{ height: '100%', width: '100%' }}>
            //     <Screen {...this.props} />
            //   </SafeAreaView>
            // ) : (
            //   <SafeAreaView style={{ height: '100%', width: '100%' }}>
            //     <ScrollView
            //       style={{ flex: 1 }}
            //       contentContainerStyle={{ minHeight: '100%' }}
            //       alwaysBounceVertical
            //       scrollEventThrottle={5}
            //       refreshControl={
            //         isScreenEnablePullDownRefresh ? (
            //           <RefreshControl refreshing={this.state.refreshing} onRefresh={this.handlePullRefresh} />
            //         ) : undefined
            //       }>
            //       <Screen ref={this.screenRef} {...this.props} />
            //     </ScrollView>
            //   </SafeAreaView>
            // );
        }
    }
    WrappedScreen.navigationOptions = ({ navigation, }) => {
        const title = navigation.getParam('_tabBarTitle', '');
        screenTitle = title;
        const options = {};
        const navigationOptions = initRouter_1.getNavigationOption(Screen.config);
        if (navigationOptions.navigationStyle === 'custom' || navigationOptions.rn) {
            options.header = () => react_1.default.createElement(react_native_1.View, null);
            return options;
        }
        const headerTintColor = navigation.getParam('_headerTintColor', undefined);
        headerTintColor && (options.headerTintColor = headerTintColor);
        const backgroundColor = navigation.getParam('_headerBackgroundColor', undefined);
        backgroundColor && (options.headerStyle = { backgroundColor });
        const isNavigationBarLoadingShow = navigation.getParam('_isNavigationBarLoadingShow', false);
        if (react_native_1.Platform.OS === 'android') {
            options.headerTitle = () => (react_1.default.createElement(react_native_1.View, { style: { flexDirection: 'row', alignItems: 'center' } },
                isNavigationBarLoadingShow && react_1.default.createElement(LoadingView_1.default, { tintColor: headerTintColor }),
                react_1.default.createElement(react_native_1.Text, { style: { flexDirection: 'row', flex: 1, fontSize: 16, fontWeight: '600', color: headerTintColor } }, title)));
        }
        else {
            options.title = title;
            options.headerBackTitle = ' ';
            options.headerTintColor = '#343434';
        }
        return options;
    };
    return WrappedScreen;
}
exports.default = getWrappedScreen;
