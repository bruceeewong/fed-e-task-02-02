# Rollup

利用 ESM 特性的 ES Module 的打包器，实现扁平的构建结果

## 快速上手

安装 rollup

```
yarn add rollup --dev
```

然后命令行执行, 制定入口文件和输出格式，结果会打印在控制台

```
yarn rollup ./src/index.js --format iife
```

通过`file`去制定输出路径

```
yarn rollup ./src/index.js --format iife --file dist/bundle.js
```

可以看到打印的结果合并到一起，非常扁平，没有额外的代码

## 配置文件

配置文件可以叫任意名字， 如 `rollup.config.js`

简单的配置如下：

```javascript
// 注意是ESM的导出
export default {
  input: "src/index.js",
  output: {
    file: "dist/bundle.js",
    format: "iife",
  },
};
```

执行命令即可按配置打包

```
yarn rollup --config rollup.config.js
```

## 插件

Rollup 唯一的扩展途径

`rollup-plugin-json`: 导入 json 文件插件

```javascript
import json from "rollup-plugin-json";

export default {
  input: "src/index.js",
  output: {
    file: "dist/bundle.js",
    format: "iife",
  },
  plugins: [json()],
};
```

## 使用NPM模块

rollup官方提供`rollup-plugin-node-resolve	`， 用于加载ES Module的NPM模块

```javascript
import resolver from "rollup-plugin-node-resolve";

export default {
  // ...
  plugins: [resolver()],
};

```

### CommonJS模块的NPM包

使用`rollup-plugin-commonjs`来处理

```javascript
import cjsResolver from "rollup-plugin-commonjs";

export default {
  // ...
  plugins: [cjsResolver()],
};
```

## 代码拆分

使用Webpack的Dynamic Import

```javascript
import("./logger").then(({ log }) => {
  log(cjs);
});
```

Code splitting功能：不支持输出格式为 `umd`或者`iife`，必须用`amd`或`commonjs`标准

浏览器就选`amd`输出, 注意此处导出设置不能设置单文件，而是设置目录

```javascript
export default {
  input: "src/index.js",
  output: {
    // file: "dist/bundle.js", // 代码拆分会有多个文件生成
    dir: "dist",
    format: "amd",
  },
};
```

## 多入口打包

将input属性修改为数组, 内部会使用代码拆分

```javascript
export default {
  input: {
    index: "src/index.js",
    album: "src/album.js",
  },
  output: {
    // file: "dist/bundle.js",
    dir: "dist",
    format: "amd",
  },
};
```

打包出来的是amd模块，需要引入`require.js`来使用

```html
<script
    src="https://unpkg.com/requirejs@2.3.6/require.js"
    data-main="index.js"
></script>
```

## 总结

rollup特点：

1. 加载非ESM的第三方模块比较复杂
2. 模块最终都打包到一个函数中，无法实现HMR
3. 浏览器环境中，代码拆分依赖AMD库

开发应用程序：使用Webpack（大而全）

开发框架/类库：使用rollup（小而美）



