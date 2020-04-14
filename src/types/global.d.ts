interface TabBarListItem {
  selectedIconPath: any;
  iconPath: any;
  pagePath: string;
  text: string;
}

interface TabBar {
  color: string;
  selectedColor: string;
  borderStyle: string;
  backgroundColor: string;
  list: TabBarListItem[];
}

type PageListItem = [string, any];
type PageList = PageListItem[];

interface NavigateOption {
  url: string;
  success?: () => void;
  fail?: () => void;
  complete?: () => void;
}

declare class Taro {
  navigateTo(option: NavigateOption): void;
  redirectTo(option: NavigateOption): void;
  navigateBack(option: NavigateOption): void;
  switchTab(option: NavigateOption): void;
  getCurrentPages(): void;
  reLaunch(option: NavigateOption): void;
  showTabBar(): void;
  hideTabBar(): void;
  showTabBarRedDot(): void;
  hideTabBarRedDot(): void;
  setTabBarBadge(): void;
  removeTabBarBadge(): void;
  setTabBarItem(): void;
}

type KV = { [key: string]: any };
