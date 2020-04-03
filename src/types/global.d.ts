interface TabBarListItem {
    selectedIconPath: any;
    iconPath: any;
    pagePath: string;
    text: string;
}

interface TabBar {
    color: string,
    selectedColor: string,
    borderStyle: string,
    backgroundColor: string,
    list: TabBarListItem[]
}

type PageListItem = [string, any];
type PageList = PageListItem[];

interface wxNavigateToOption {
    url: string;
    success: () => void;
    fail: () => void;
    complete: () => void;
}

declare class Taro {
    navigateTo(option: wxNavigateToOption): void
}

type KV = { [key: string]: any; }
