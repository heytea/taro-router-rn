"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
class HomeIconWithBadge extends react_1.default.Component {
    render() {
        const { focused, selectedIcon, icon, text, color, selectedColor } = this.props;
        return (react_1.default.createElement(react_native_1.View, { style: styles.container },
            react_1.default.createElement(react_native_1.Image, { style: styles.img, source: focused ? selectedIcon : icon }),
            react_1.default.createElement(react_native_1.Text, { style: [styles.text, { color: focused ? selectedColor : color }] }, text)));
    }
}
HomeIconWithBadge.defaultProps = {
    text: ''
};
exports.default = HomeIconWithBadge;
const styles = react_native_1.StyleSheet.create({
    container: {
        width: 30,
        height: 30,
        display: "flex",
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    img: {
        width: 20,
        height: 20,
    },
    text: {
        fontSize: 12,
    }
});
