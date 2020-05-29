# @heytea/taro-router-rn

## Install

1. remove @taro/taro-router-rn library in your project.
2. add @heytea/taro-router-rn to your project

    ```json
    "dependencies": {
        "@heytea/taro-router-rn": "git+https://github.com/heytea/taro-router-rn.git"
    }
    ```
3. add compile setting to your config/index.js file

    ```javascript
    class BuildPlugin {
        apply(builder) {
            builder.hooks.beforeBuild.tap('BuildPlugin', (config) => {
            console.log('process.env.TARO_ENV', process.env.TARO_ENV)
            if (process.env.TARO_ENV !== 'rn') {
                return;
            }
            // 初始化app.js文件
            const path = __dirname + '/../rn_temp/';
            const fileName = 'app.js';
            const fileExist = fs.existsSync(path + fileName);
            if (!fileExist) {
                const pathExist = fs.existsSync(path);
                if (!pathExist) {
                fs.mkdirSync(path);
                }
                fs.writeFileSync(path + fileName, '');
            }
            // 监听rn_temp/app.js的变化，将 @tarojs/taro-router-rn 替换为 @heytea/taro-router-rn
            const watcher = fs.watch(path + fileName, (event, file) => {
                console.log('beforeBuild event', event);
                console.log('beforeBuild file', file);
                if (event === 'change') {
                fs.readFile(path + fileName, (err, data) => {
                    if (err)
                    return
                    const codeStr = data.toString();
                    if (codeStr === '')
                    return
                    if (codeStr.indexOf('@heytea/taro-router-rn') !== -1) {
                    // if (process.env.TARO_APP_API === 'prod') {
                    //    watcher.close();
                    // }
                    // watcher.close();
                    return
                    }
                    const newCode = codeStr.replace('@tarojs/taro-router-rn', '@heytea/taro-router-rn')
                    fs.writeFile(path + fileName, newCode, (err) => {
                    console.log('beforeBuild write new code, err', err);
                    })
                })
                }
            })
            })
            // 这个设置不生效，Taro里面没有调用
            builder.hooks.afterBuild.tap('BuildPlugin', (stats) => {
            // TODO: 去除
            // console.log('afterBuild', stats)
            })
        }
        }


    const config = { 
        plugins: [
            new BuildPlugin()
        ],
    }
    ```

## Run

```
$ yarn dev:rn-api-dev
```

## 喜茶增强功能

1. react-navigation 升级至 4.x 和 5.x，目前主要维护在 4.x，当然 5.x 支持 hooks，如果需要支持 Taro.useRouter，则需要使用 5.x 版本，同时还需修改 @tarojs/taro-rn 里的内容，涉及到多个源码包的改动，暂未实施开展。Taro 文档传送门：[http://taro-docs.jd.com/taro/docs/hooks/#userouter](http://taro-docs.jd.com/taro/docs/hooks/#userouter)
2. 补充 window RN端配置 navigationStyle='custom'，原 Taro 不支持 RN。Taro 文档传送门：[http://taro-docs.jd.com/taro/docs/next/tutorial/#window](http://taro-docs.jd.com/taro/docs/next/tutorial/#window)
3. 完善RN端 Taro.setTabBarStyle，原 Taro 未实现。Taro 文档传送门：[http://taro-docs.jd.com/taro/docs/1.3.42/apis/interface/tabbar/setTabBarStyle/](http://taro-docs.jd.com/taro/docs/1.3.42/apis/interface/tabbar/setTabBarStyle/)



待定：

1. 移除了 ScrollView 作为父容器，原 Taro 使用 ScrollView 作为父容器来支持 Taro.startPullDownRefresh、Taro.stopPullDownRefresh。这项功能可能会导致子容器的高度发生变化。我们在考虑是否使用 native 代码进行实现，然后以 react-native 插件的形式提供这个原生能力。

## 喜茶添加功能

由于 react-navigation 默认的标题栏实现并不符合我们当前的需求，所以针对 RN 端添加了一些定制标题栏的能力，同时考虑到不能影响微信小程序等其它端的编译，所以在 window/config 下，增加 rn 属性，用于配置 RN 的专属能力。

该自定义导航条同时支持 Taro.setNavigationBarTitle 来设置标题文字，保持与小程序端在通用API上的对齐。相关配置API，查看下面注释。

在 App.js 的 config 下配置

```javascript
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '',
    navigationBarTextStyle: 'black',
    enablePullDownRefresh: true,
    // 增加 rn，喜茶自定义
    rn: {
      // 手机状态栏
      statusBar: { 
        backgroundColor: 'blue', // 状态栏背景色
        barStyle: 'light-content', // 状态栏文本主题
        translucent: false, // 指定状态栏是否透明。设置为true时，应用会延伸到状态栏之下绘制（即所谓“沉浸式”——被状态栏遮住一部分）。常和带有半透明背景色的状态栏搭配使用。
      }, 
      // 标题文本样式
      navigationBarTitleStyle: {
        color: '',
        fontSize: 13,
        fontFamily: 'xxx',
        fontWeight: '400',
      },
      navigationBarBackgroundColor: '#fff', // 导航条背景色
      navigationBarHeight: 50, // 导航条高度
      navigationBarShadow: false, // 导航条是否有阴影
      // 导航条底线样式
      navigationBarBottomStyle: {
        height: 2,
        width: '100%',
        backgroundColor: '#eee',
      },
      navigationBarTitlePosition: 'left', // 导航栏标题位置，'left', 'center'
      navigationBarBackIcon: '', // 导航栏返回按钮图标，支持http和require
      // 导航栏菜单按钮
      navigationBarMenus: [
        {
          icon: '', // 图片, 支持http和require, 当设置图片时，文字不显示
          text: '', // 文字，当设置图片时text不显示
          color: '', // 文字颜色
          click: () => {}, // 点击回调
        },
      ], 
    },
  },
```

或者在页面的 config 下添加 rn: {}，它的会覆盖 window.config.rn

```javascript
export default class HomeScreen extends React.Component<IProps> {
  static config = {
    rn: {
      navigationBarMenus: [
        {
          text: '按钮1',
          color: '#9e9e9e',
          click: () => {
            console.log('按钮1');
          },
        },
        {
          icon: 'http://static.heytea.com/taro_trial/v1/img/bar/home-icon-normal.png',
          text: '按钮2',
          color: '#9e9e9e',
          click: () => {
            console.log('按钮2');
          },
        },
      ],
    },
  };
```
