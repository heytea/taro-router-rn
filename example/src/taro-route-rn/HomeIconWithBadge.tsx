import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { _globalTabBarBadgeConfig, _globalTabBarRedDotConfig, _globalTabBarItemConfig } from './config';
import { isUrl } from './utils';

export interface HomeIconWithBadgeProps {
  index: number;
  focused: boolean;
  selectedIcon: any;
  icon: any;
  text?: string;
  color: string;
  selectedColor: string;
}

interface IState {}

export default class HomeIconWithBadge extends React.Component<HomeIconWithBadgeProps, IState> {
  static defaultProps = {
    text: '',
  };
  render() {
    const { index, focused, selectedIcon, icon, text, color, selectedColor } = this.props;
    // 红点与badge的显示优先跟其调用的顺序有关系，后面调用的会覆盖前面，红点与badge只能显示其一
    const badgeValue = _globalTabBarBadgeConfig[`${index}`];
    const redDotValue = _globalTabBarRedDotConfig[`${index}`];
    const shouldBadge = badgeValue && (redDotValue ? badgeValue._stackIndex > redDotValue._stackIndex : true);
    const shouldRedDot = redDotValue && (badgeValue ? redDotValue._stackIndex > badgeValue._stackIndex : true);
    const { _tabBarBadgeText = '' } = badgeValue || {};
    const badgeText = _tabBarBadgeText.length > 4 ? '...' : _tabBarBadgeText;

    // 动态设置 tabBar 某一项的内容
    const tabBarItemValue = _globalTabBarItemConfig[`${index}`];
    const dynamicText = tabBarItemValue && tabBarItemValue._tabBarItemText;
    const dynamicIconPath = tabBarItemValue && tabBarItemValue._tabBarItemIconPath;
    const dynamicSelectedIconPath = tabBarItemValue && tabBarItemValue._tabBarItemSelectedIconPath;

    let iconPath = icon;
    if (dynamicIconPath) {
      iconPath = isUrl(dynamicIconPath) ? { uri: dynamicIconPath } : dynamicIconPath;
    }
    let selectIconPath = selectedIcon;
    if (dynamicSelectedIconPath) {
      selectIconPath = isUrl(dynamicSelectedIconPath) ? { uri: dynamicSelectedIconPath } : dynamicSelectedIconPath;
    }

    return (
      <View style={styles.container}>
        <View style={styles.body}>
          <Image style={styles.img} source={focused ? selectIconPath : iconPath} />
          <Text style={[styles.text, { color: focused ? selectedColor : color }]}>
            {dynamicText ? dynamicText : text}
          </Text>
        </View>
        {/* Badge */}
        {shouldBadge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badgeText}</Text>
          </View>
        )}
        {/* RedDot */}
        {shouldRedDot && <View style={styles.reddot} />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 30,
    height: 30,
    position: 'relative',
  },
  body: {
    width: 30,
    height: 30,
    position: 'absolute',
    top: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    width: 26,
    height: 26,
  },
  text: {
    fontSize: 10,
    marginTop: 1,
  },
  badge: {
    minHeight: 18,
    minWidth: 18,
    maxWidth: 25,
    backgroundColor: '#e1473c',
    position: 'absolute',
    top: -5,
    right: -6,
    borderRadius: 18,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    padding: 2,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
  },
  reddot: {
    position: 'absolute',
    top: -5,
    right: 2,
    height: 10,
    width: 10,
    backgroundColor: '#e1473c',
    borderRadius: 18,
  },
});
