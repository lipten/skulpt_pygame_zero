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



## Building

1.  `git clone git@github.com:lipten/skulpt-pygame-zero.git`
2. Install the required `parcel` using `npm i -g parcel`
3. Execute the following commands in the project directory:

```bash
parcel build src/main.js --experimental-scope-hoisting
parcel build src/pygame-zero.js
```

