import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { _globalTabBarBadgeConfig, _globalTabBarRedDotConfig, _globalTabBarItemConfig } from './config';

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

    // 动态设置 tabBar 某一项的内容
    const dynamicText = _globalTabBarItemConfig[`${index}`] && _globalTabBarItemConfig[`${index}`]._tabBarItemText;

    return (
      <View style={styles.container}>
        <View style={styles.body}>
          <Image style={styles.img} source={focused ? selectedIcon : icon} />
          <Text style={[styles.text, { color: focused ? selectedColor : color }]}>
            {dynamicText ? dynamicText : text}
          </Text>
        </View>
        {/* Badge */}
        {shouldBadge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badgeValue._tabBarBadgeText}</Text>
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
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
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
