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
