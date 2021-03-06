

# Webpack 模块打包工具笔记

> 作者: Bruski
>
> 时间: 2020/07/03

## 背景

1. ES Modules 存在环境兼容问题
2. 模块过多，网络请求频繁
3. 所有前端资源都需要模块化

## 解决方案

1. 新特性代码编译: 将ES6语法编译成浏览器识别的兼容代码
2. 模块化JavaScript打包: 开发阶段采用模块话，生产阶段打包成少数文件，减少请求
3. 支持不同类型的资源模块:不仅仅是 JS 文件

## 模块打包工具

Webpack, Parcel, Rollup

Webpack: 支持任意类型文件, 代码拆分(Code Splitting)

## Webpack上手

安装 webpack, webpack-cli 工具作为开发依赖(dev-dependencies)

```
yarn add webpack webpack-cli -D
```

直接运行 yarn webpack，webpack会默认从 `src/index.js` 作为入口开始执行打包

## Webpack 配置文件

项目根目录添加 `webpack.config.js` 文件，基于 `node`环境，需使用 `CommonJS ` 语法。

最基础的配置, 配置入口文件与输出路径和名称

```js
const path = require("path");

module.exports = {
  entry: "./src/main.js",
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "dist"),
  },
};
```

模式 mode

参数支持:

1. production
2. development
3. none: 最原始的打包，不做任何操作

制定模式

1. 命令行 `--mode production`
2. 配置文件中设`mode: production`

## Webpack打包结果运行原理

打包后的结果，将所有模块放到一个文件中，包含内容：

1. webpack引导代码
2. 打包的模块以数组参数的形式添加在引导代码后面

内部：

1. 存放安装的模块的对象
2. 添加一些参数
3. 加载并执行第一个模块(入口模块)

## Webpack资源模块加载

核心: `Loader`, 通过Loader可以加载任何类型的资源.

JavaScript驱动整个前端应用, 在JS里引入其他文件,比较合理.

### CSS模块

需要`css-loader`,  `style-loader`处理器, `css-loader`的作用是将CSS代码转换为JS代码，`style-loader`的作用是将`css-loader`的输出以`<style>`标签的形式追加到html head中，使样式生效。

### 文件资源加载器

Loader: `file-loader`

在Webpack中打包时,拷贝到输出目录, 将导出后的文件路径作为模块的返回值返回, 对外导出.

改变静态资源前缀路径: 在`webpack`配置文件处定义 `publicPath` 为 `path/to/`, 在webpack内部以`__webpack_require__.p `作为路径前缀取拼接资源路径,所以最后面的斜线不能漏掉

### DATA-URL加载器

`Data URLs` 是一种用url表示文件内容的URL协议.

```
// 协议 |  媒体类型和编码     | 文件内容
data:[<mediatype>][;base64],<data>
```

例如, html文件可以表示为:

```
data:text/html;charset:UTF-8,<h1>html content</h1>
```

图片资源:

```
data:image/png;base64,djslkagviosj...
```

对体积比较小的资源,直接用`url-loader`转为`data-url`,减少HTTP请求的次数;

对于大文件,还是采用`file-loader`抽出,引入路径.

配置示意(注意要同时安装`file-loader`)

```javascript
{
    test: /\.png$/,
    use: {
    	loader: "url-loader",
        options: {
        	limit: 10 * 1024, // 10kb
        },
    },
},
```

### html-loader

默认只会对`img:src`执行资源加载, 要支持如`a`标签的`href`要单独配置

### 其他常用加载器

分类:

1. 编译转换类: 将资源模块转为JavaScript代码
2. 文件操作类
3. 代码检查类: ESLint

## Webpack 处理ES2015

webpack只是打包工具, 核心只识别`import/export`,并不能转换ES2015以上语法

使用`babel-loader`处理JS语法新特性, 安装`babel-loader`, `@babel/core`, `@babel/preset-env`

## Webpack模块加载方式

兼容多种方式:

1. 遵循ES Module的import

2. 遵循CommonJS标准的require: 注意引入时使用`const aa = require('./aa.js').default`要用模块的`default`

3. 遵循AMD标准的define/require

几种触发方式

1. js的import
2. css的@import, url函数
3. html标签的属性: href, src等

## Webpack核心工作过程

以JS为入口, 加载所有依赖, 交给对应的Loader处理,最后输出打包结果, 其中Loader是绝对核心.

## 开发一个Loader

Loader实际上就是读取文件文本, 进行自定义处理, 返回处理后含JavaScript代码的文本内容.

如开发一个解析markdown的loader, 借助`marked`包,将markdown文本转为html代码, 返回导出模块的js文本

```javascript
const marked = require("marked");

module.exports = (source) => {
  console.log(source);
  return `export default ${JSON.stringify(marked(source))}`;
};
```

在`main.js`中拿到的就是转换格式后的html文本

```javascript
import about from "./about.md";

document.write(about);
```

或者改造成管道, 修改上述markdown-loader:

```javascript
const marked = require("marked");

module.exports = (source) => marked(source);
```

结合`html-loader`实现markdown->html文本->html-loader的管道, 可以轻松实现markdown转html.

## Webpack插件机制

Webpack的扩展, 用于打造自动化工作流

### 自动清除目录

Plugin: `clean-webpack-plugin`

Webpack只是覆盖,不会删除遗留文件; 此插件可以自动清除 `dist` 下的文件

使用示例:

```javascript
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
module.exports = {
    // ...
  	plugins: [new CleanWebpackPlugin()],
};
```

### 自动生成HTML插件

Plugin: `html-webpack-plugin`

Webpack默认只会输出一个bundle的js文件, 如果要一并输出引用该script的html, 使用此插件.

可以配置html的标签如meta,

在里面定义的变量, 可以在html中以模板的方式渲染

使用示例:

```javascript
const HtmlWebpackPlugin = require("html-webpack-plugin");
plugins: [
    // ...
    new HtmlWebpackPlugin({
      title: "Webpack HTML Plugin",
      template: "public/index.html",
      meta: {
        viewport: "width=device-width",
      },
    }),
  ],
```

位于public目录下的模板html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Document</title>
  </head>
  <body>
    <h1><%= htmlWebpackPlugin.options.title %></h1>
  </body>
</html>
```

输出:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Document</title>
    <meta name="viewport" content="width=device-width" />
  </head>

  <body>
    <h1>Webpack HTML Plugin</h1>
    <script src="bundle.js"></script>
  </body>
</html>
```

如需同时输出多个html,  在插件列表中实例化多个HtmlWebpackPlugin实例.

### 文件拷贝

Plugin: `copy-webpack-plugin`

使用示例

```javascript
const CopyWebpackPlugin = require("copy-webpack-plugin");

// ...
plugins: [
	new CopyWebpackPlugin({
    	patterns: ["public"],
    }),
]
```

### 其他插件

提炼关键词, 搜索webpack插件

### 开发一个插件

#### Webpack编译时的钩子机制

https://webpack.js.org/api/compiler-hooks/

比如, 开发一个插件, 将bundle.js中的注释删除

```javascript
class MyPlugin {
  apply(compiler) {
    console.log("my-plugin launch");

    // 在编译时将要向外输出打包结果时, 注册处理任务
    compiler.hooks.emit.tap("MyPlugin", (compilation) => {
      for (const name in compilation.assets) {
        // console.log(name); // 文件名
        // console.log(compilation.assets[name] .source()); // 文件内容
        // console.log(compilation.assets[name].size()); // 文件内容大小
        if (name.endsWith(".js")) {
          const contents = compilation.assets[name].source();
          const withoutComments = contents.replace(/\/\*\*+\*\//g, ""); // 删除注释
            
          // 将处理结果写回, 注意都是属性都是getter函数
          compilation.assets[name] = {
            source: () => withoutComments,
            size: () => withoutComments.length,
          };
        }
      }
    });
  }
}
```

使用

```javascript
  plugins: [
    new MyPlugin(),
  ],
```

## 开发体验问题

1. 以文件类型模拟线上服务器
2. 及时编译、及时预览
3. 调试代码：SourceMap

## Webpack增强

### 自动编译

script: `webpack --watch`

监听文件变化，执行编译命令, 查看编辑结果

### 自动刷新页面

工具： `BrowserSync`

监听目录文件，刷新浏览器

```
browser-sync dist/ --files '**/*
```

结合自动编译，BrowserSync监听编译输出的目录文件，自动刷新浏览器，可以实现代码开发热更新的体验。

### Webpack DevServer

集成自动编译+自动刷新页面的功能

将打包结果存放在**内存**当中，内部HTTP Server将内存中的文件发给浏览器，减少磁盘读写，速度快。

#### 静态资源

```javascript
devServer {
	contentBase: ''  // 静态资源地址
}
```

#### API配置代理

如果前后端不同源，且后端未开启CORS(跨域资源共享)设置，XHR响应在浏览器会被拦截。

可以使用devServer做代理服务。

```javascrip
devServer: {
	proxy: {
  	"/api": {
      target: "https://api.github.com", // http://localhost:8080/api/* -> https://api.github.com/api/*
      pathRewrite: {
      "^/api": "", // http://localhost:8080/api/* -> https://api.github.com/*
      },
      // 默认的主机名是 localhost:8080 -> api.github.com
      changeOrigin: true,
    },
	}
}
```

### SourceMap

Source Map记录着转换后的代码与源代码映射关系, 对调试源代码非常有帮助

里面含

* version
* sources
* names
* mappings: 压缩后的映射内容

source map注释 , 浏览器会请求该文件,逆向解析转换后的代码

```
//# sourcemappingURL=jquery-3.4.1.min.map
```

#### Webpack中的source map模式

在配置中的`devtool`配置sourcemap, 支持的模式有:

```javascript
const allowModes = [
  "eval",
  "source-map",
  "inline-source-map",
  "hidden-source-map",
  "nosources-source-map",
  "eval-source-map",
  "cheap-source-map",
  "cheap-module-source-map",
  "cheap-eval-source-map",
  "cheap-module-eval-source-map",
  "inline-cheap-source-map",
  "inline-cheap-module-source-map",
];
```

##### eval

```javascript
devtool: 'eval'
```

原理:

JS中的eval语句 , 在`虚拟机`中运行包含js代码的字符串

```javascript
eval("console.log('123')")
```

若加上sourceURL即可标识其执行文件的位置

```javascript
eval("console.log('123') //# sourceURL=./foo/bar.js")
```

应用:

直接将编译后的代码,写进eval函数中,并在尾部添加sourceURL标注路径

优点:

1. 构建速度快

缺点:

​	1. 只能标注出错的文件, 不能指出错误的行列信息

##### source-map

生成了source-map, 可以定位到行列错误

##### cheap-source-map

阉割版的source-map, 只能定位到行错误,速度较快

##### cheap-eval-source-map

可以定位到转换后的代码的位置

##### cheap-module-eval-source-map

可以定位到源代码的位置

##### hidden-source-map

开发第三方包, 没有通过URL引入, 需要定位错误时再引入

##### nosources-source-map

能看到错误信息,行列信息,但隐藏了源代码,保护源代码不暴露

#### 最佳实践

##### 开发环境

```javascript
devtool: 'cheap-module-eval-source-map'
```

Vue/React框架转换后差异大,需要定位转换前的代码；构建速度慢,但是重新构建速度快.

##### 生产环境

选择  `none`或者 `nosources-source-map`

### 模块热更新

Hot Module Replacement (HMR), 更新页面不会改变当前的状态

在启动devServer时,自动加载更新的代码,而不刷新页面,极大提升开发效率

Webpack中, 使用`--hot`开启热更新功能 

```
webpack-dev-server --hot
```

或者通过配置

```javascript
const webpack = require('webpack')
module.export = {
    devServer: {
        hot: true // 开启热更新
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()  // 加载webpack自带的插件
    ]
}
```

配置完后, 样式文件的热替换生效,但是JS的更新还是会刷新页面??

#### HMR疑惑: JavaScript模块的热更新

>  HMR没法开箱即用,需要根据文件类型的热替换逻辑

样式模块更新只要把更新的代码块替换上去覆盖样式即可.

但脚本文件等引用, 导出, 毫无规律,没法做通用的替换.

使用框架开发, 项目中每个文件都是有规则, 就有通用的替换办法

#### HMR APIs

自定义处理JS模块的更新

使用API可以监听到文件的变化, 但是需要自己实现替换的逻辑

```
module.hot.accept('/path/to/file', () => { // 热替换逻辑 })
```

#### 图片的模块热替换

重新设置图片的`src`即可

#### HMR热替换注意事项

如果热替换失败, 会回退到页面刷新,把错误刷掉

使用`hotOnly`: 无论热替换是否成功,都不会刷新页面.

使用是需先判断是否存在`hot属性`

```
if (module.hot) {}
```

如果把插件中 webpack.HotModuleReplacementPlugin去掉, 以及去掉配置中的`hot`或者`hotOnly`, 相关的处理逻辑会变成, 从而不影响正常的代码

```
if (false) {}
```

## Webpack 生产环境优化

配置: `mode`, 根据工作环境应用不同的配置

```
module.exports = (env, argv) => {
	const config = {}
	if (env === 'production') {}
	return config
}
```

#### 不同环境的配置文件

如果项目过大, 还是要拆分配置文件:

- webpack.common.js
- webpack.dev.js
- webpack.prod.js

使用`webpack-merge`合并webpack配置

使用是要`--config xxx.js`指定配置文件

## Webpack DefinePlugin

为代码注入全局成员, 注入process.env.NODE_ENV, 注入变量或代码片段

设置一段符合JS语法的字面量语句, 直接替换代码片段

```
new webpack.DefinePlugin({
	API_BASE_URL: '"http://api.example.com"',
}),
```

```
console.log(API_BASE_URL);
```

## Tree Shaking

将未引用代码标识为`dead code`, 并在打包时移除标记的未引用代码

在webpack中`mode: production`自动开启.

手动配置的话, 

```javascript
  optimization: {
    // 标记模块(标记枯树叶), 根据是否被使用的成员
    usedExports: true,
    // 清除被标记的模块(摇树),压缩输出结果
    minimize: true,
  }
```

进一步优化,可以使用`concatenateModules`合并模块, 将所有模块提升至一个函数内, 配合minimize进一步压缩代码

```javascript
  optimization: {
    // 标记模块(标记枯树叶), 根据是否被使用的成员
    usedExports: true,
    // 清除被标记的模块(摇树),压缩输出结果
    minimize: true,
    // 合并模块提升到一个函数中
    concatenateModules: true
  }
```

### 使用Babel导致TreeShaking失效

使用Webpack打包必须是ESM,  而Babel-loader有可能将代码中的ES Modules -> CommonJS, Webpack再拿到的就是CommonJS组织的代码, Tree Shaking 失败. **最新Babel-Loader**已经将内部ES转换关闭

配置Babel-loader的options, 手动开启ES模块转换

```javascript
{
    loader: 'babel-loader',
    options: {
        presets: [
            ['@babel/preset-env', { modules: 'commonjs' }]  // 默认为 false
        ]
    }
}
```

## SideEffect

副作用指代码可以影响函数块之外的环境, 如JS给原型链挂载方法, CSS影响样式等.

```javascript
// webpack.config.js
optimization: {
	sizeEffects: true
}
```

然后在项目`package.json`中指定有副作用的模块, 如果没有副作用, 没有用到的模块就不会被打包进来

```
// package.json
{
	"sideEffects": false // 项目下所有模块都没有副作用
}
```

## Code Splitting

代码分包.

模块化开发,每个模块可能很小,导致打包模块过多,太散. 而HTTP 1.1 存在`同域并行请求限制`

分包情形

1. 多入口打包
2. 动态导入

### 多入口打包

适用多页应用开发,

entry多入口打包:

```
entry: {
	index: './src/index.js',
	album: './src/album.js'
},
output: {
	filename: '[name].bundle.js'  // 占位符动态导出名字
}
```

### 提取公共模块

以下配置可以将多文件共同引用的文件单独导出到一个公共文件中

```javascript
optimization: {
    splitChunks: {
        chunks: 'all'
    }
}
```

### 动态导入

Webpack提供的`import`函数. 配合魔法注释 

```
import(/* webpackChunkName: 'components' */'./posts/posts').then(...)
```

相同chunkName的会打包到一起

### MiniCssExtractPlugin

之前采用style-loader会将CSS写入页面, 而使用此插件, 可以将结果抽取CSS代码到文件

```
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// webpack.config.js
{
	module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          // 'style-loader', // 将样式通过 style 标签注入
          MiniCssExtractPlugin.loader,  // 使用插件的loader
          "css-loader",
        ],
      },
    ],
  },
  plugins: [
  	// ...
    new MiniCssExtractPlugin(),
  ],
}
```

最佳实践: 如果CSS文件操作150kb, 考虑抽取成文件

## 压缩CSS文件

plugin `OptimizeCssAssetsWebpackPlugin`

官方文档中,不是配置到plugin数组中, 配置到`optimaztion`的`minimizer`, 由minimize统一控制

```
optimization: {
    minimizer: [
        new OptimizeCssAssetsWebpackPlugin(),
    ],
},
```

## 压缩JS文件

plugin `TerserWebpackPlugin`

```javascript
optimization: {
    minimizer: [
        new TerserWebpackPlugin(),
    ],
},
```

## 文件名Hash

作用:解决浏览器缓存失效时间长, 更新时不生效的问题.

占位符的哈希有三种:

1. [hash] 项目级别, 项目变了就变
2. [chunkhash] 模块级别
3. [contenthash] 文件级别, 最适合解决缓存问题

占位符指定长度, 8位contenthash在实践中最好  

 ```filename: [name]-[contenthash:8].js```











































