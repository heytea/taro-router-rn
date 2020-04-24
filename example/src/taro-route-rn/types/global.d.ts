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

interface BottomTabConfig {
  name: string;
  element: JSX.Element;
}

type PageListItem = [string, any];
type PageList = PageListItem[];

type Taro = any;

type KV = { [key: string]: any };

interface ParamResult {
  res: boolean;
  msg?: string;
}

type SuccessFun = () => void;
type FailFun = (error: Error) => void;
type CompleteFun = () => void;

interface NavigationOption {
  success?: SuccessFun;
  fail?: FailFun;
  complete?: CompleteFun;
}

interface NavigateOption extends NavigationOption {
  url?: string;
}

interface NavigateBackOption extends NavigationOption {
  delta?: number;
}

interface NavigatorTabBarOption extends NavigationOption {
  animation?: boolean;
}

interface NavigatorTitleOption extends NavigationOption {
  title?: string;
}

interface NavigatorBarColorOption extends NavigationOption {
  frontColor?: string;
  backgroundColor?: string;
}

interface NavigatorBadgeOption extends NavigateOption {
  index: number;
  text: string;
}

interface NavigatorRedDotOption extends NavigateOption {
  index: number;
}

interface NavigatorBadgeRemoveOption extends NavigateOption {
  index: number;
}

interface NavigatorStyleOption extends NavigateOption {
  /** tab 上的文字默认颜色，HexColor */
  color?: string;
  /** tab 上的文字选中时的颜色，HexColor */
  selectedColor?: string;
  /** tab 的背景色，HexColor */
  backgroundColor?: string;
  /** tabBar上边框的颜色， 仅支持 black/white */
  borderStyle?: 'black' | 'white';
}

interface NavigatorItemOption extends NavigateOption {
  /** tabBar 的哪一项，从左边算起 */
  index: number;
  /** tab 上的按钮文字 */
  text?: string;
  /** 图片路径，icon 大小限制为 40kb，建议尺寸为 81px * 81px，当 postion 为 top 时，此参数无效 */
  iconPath?: string;
  /** 选中时的图片路径，icon 大小限制为 40kb，建议尺寸为 81px * 81px ，当 postion 为 top 时，此参数无效 */
  selectedIconPath?: string;
}
