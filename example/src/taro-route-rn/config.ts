export interface TabBarVisibleConfig {
  _tabBarVisible?: boolean;
}

const _globalTabBarVisibleConfig: TabBarVisibleConfig = {};

export interface TabBarBadgeConfigValue {
  _tabBarBadgeIndex: number;
  _tabBarBadgeText: string;
  _stackIndex: number;
}

type TabBarBadgeConfig = { [key: string]: TabBarBadgeConfigValue };

/**
 * 全局的Badge配置
 */
const _globalTabBarBadgeConfig: TabBarBadgeConfig = {};

export interface TabBarRedDotConfigValue {
  _tabBarRedDotIndex: number;
  _stackIndex: number;
}

type TabBarRedDotConfig = { [key: string]: TabBarRedDotConfigValue };

/**
 * 全局的RedDot配置
 */
const _globalTabBarRedDotConfig: TabBarRedDotConfig = {};

let _methodStack = {
  index: 0,
};

export interface TabBarStyleConfig {
  _tabColor?: string;
  _tabSelectedColor?: string;
  _tabBackgroundColor?: string;
  _tabBorderStyle?: 'black' | 'white';
}

const _globalTabBarStyleConfig: TabBarStyleConfig = {
  _tabBorderStyle: 'black',
};

export interface TabBarItemValue {
  _tabBarItemIndex: number;
  _tabBarItemText?: string;
  _tabBarItemIconPath?: string;
  _tabBarItemSelectedIconPath?: string;
  _stackIndex: number;
}

type TabBarItemConfig = { [key: string]: TabBarItemValue };

/**
 * 全局 动态设置 tabBar 某一项的内容 配置
 */
const _globalTabBarItemConfig: TabBarItemConfig = {};

export {
  _globalTabBarVisibleConfig,
  _globalTabBarBadgeConfig,
  _globalTabBarRedDotConfig,
  _methodStack,
  _globalTabBarStyleConfig,
  _globalTabBarItemConfig,
};
