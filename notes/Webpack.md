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

处理CSS等非JS文件，需要安装对应的`loader`

### CSS模块

需要`css-loader`,  `style-loader`处理器, `css-loader`的作用是将CSS代码转换为JS代码，`style-loader`的作用是将`css-loader`的输出以`<style>`标签的形式追加到html head中，使样式生效。

