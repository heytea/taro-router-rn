"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable react-native/no-inline-styles */
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
class CustomHeader extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.handleBackPress = () => {
            this.props.backPress && this.props.backPress();
        };
    }
    render() {
        const { screenTitle = '', rnConfig } = this.props;
        return (react_1.default.createElement(react_native_1.View, { style: {
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                position: 'relative',
                height: rnConfig.navigationBarHeight,
                backgroundColor: rnConfig.navigationBarBackgroundColor,
            } },
            react_1.default.createElement(react_native_1.View, { style: {
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: rnConfig.navigationBarTitlePosition === 'left' ? 'flex-start' : 'center',
                    justifyContent: 'center',
                    padding: 48,
                } },
                react_1.default.createElement(react_native_1.Text, { style: {
                        color: rnConfig.navigationBarTitleStyle.color,
                        fontSize: rnConfig.navigationBarTitleStyle.fontSize,
                        fontFamily: rnConfig.navigationBarTitleStyle.fontFamily,
                        fontWeight: rnConfig.navigationBarTitleStyle.fontWeight,
                        height: rnConfig.navigationBarTitleStyle.fontSize,
                        includeFontPadding: false,
                    } }, screenTitle)),
            react_1.default.createElement(react_native_1.TouchableOpacity, { onPress: this.handleBackPress },
                react_1.default.createElement(react_native_1.Image, { style: { height: 30, width: 30, marginStart: 8 }, source: typeof rnConfig.navigationBarBackIcon === 'string'
                        ? { uri: rnConfig.navigationBarBackIcon }
                        : rnConfig.navigationBarBackIcon })),
            react_1.default.createElement(react_native_1.View, { style: {
                    position: 'absolute',
                    right: 0,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                } }, rnConfig.navigationBarMenus.map((item, index) => {
                return (react_1.default.createElement(react_native_1.TouchableOpacity, { key: `navigation-bar-menus-${index}`, onPress: () => {
                        item.click && item.click();
                    } }, item.icon ? (react_1.default.createElement(react_native_1.Image, { style: { height: 30, width: 30, marginEnd: 16 }, source: typeof item.icon === 'string' ? { uri: item.icon } : item.icon })) : (react_1.default.createElement(react_native_1.Text, { style: { marginEnd: 16, color: item.color ? item.color : '#343434', fontSize: 16 } }, item.text))));
            }))));
    }
}
exports.default = CustomHeader;
