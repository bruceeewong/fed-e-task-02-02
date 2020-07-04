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

### 模式

mode

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

### 兼容多种

1. 遵循ES Module的import

2. 遵循CommonJS标准的require: 注意引入时使用`const aa = require('./aa.js').default`要用模块的`default`

3. 遵循AMD标准的define/require

几种触发方式

1. js的import
2. css的@import, url函数
3. html标签,  href, src等

## Webpack核心工作过程

以JS为入口, 加载所有依赖, 交给对应的Loader处理,最后输出打包结果, 其中Loader是绝对核心.



















































































