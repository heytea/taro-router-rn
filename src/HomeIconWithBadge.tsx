import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export interface HomeIconWithBadgeProps {
  focused: boolean;
  selectedIcon: any;
  icon: any;
  text?: string;
  color: string;
  selectedColor: string;
}

interface IState {

}

export default class HomeIconWithBadge extends React.Component<HomeIconWithBadgeProps, IState> {
  static defaultProps = {
    text: ''
  }
  render() {
    const { focused, selectedIcon, icon, text, color, selectedColor } = this.props;
    return (
      <View style={styles.container}>
        <Image style={styles.img} source={focused ? selectedIcon : icon} />
        <Text style={[styles.text, { color: focused ? selectedColor : color }]}>{text}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
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
})