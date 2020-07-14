# Parcel

2017年发布，由于Webpack使用过于繁琐，真正意义的0配置的打包工具，对项目无侵入

## 特点

以HTML作为构建的入口

安装包`parcel-bundler`

## 开发

```
yarn parcel src/index.html
```

自动启dev server

模块热替换：```module.hot.accept()```

自动安装依赖

## 打包

```
yarn parcel build src/index.html
```

使用多线程打包，速度快

## 对比

绝大多数还是用Webpack

1. Webpack生态好
2. Webpack越来越好用