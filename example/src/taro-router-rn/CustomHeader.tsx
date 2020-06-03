/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

export interface IProps {
  screenTitle: string;
  rnConfig: any;
  backPress?: () => void;
}

export default class CustomHeader extends React.Component<IProps> {
  private handleBackPress = () => {
    this.props.backPress && this.props.backPress();
  };

  render() {
    const { screenTitle = '', rnConfig } = this.props;
    return (
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          position: 'relative',
          height: rnConfig.navigationBarHeight,
          backgroundColor: rnConfig.navigationBarBackgroundColor,
        }}>
        {/* 标题 */}
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: rnConfig.navigationBarTitlePosition === 'left' ? 'flex-start' : 'center',
            justifyContent: 'center',
            padding: 48,
          }}>
          <Text
            style={{
              color: rnConfig.navigationBarTitleStyle.color,
              fontSize: rnConfig.navigationBarTitleStyle.fontSize,
              fontFamily: rnConfig.navigationBarTitleStyle.fontFamily,
              fontWeight: rnConfig.navigationBarTitleStyle.fontWeight,
              height: rnConfig.navigationBarTitleStyle.fontSize,
              includeFontPadding: false,
            }}>
            {screenTitle}
          </Text>
        </View>
        {/* 返回键 */}
        <TouchableOpacity onPress={this.handleBackPress}>
          <Image
            style={{ height: 30, width: 30, marginStart: 8 }}
            source={
              typeof rnConfig.navigationBarBackIcon === 'string'
                ? { uri: rnConfig.navigationBarBackIcon }
                : rnConfig.navigationBarBackIcon
            }
          />
        </TouchableOpacity>
        {/* 菜单键 */}
        <View
          style={{
            position: 'absolute',
            right: 0,
            height: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          {rnConfig.navigationBarMenus.map((item: any, index: number) => {
            return (
              <TouchableOpacity
                key={`navigation-bar-menus-${index}`}
                onPress={() => {
                  item.click && item.click();
                }}>
                {item.icon ? (
                  <Image
                    style={{ height: 30, width: 30, marginEnd: 16 }}
                    source={typeof item.icon === 'string' ? { uri: item.icon } : item.icon}
                  />
                ) : (
                  <Text style={{ marginEnd: 16, color: item.color ? item.color : '#343434', fontSize: 16 }}>
                    {item.text}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }
}
