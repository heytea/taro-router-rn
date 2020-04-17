"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const utils_1 = require("./utils");
const LoadingView_1 = __importDefault(require("./LoadingView"));
const initRouter_1 = require("./initRouter");
function getWrappedScreen(Screen, globalNavigationOptions = {}, Taro) {
    class WrappedScreen extends react_1.default.Component {
        constructor(props) {
            super(props);
            this.onScroll = (event) => {
                this;
            };
            this.handlePullRefresh = () => {
                this.setState({ refreshing: true });
                this.getScreenInstance().onPullDownRefresh && this.getScreenInstance().onPullDownRefresh();
            };
            react_native_1.YellowBox.ignoreWarnings(['Calling `getNode()` on the ref of an Animated']);
            this.screenRef = react_1.default.createRef();
            this.state = {
                refreshing: false,
            };
        }
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
                    _backgroundColor: backgroundColor,
                });
            }
            catch (error) {
                return utils_1.errorHandler(error, fail, complete);
            }
            return utils_1.successHandler(success, complete);
        }
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
        render() {
            const { enablePullDownRefresh, disableScroll } = initRouter_1.getNavigationOption(Screen.config);
            // 页面配置优先级 > 全局配置
            let isScreenEnablePullDownRefresh = enablePullDownRefresh === undefined
                ? globalNavigationOptions.enablePullDownRefresh
                : enablePullDownRefresh;
            console.log('isScreenEnablePullDownRefresh', isScreenEnablePullDownRefresh);
            return disableScroll ? (react_1.default.createElement(Screen, Object.assign({}, this.props))) : (react_1.default.createElement(react_native_1.ScrollView, { style: { flex: 1 }, contentContainerStyle: { minHeight: '100%' }, alwaysBounceVertical: true, scrollEventThrottle: 5, onScroll: this.onScroll, refreshControl: isScreenEnablePullDownRefresh ? (react_1.default.createElement(react_native_1.RefreshControl, { refreshing: this.state.refreshing, onRefresh: this.handlePullRefresh })) : (undefined) },
                react_1.default.createElement(Screen, Object.assign({ ref: this.screenRef }, this.props))));
        }
    }
    WrappedScreen.navigationOptions = ({ navigation, }) => {
        const options = {};
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
        options.headerTitle = () => (react_1.default.createElement(react_native_1.View, { style: { flexDirection: 'row', alignItems: 'center' } },
            isNavigationBarLoadingShow && react_1.default.createElement(LoadingView_1.default, { tintColor: headerTintColor }),
            react_1.default.createElement(react_native_1.Text, { style: {
                    flexDirection: 'row',
                    flex: 1,
                    fontSize: 17,
                    fontWeight: '600',
                    textAlign: 'center',
                    color: headerTintColor,
                } }, title)));
        return options;
    };
    return WrappedScreen;
}
exports.default = getWrappedScreen;
