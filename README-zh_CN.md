[English](./README.md) | 简体中文

# 基于skulpt的第三方模块: skulpt_pygame_zero

## 简介

这是一个基于skulpt实现在浏览器运行pygame-zero的模块，为skulpt拓展2d游戏的能力，底层运行基于PIXI.js实现。

## 安装

npm 引入:

```
npm install skulpt-pygame-zero
```

或者使用 cdn 引入:

```
https://cdn.jsdelivr.net/gh/lipten/skulpt-pygame-zero@master/dist/main.js
```

## 快速上手

1. 导入模块

```javascript
// webpack
import 'skulpt-pygame-zero'

// cdn
<script src="https://cdn.jsdelivr.net/gh/lipten/skulpt-pygame-zero@master/dist/main.js"></script>
```

2. 使用 `PyGameZero.usePyGameZero` 包裹skulpt的read钩子函数

```javascript
Sk.configure({
  .... other settings
  // before
  read: builtinRead,
  // after 
  read: PyGameZero.usePyGameZero(builtinRead),
  __future__: Sk.python3,
});
```

3. 传入渲染容器
html
```html
<div id="stage"></div>
```
​	 javascript
```javascript
PyGameZero.setContainer(document.getElementById('stage'))
```
4. 最好在运行skulpt之前执行一次`PyGameZero.reset()`

   ```javascript
   // insert before running
   PyGameZero.reset();
   // running skulpt
   Sk.misceval.asyncToPromise(function() {
   	return Sk.importMainWithBody("<stdin>", false, pythonCode, true);
   });
   ```

复制项目中的 [test/simple.py](https://github.com/lipten/skulpt-pygame-zero/blob/master/test/simple.py) 代码可用于测试

----


### skulpt_pygame_zero与pythen的pygame-zero有哪些区别：

1. 加载图片只能用外链资源

   ```python
   Actor('https://static.lipten.link/blogs/pig1.png')
   ```

2. 创建角色可以传入多个图片资源，然后通过frame属性控制使用第几张

   ```python
   pig = Actor(('https://static.lipten.link/blogs/pig1.png','https://static.lipten.link/blogs/pig2.png'))
   
   # then ute frame=2 to switch the second photo
   pig.frame = 2
   ```

### 以下是未实现的Pygame-zero的api

* images
* music.fadeout
* music.queue
* Actor keyword argument: pos, topleft, topright, bottomleft, bottomright, midtop, midleft, midright, midbottom or center （Actor构造器不支持一些关键参数）
* Anchor point （角色锚点）
* Tone Generator （音调生成器）
* WIDTH、HEIGHT （变量为只读，值为html容器的宽高）
