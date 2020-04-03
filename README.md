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
        fs.watch(path + fileName, (event, file) => {
            console.log('beforeBuild event', event);
            console.log('beforeBuild file', file);
            if (event === 'change') {
            fs.readFile(path + fileName, (err, data) => {
                if (err)
                return
                const codeStr = data.toString();
                if (codeStr === '')
                return
                if (codeStr.indexOf('@heytea/taro-router-rn') !== -1)
                return
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
        console.log('afterBuild', stats)
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
