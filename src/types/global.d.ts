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

type Taro = any;

type KV = { [key: string]: any };
