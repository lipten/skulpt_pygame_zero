English | [简体中文](./README-zh_CN.md)
# pygame-zero module for skulpt
## Introduction

This module provides most of the functions of pygame-zero for skulpt, and can use pygame-zero to write some simple 2d games in the web environment and run based on PIXI.js

## Installation

Use npm:

```
npm install skulpt-pygame-zero
```

Use cdn:

```
https://cdn.jsdelivr.net/gh/lipten/skulpt-pygame-zero@master/dist/main.js
```

## Usege

1. Import module

   ```javascript
   // webpack
   import 'skulpt-pygame-zero'
   
   // cdn
   <script src="https://cdn.jsdelivr.net/gh/lipten/skulpt-pygame-zero@master/dist/main.js"></script>
   ```

   

2. Modify the `read` hook function of skulpt

   ```javascript
   function builtinRead(file) {
     console.log("Attempting file: " + Sk.ffi.remapToJs(file));
   
     // Insert this code
     if (window.PyGameZero.matchModelName(file)) {
       return window.PyGameZero.load(file)
     }
     
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

3. Designated container

   ```javascript
   PyGameZero.setContainer(document.getElementById('stage'))
   ```
---

Copy the code of [test/simple.py](https://github.com/lipten/skulpt-pygame-zero/blob/master/test/simple.py) for testing

### What is the difference between skulpt-pygame-zero and pygame-zero

1. Image resources can only be loaded via links

   ```
   Actor('https://static.lipten.link/blogs/pig1.png')
   ```

2. You can also pass in multiple pictures

   ```
   pig = Actor(('https://static.lipten.link/blogs/pig1.png','https://static.lipten.link/blogs/pig2.png'))
   
   # then ute frame=2 to switch the second photo
   pig.frame = 2
   ```

### Below is the unimplemented pygame-zero api

* images
* music.fadeout
* music.queue
* Actor keyword argument: pos, topleft, topright, bottomleft, bottomright, midtop, midleft, midright, midbottom or center
* Anchor point
* Tone Generator

## Building

1.  `git clone git@github.com:lipten/skulpt-pygame-zero.git`
2. Install the required `parcel` using `npm i -g parcel`
3. Execute the following commands in the project directory:

```bash
parcel build src/main.js --experimental-scope-hoisting
parcel build src/pygame-zero.js
```