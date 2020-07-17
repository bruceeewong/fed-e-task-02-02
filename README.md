# Part2-Module2 模块化开发与规范化标准

> 项目：模块作业
>
> 作者：王思哲
>
> 时间：2020/07/15

## 一、简答题

### 1、 Webpack 的构建流程主要有哪些环节？如果可以请尽可能详尽的描述 Webpack 打包的整个过程

webpack构建流程主要有以下环节：

1. 读取命令行参数，寻找webpack配置文件，加载文件配置 & 命令行参数配置
2. 根据entry配置寻找入口文件
3. 从入口文件出发，根据Webpack支持的模块导入语法，递归地找到所有引用的模块
4. 每个模块都会根据webpack配置文件的rules规则，使用对应的loader去处理该类型的文件
5. 在每一个环节，webpack还会调用注册在其生命周期钩子中的函数，对模块内容做进一步处理或者执行自动化任务
6. 所有模块处理结束后，webpack将最终的处理结果，按照输出的配置进行输出
7. 最后webpack在终端输出打包的相关信息，完成构建。

### 2、Loader 和 Plugin 有哪些不同？请描述一下开发 Loader 和 Plugin 的思路

Loader：是模块的处理器，每个loader可以视作一节管道，多个loader可以结合使用。开发思路是对模块内容的输入做自定义的处理，在结尾输出一段可执行的JavaScript字符串。

Plugin： 插件主要用于在webpack打包的生命周期中添加自定义任务。开发思路是按照webpack的规范，编写含有`apply`方法的类或者Object对象，然后在Webpack提供的生命周期钩子中注册自定义的任务函数。

## 二、编程题

### 1、 使用Webpack实现Vue项目打包任务

> 具体任务及说明：
>
> 1. 先下载任务的基础代码  百度网盘链接: https://pan.baidu.com/s/1pJl4k5KgyhD2xo8FZIms8Q 提取码: zrdd
> 2. 这是一个使用 Vue CLI 创建出来的 Vue 项目基础结构
> 3. 有所不同的是这里我移除掉了 vue-cli-service（包含 webpack 等工具的黑盒工具）
> 4. 这里的要求就是直接使用 webpack 以及你所了解的周边工具、Loader、Plugin 还原这个项目的打包任务
> 5. 尽可能的使用上所有你了解到的功能和特性

主要思路是分析不同环境的不同打包需求，详细代码参考 `codes`目录的配置文件

#### 公共能力

1. 输入输出
   1. 入口文件
   2. 输出
      1. 路径
      2. 输出文件名
   
2. 代码编译
   1. Vue文件编译: `vue-loader`/`vue-template-compiler`, `VueLoaderPlugin`
   2. JavaScript新特性语法编译: `babel-loader`/`@babel/core`/`@babel/preset-env`
   3. Less语法编译: `less-loader`
   4. css代码处理: `css-loader` `style-loader`
   
3. 根据模板HTML文件生成页面: `html-webpack-plugin`

   1. 渲染模板变量

4. 代码风格检测

   1. 使用`standard`风格 `eslint-loader`/`eslint-plugin-standard`

5. 资源加载
   1. 处理静态资源文件（图片、字体），对小文件编码成Base64:`url-loader`/`file-loader`
   2. 对字体文件，直接用`file-loader`转运到输出目录
   3. 拷贝公共路径文件: `copy-webpack-plugin`

6. 配置合并: `webpack-merge-plugin`

7. 全局变量注入：`webpack.DefinePlugin`

8. 全局路径别名: `resolve/alias`

9. 公共模块拆分: `splitChunks: 'all'`, 这里以Vue-Router动态路由为例

   1. ```
      component: () => import(/* webpackChunkName: "routes" */('@/components/OtherPage.vue'))
      ```

10. Webpack配置类型提示: `/** @type {import('webpack').Configuration} */`

#### 开发环境

1. 模式指定为 `development`
2. 代码本地实时调试
   1. 启动本地服务器: `webpack-dev-server`
   2. 编译结果、错误输出在页面
   3. 样式、图片的HMR模块热替换: `webpack.HotModuleReplacementPlugin`， 未做js相关的热替换
3. 样式内联
   1. 样式写进html style: `style-loader`
4. 生成`cheap-module-eval-source-map`便于调试
5. 代码打包构建优化
   1. 输出文件名，带contenthash, 防止缓存

#### 生产环境

1. 模式指定为`production`

2. 生产环境下的优化配置

   1. Tree Shaking

      1. usedExports: true
      2. minimize: true

   2. Code Splitting
      1. 公共模块提取

      2. 特定模块的拆分 `splitChunks: 'all'`

      3. 路由懒加载 `vue-router + import + 魔法注释`

      4. 使用`cacheGroups`自定义项目chunk拆分逻辑（这里以引入elementUI为例）

         1. ```
            cacheGroups: {
                    libs: {
                      name: 'chunk-libs',
                      test: /[\\/]node_modules[\\/]/,
                      priority: 10,
                      chunks: 'initial'
                    },
                    elementUI: {
                      name: 'chunk-elementui',
                      test: /[\\/]node_modules[\\/]_?element-ui(.*)/,
                      priority: 20
                    },
                    commons: {
                      name: 'chunks-common',
                      test: path.join(__dirname, 'src/components'),
                      priority: 5,
                      reuseExistingChunk: true
                    }
                  }
            ```

   3. Name Hash: 通过webpack占位符, 对文件类型做归类，且加上8位`contenthash`

3. CSS文件
   1. 代码压缩
   2. 样式单独提取到CSS文件中 `MiniCssExtractPlugin`

4. JS文件

   1. 代码压缩

5. SourceMap保护源代码：`devtool: 'none'`

6. 打包目录自动清除: `clean-webpack-plugin`

最后放个打包结果：

![](img/bundle.jpg)