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

   

2. 在skulpt的`read`钩子函数中填入以下注释语句中的代码，用于解析python代码有import的时候拦截加载pygamezero的完整的库

```javascript
function builtinRead(file) {
  console.log("Attempting file: " + Sk.ffi.remapToJs(file));

  // insert code start =========================================
  if (window.PyGameZero.matchModelName(file)) {
    return window.PyGameZero.load(file)
  }
  // insert code end ===========================================
  
  if (Sk.builtinFiles === undefined || Sk.builtinFiles.files[file] === undefined) {
    throw "File not found: '" + file + "'";
  }
  
  return Sk.builtinFiles.files[file];
}

Sk.configure({
  .... other settings
  read: builtinRead,
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
