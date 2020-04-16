"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const utils_1 = require("./utils");
const LoadingView_1 = __importDefault(require("./LoadingView"));
function getWrappedScreen(Screen, Taro) {
    class WrappedScreen extends react_1.default.Component {
        constructor(props) {
            super(props);
            react_native_1.YellowBox.ignoreWarnings(['Calling `getNode()` on the ref of an Animated']);
        }
        componentDidMount() {
            this.initBinding();
        }
        initBinding() {
            Taro.showTabBar = this.showTabBar.bind(this);
            Taro.hideTabBar = this.hideTabBar.bind(this);
            Taro.setNavigationBarTitle = this.setNavigationBarTitle.bind(this);
            Taro.setNavigationBarColor = this.setNavigationBarColor.bind(this);
            Taro.showNavigationBarLoading = this.showNavigationBarLoading.bind(this);
            Taro.hideNavigationBarLoading = this.hideNavigationBarLoading.bind(this);
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
        render() {
            console.log('1');
            return (react_1.default.createElement(react_native_1.ScrollView, { style: { flex: 1 }, contentContainerStyle: { minHeight: '100%' }, alwaysBounceVertical: true },
                react_1.default.createElement(Screen, Object.assign({}, this.props))));
        }
    }
    WrappedScreen.navigationOptions = ({ navigation, }) => {
        const options = {};
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
        options.headerTitle = (react_1.default.createElement(react_native_1.View, { style: { flexDirection: 'row', alignItems: 'center' } },
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
