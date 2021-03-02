// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"utils.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hitTestRectangle = hitTestRectangle;
exports.textureRecources = textureRecources;
exports.genkwaFunc = genkwaFunc;
exports.defineProperty = exports.defineGetter = void 0;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

// 碰撞检测函数
function hitTestRectangle(r1, r2) {
  // 如果r2是坐标点
  if (Array.isArray(r2)) {
    r2.x = r2[0];
    r2.y = r2[1];
    r2.width = 0;
    r2.height = 0;
  } //Define the variables we'll need to calculate


  var hit; //hit will determine whether there's a collision

  hit = false; //Find the center points of each sprite

  r1.centerX = r1.x + r1.width / 2;
  r1.centerY = r1.y + r1.height / 2;
  r2.centerX = r2.x + r2.width / 2;
  r2.centerY = r2.y + r2.height / 2; //Find the half-widths and half-heights of each sprite

  r1.halfWidth = r1.width / 2;
  r1.halfHeight = r1.height / 2;
  r2.halfWidth = r2.width / 2;
  r2.halfHeight = r2.height / 2; //Calculate the distance vector between the sprites

  var vx = r1.centerX - r2.centerX;
  var vy = r1.centerY - r2.centerY; //Figure out the combined half-widths and half-heights

  var combinedHalfWidths = r1.halfWidth + r2.halfWidth;
  var combinedHalfHeights = r1.halfHeight + r2.halfHeight; //Check for a collision on the x axis

  if (Math.abs(vx) < combinedHalfWidths) {
    //A collision might be occuring. Check for a collision on the y axis
    if (Math.abs(vy) < combinedHalfHeights) {
      //There's definitely a collision happening
      hit = true;
    } else {
      //There's no collision on the y axis
      hit = false;
    }
  } else {
    //There's no collision on the x axis
    hit = false;
  } //`hit` will be either `true` or `false`


  return hit;
} // 加载纹理


var JsonLoadedMap = {};
window.PIXI.loader.pre(function (resource, next) {
  resource.crossOrigin = 'anonymous';
  resource.loadType = window.PIXI.loaders.Resource.LOAD_TYPE.XHR;
  next();
});

function textureRecources(resource) {
  function loadResource(resource) {
    var list;

    if (Array.isArray(resource)) {
      list = _toConsumableArray(resource);
      resource = list[0];
    }

    return new Promise(function (resolve, reject) {
      if (window.PIXI.utils.TextureCache[resource]) {
        resolve(window.PIXI.utils.TextureCache[resource]);
      } else {
        console.log(list || resource);
        window.PIXI.loader.add(list || resource).load(function () {
          var texture = window.PIXI.loader.resources[resource].texture;
          resolve(texture);
        });
      }
    });
  }

  if (/\.json$/.test(resource)) {
    if (JsonLoadedMap[resource]) {
      return loadResource(JsonLoadedMap[resource]);
    } else {
      return fetch(resource).then(function (res) {
        return res.json();
      }).then(function (res) {
        var prefix = resource.replace('index.json', '');
        var resoureList = res.map(function (item) {
          return prefix + item;
        });
        JsonLoadedMap[resource] = resoureList;
        return loadResource(resoureList);
      });
    }
  } else {
    return loadResource(resource);
  }
}

var Sk = window.Sk; // getter函数

var defineGetter = function defineGetter(func) {
  return Sk.misceval.callsimOrSuspend(Sk.builtins.property, new Sk.builtin.func(func), new Sk.builtin.func(function () {}));
}; // 生成kwargs函数


exports.defineGetter = defineGetter;

function genkwaFunc(func, isJsArgs) {
  var kwaFunc = function kwaFunc(kwa) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    if (!isJsArgs) {
      args = new Sk.builtins['tuple'](args);
      /*vararg*/
    }

    var kwargs = new Sk.builtin.dict(kwa);
    return func(args, kwargs);
  };

  kwaFunc['co_kwargs'] = true;
  return kwaFunc;
} // 监听属性getter/setter


var defineProperty = function defineProperty(obj, property) {
  return Sk.misceval.callsimOrSuspend(Sk.builtins.property, new Sk.builtin.func(function (self) {
    if (typeof obj === 'function') {
      return obj(self);
    } else {
      return Sk.ffi.remapToPy(self[obj][property]);
    }
  }), new Sk.builtin.func(function (self, val) {
    if (typeof property === 'function') {
      property(self, val);
    } else {
      self[obj][property] = val.v;
    }
  }));
};

exports.defineProperty = defineProperty;
},{}],"pygame-zero.js":[function(require,module,exports) {
"use strict";

var _utils = require("./utils");

function _templateObject() {
  var data = _taggedTemplateLiteral(["./assets/", ".mp3"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var Sk = window.Sk;
var PIXI = window.PIXI;
// 17中标准颜色名对应的色值
var ColorNameMap = {
  aqua: '#00FFFF',
  black: '#000000',
  blue: '#0000FF',
  fuchsia: '#FF00FF',
  gray: '#808080',
  green: '#008000',
  lime: '#00FF00',
  maroon: '#800000',
  navy: '#000080',
  olive: '#808000',
  orange: '#FFA500',
  purple: '#800080',
  red: '#FF0000',
  silver: '#C0C0C0',
  teal: '#008080',
  white: '#FFFFFF',
  yellow: '#FFFF00'
};

window.$builtinmodule = function () {
  var mod = {
    __name__: new Sk.builtin.str("pygame-zero")
  };
  var type = "WebGL";

  if (!PIXI.utils.isWebGLSupported()) {
    type = "canvas";
  } // PIXI.utils.sayHello(type)
  //Aliases


  var Application = PIXI.Application,
      loader = PIXI.loader,
      resources = PIXI.loader.resources,
      utils = PIXI.utils,
      Sprite = PIXI.Sprite,
      Graphics = PIXI.Graphics,
      Text = PIXI.Text,
      TextStyle = PIXI.TextStyle;

  if (window.PGZApp) {
    // document.getElementById('stage').removeChild(window.PGZApp.view);
    window.PGZApp.destroy({
      removeView: true
    });
    window.PGZApp = void 0;
  }

  window.PGZApp = new Application({
    backgroundColor: 0x000000,
    width: 500,
    height: 400
  });
  var app = window.PGZApp;
  var halfWidth = Math.round(app.view.width / 2);
  var halfHeight = Math.round(app.view.height / 2);

  function transX(x, isReserve) {
    // if (isReserve) {
    //   return x - halfWidth
    // } else {
    //   return x + halfWidth
    // }
    return x;
  }

  function transY(y, isReserve) {
    // if (isReserve) {
    //   if (y > halfHeight) {
    //     return (y - halfHeight) * -1;
    //   } else {
    //     return halfHeight - y;
    //   }
    // } else {
    //   if (y > 0) {
    //     return halfHeight - y;
    //   } else {
    //     return halfHeight + (y * -1);
    //   }
    // }
    return y;
  }

  function transPos(pos, isReserve) {
    if (!pos) {
      return pos;
    }

    return [transX(pos[0], isReserve), transY(pos[1], isReserve)];
  }

  function transColor(color) {
    if (Array.isArray(color)) {
      return utils.rgb2hex(color);
    } else {
      if (color.match('#')) {
        return utils.string2hex(color);
      } else {
        if (ColorNameMap[color]) {
          return utils.string2hex(ColorNameMap[color]);
        } else {
          return 0xffffff;
        }
      }
    }
  }

  window.PyGameZero.container.appendChild(app.view);
  mod.WIDTH = Sk.ffi.remapToPy(app.view.width);
  mod.HEIGHT = Sk.ffi.remapToPy(app.view.height); // 角色类

  mod.Actor = Sk.misceval.buildClass(mod, function ($gbl, $loc) {
    // $loc.__init__就是构造器
    $loc.__init__ = new Sk.builtin.func(function (self, actorName) {
      return new Sk.misceval.promiseToSuspension(new Promise(function (resolve) {
        actorName = Sk.ffi.remapToJs(actorName);
        (0, _utils.textureRecources)(actorName || "./assets/".concat(actorName.v, "/index.json")).then(function (texture) {
          var sprite = new Sprite(texture);
          sprite.zOrder = 1;
          self.sprite = sprite;
          self.sprite.anchor.set(0.5);
          self.sprite.x = transX(0);
          self.sprite.y = transY(0);
          self.actorName = actorName;
          app.stage.addChild(sprite);
          resolve();
        });
      }));
    });
    $loc.x = (0, _utils.defineProperty)(function (self) {
      return Sk.ffi.remapToPy(transX(self.sprite.x, true));
    }, function (self, val) {
      self.sprite.x = transX(val.v);
    });
    $loc.y = (0, _utils.defineProperty)(function (self) {
      return Sk.ffi.remapToPy(transY(self.sprite.y, true));
    }, function (self, val) {
      self.sprite.y = transY(val.v);
    });
    $loc.width = (0, _utils.defineProperty)('sprite', 'width');
    $loc.height = (0, _utils.defineProperty)('sprite', 'height');
    $loc.pos = (0, _utils.defineProperty)(function (self) {
      return Sk.ffi.remapToPy(transPos([self.sprite.x, self.sprite.y], true));
    }, function (self, val) {
      var pos = transPos(Sk.ffi.remapToJs(val));
      self.sprite.x = pos[0];
      self.sprite.y = pos[1];
      self['sprite']['pos'] = [pos[0], pos[1]];
    });
    $loc.angle = (0, _utils.defineProperty)('sprite', 'angle');
    $loc.show = (0, _utils.defineProperty)('sprite', 'visible');
    $loc.image = (0, _utils.defineProperty)(function (self) {
      return Sk.ffi.remapToPy(self['sprite']['texture']);
    }, function (self, val) {
      return new Sk.misceval.promiseToSuspension(new Promise(function (resolve) {
        (0, _utils.textureRecources)(val.v).then(function (texture) {
          self['sprite']['texture'] = texture;
          resolve();
        });
      }));
    });
    $loc.frame = (0, _utils.defineProperty)(function (self) {
      return Sk.ffi.remapToPy(self['sprite']['texture']);
    }, function (self, val) {
      return new Sk.misceval.promiseToSuspension(new Promise(function (resolve) {
        (0, _utils.textureRecources)(self.actorName[val.v - 1] || "./assets/".concat(self.actorName, "/\u9020\u578B").concat(val.v, ".png")).then(function (texture) {
          self['sprite']['texture'] = texture;
          resolve();
        });
      }));
    });
    $loc.distance_to = new Sk.builtin.func(function (self, pos) {
      pos = transPos(Sk.ffi.remapToJs(pos)); // 计算两点距离：|AB| = √((x1-x2)²+(y1-y2)²)

      return Sk.ffi.remapToPy(Math.round(Math.abs(Math.sqrt(Math.pow(self.sprite.x - pos[0], 2) + Math.pow(self.sprite.y - pos[1], 2)))));
    });
    $loc.angle_to = new Sk.builtin.func(function (self, pos) {
      pos = transPos(Sk.ffi.remapToJs(pos)); // 计算两点角度：arcsin(|y1-y2| ÷ √((x1-x2)²+(y1-y2)²)) ÷ π ×180

      var x1 = self.sprite.y;
      var x2 = pos[0];
      var y1 = self.sprite.y;
      var y2 = pos[1];
      var x = Math.abs(x1 - x2);
      var y = Math.abs(y1 - y2);
      var z = Math.sqrt(x * x + y * y);
      return Sk.ffi.remapToPy(Math.round(Math.asin(y / z) / Math.PI * 180));
    });
    $loc.collide_point = new Sk.builtin.func(function (self, pos) {
      return (0, _utils.hitTestRectangle)(self.sprite, transPos(Sk.ffi.remapToJs(pos)));
    });
    $loc.collide_actor = new Sk.builtin.func(function (self, actor) {
      return (0, _utils.hitTestRectangle)(self.sprite, actor.sprite);
    });
    $loc.remove = new Sk.builtin.func(function (self) {
      app.stage.removeChild(self.sprite);
    });
  }, 'Actor'); // 矩形类

  mod.Rect = Sk.misceval.buildClass(mod, function ($gbl, $loc) {
    // $loc.__init__就是构造器
    var _self;

    $loc.__init__ = new Sk.builtin.func(function (self, pos, size) {
      pos = transPos(Sk.ffi.remapToJs(pos));
      size = Sk.ffi.remapToJs(size);
      self.pos = {
        x: pos[0],
        y: pos[1]
      };
      self.size = {
        width: size[0],
        height: size[1]
      };
    });
    $loc.pos = (0, _utils.defineGetter)(function (self) {
      return Sk.ffi.remapToPy(transPos(self.pos, true));
    });
    $loc.size = (0, _utils.defineGetter)(function (self) {
      return Sk.ffi.remapToPy(self.size);
    });
  }, 'Rect', []); // 画笔类

  var graph = new Graphics();
  mod.draw = Sk.misceval.buildClass(mod, function ($gbl, $loc) {
    $loc.__init__ = new Sk.builtin.func(function (self) {
      self.size = 5;
    });
    $loc.size = new Sk.builtin.func(function (self, size) {
      self.size = size.v;
    });
    $loc.fill = new Sk.builtin.func(function (self, color) {
      color = transColor(Sk.ffi.remapToJs(color));
      graph.beginFill(color);
    });
    $loc.line = new Sk.builtin.func(function (self, start, end, color) {
      color = transColor(Sk.ffi.remapToJs(color));
      start = Sk.ffi.remapToJs(start);
      end = Sk.ffi.remapToJs(end);
      graph.lineStyle(self.size || 2, color, 1);
      graph.moveTo(start[0], start[1]);
      graph.lineTo(end[0], end[1]);
      app.stage.addChild(graph);
    });
    $loc.circle = new Sk.builtin.func(function (self, pos, radius, color) {
      color = transColor(Sk.ffi.remapToJs(color));
      pos = transPos(Sk.ffi.remapToJs(pos));
      graph.lineStyle(self.size, color, 1);
      graph.drawCircle(pos[0], pos[1], radius.v);
      app.stage.addChild(graph);
    });
    $loc.filled_circle = new Sk.builtin.func(function (self, pos, radius, color) {
      color = transColor(Sk.ffi.remapToJs(color));
      pos = transPos(Sk.ffi.remapToJs(pos));
      graph.lineStyle(0);
      graph.beginFill(color, 1);
      graph.drawCircle(pos[0], pos[1], radius.v);
      graph.endFill();
      app.stage.addChild(graph);
    });
    $loc.rect = new Sk.builtin.func(function (self) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      if (Sk.abstr.typeName(args[0]) === "Rect") {
        var rect = args[0],
            color = args[1];
        graph.lineStyle(self.size, transColor(Sk.ffi.remapToJs(color)), 1);
        graph.drawRect(rect.pos.x, rect.pos.y, rect.size.width, rect.size.height);
        app.stage.addChild(graph);
      } else {
        var left, top;
        var leftTop = Sk.ffi.remapToJs(args[0]);

        if (Array.isArray(leftTop)) {
          left = leftTop[0];
          top = leftTop[1];
          args.shift();
        } else {
          left = args[0].v;
          top = args[1].v;
          args.shift();
          args.shift();
        }

        var width = args[0],
            height = args[1],
            _color = args[2];
        width = Sk.ffi.remapToJs(width);
        height = Sk.ffi.remapToJs(height);
        graph.lineStyle(self.size, transColor(Sk.ffi.remapToJs(_color)), 1);
        graph.drawRect(transX(left), transY(top), width, height);
        app.stage.addChild(graph);
      }
    });
    $loc.filled_rect = new Sk.builtin.func(function (self) {
      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      if (Sk.abstr.typeName(args[0]) === "Rect") {
        var rect = args[0],
            color = args[1];
        graph.lineStyle(0);
        graph.beginFill(transColor(Sk.ffi.remapToJs(color)), 1);
        graph.drawRect(rect.pos.x, rect.pos.y, rect.size.width, rect.size.height);
        graph.endFill();
        app.stage.addChild(graph);
      } else {
        var left, top;
        var leftTop = Sk.ffi.remapToJs(args[0]);

        if (Array.isArray(leftTop)) {
          left = leftTop[0];
          top = leftTop[1];
          args.shift();
        } else {
          left = args[0].v;
          top = args[1].v;
          args.shift();
          args.shift();
        }

        var width = args[0],
            height = args[1],
            _color2 = args[2];
        width = Sk.ffi.remapToJs(width);
        height = Sk.ffi.remapToJs(height);
        _color2 = transColor(Sk.ffi.remapToJs(_color2));
        graph.lineStyle(0);
        graph.beginFill(_color2, 1);
        graph.drawRect(transX(left), transY(top), width, height);
        graph.endFill();
        app.stage.addChild(graph);
      }
    });
    $loc.clear = new Sk.builtin.func(function (self) {
      graph.clear();
      self.basicText && self.basicText.destroy();
    });
    $loc.text = new Sk.builtin.func((0, _utils.genkwaFunc)(function (args, kwa) {
      // args = Sk.ffi.remapToJs(args);
      kwa = Sk.ffi.remapToJs(kwa);

      var _args = _slicedToArray(args, 6),
          self = _args[0],
          str = _args[1],
          pos = _args[2],
          color = _args[3],
          fontsize = _args[4],
          fontname = _args[5];

      color = transColor(Sk.ffi.remapToJs(color || kwa.color));
      fontsize = Sk.ffi.remapToJs(fontsize || kwa.fontsize);
      fontname = Sk.ffi.remapToJs(fontname || kwa.fontname);
      pos = transPos(Sk.ffi.remapToJs(pos));
      var style = new PIXI.TextStyle({
        fontFamily: fontname || 'PingFang SC',
        fontSize: fontsize,
        fill: color
      });
      var basicText = new PIXI.Text(str.v, style);
      self.basicText = basicText;
      basicText.anchor.set(0.5);

      if (pos) {
        basicText.x = pos[0];
        basicText.y = pos[1];
      }

      app.stage.addChild(basicText);
    }, true));
  }, 'Draw', []); // 屏幕类

  mod.screen = Sk.misceval.callsimOrSuspend(Sk.misceval.buildClass(mod, function ($gbl, $loc) {
    $loc.draw = Sk.misceval.callsimOrSuspend(mod.draw);
    $loc.clear = new Sk.builtin.func(function (self) {
      app.destroy();
    });
    $loc.fill = new Sk.builtin.func(function (self, color) {
      app.renderer.backgroundColor = transColor(color.v);
    });
  }, 'Screen', [])); // 时间类

  mod.clock = Sk.misceval.callsimOrSuspend(Sk.misceval.buildClass(mod, function ($gbl, $loc) {
    $loc.__init__ = new Sk.builtin.func(function (self) {
      self.timerMap = new WeakMap();
    });
    $loc.schedule = new Sk.builtin.func(function (self, callback, delay) {
      self.timerMap.set(callback, setTimeout(function () {
        Sk.misceval.callsimAsync(null, callback);
      }, delay.v * 1000));
    });
    $loc.schedule_interval = new Sk.builtin.func(function (self, callback, delay) {
      self.timerMap.set(callback, setInterval(function () {
        Sk.misceval.callsimAsync(null, callback);
      }, delay.v * 1000));
    });
    $loc.schedule_unique = new Sk.builtin.func(function (self, callback, delay) {
      if (self.timerMap.has(callback)) {
        clearTimeout(self.timerMap.get(callback));
        clearInterval(self.timerMap.get(callback));
      }

      self.timerMap.set(callback, setTimeout(function () {
        Sk.misceval.callsimAsync(null, callback);
      }, delay.v * 1000));
    });
    $loc.unschedule = new Sk.builtin.func(function (self, callback, delay) {
      if (self.timerMap.has(callback)) {
        clearTimeout(self.timerMap.get(callback));
        clearInterval(self.timerMap.get(callback));
      }
    });
  }, 'Clock', [])); // 音乐类

  mod.music = Sk.misceval.callsimOrSuspend(Sk.misceval.buildClass(mod, function ($gbl, $loc) {
    $loc.__init__ = new Sk.builtin.func(function (self) {
      self.audio = new Audio();
    });
    $loc.play = new Sk.builtin.func(function (self, name) {
      self.audio.src = name.v || "./assets/".concat(name.v, ".mp3");
      self.audio.loop = true;
      self.audio.play();
    });
    $loc.play_once = new Sk.builtin.func(function (self, name) {
      self.audio.src = name.v || s(_templateObject(), name.v);
      self.audio.loop = false;
      self.audio.play();
    });
    $loc.is_playing = new Sk.builtin.func(function (self, name) {
      return !self.audio.paused;
    });
    $loc.volume = (0, _utils.defineProperty)(function (self) {
      return self.audio.volume;
    }, function (self, val) {
      self.audio.volume = val.v;
    });
    $loc.set_volume = new Sk.builtin.func(function (self, val) {
      self.audio.volume = val.v;
    });
    $loc.get_volume = new Sk.builtin.func(function (self) {
      return self.audio.volume;
    });
    $loc.stop = new Sk.builtin.func(function (self, name) {
      self.audio.currentTime = 0;
      self.audio.pause();
    });
  }, 'Music', [])); // 音效类

  mod.sound = Sk.misceval.callsimOrSuspend(Sk.misceval.buildClass(mod, function ($gbl, $loc) {
    $loc.__init__ = new Sk.builtin.func(function (self) {
      self.soundMap = {};
    });
    $loc.play = new Sk.builtin.func(function (self, name) {
      if (self.soundMap[name.v]) {
        self.soundMap[name.v].play();
        self.soundMap[name.v].currentTime = 0;
      } else {
        var audio = new Audio();
        audio.src = name.v;
        audio.loop = false;
        audio.play();
        self.soundMap[name.v] = audio;
      }
    });
    $loc.stop = new Sk.builtin.func(function (self, name) {
      self.soundMap[name.v].pause();
    });
  }, 'Sound', [])); // 动画类

  mod.animate = Sk.misceval.buildClass(mod, function ($gbl, $loc) {
    var charm;
    $loc.__init__ = new Sk.builtin.func((0, _utils.genkwaFunc)(function (args, kwa) {
      kwa = Sk.ffi.remapToJs(kwa);

      var _args2 = _slicedToArray(args, 6),
          self = _args2[0],
          actor = _args2[1],
          tween = _args2[2],
          duration = _args2[3],
          on_finished = _args2[4],
          targets = _args2[5];

      tween = tween || kwa.tween || 'linear';
      duration = duration || kwa.duration || 1;
      on_finished = on_finished || kwa.on_finished;
      var x = transX(kwa.x) || actor.sprite.x;
      var y = transY(kwa.y) || actor.sprite.y;
      var pos = transPos(targets) || transPos(kwa.pos) || [x, y];
      return new Sk.misceval.promiseToSuspension(new Promise(function (resolve) {
        loadScript('https://cdn.jsdelivr.net/gh/kittykatattack/charm/bin/Charm.js', 'Charm').then(function () {
          if (!charm) {
            charm = new Charm(PIXI);
            app.ticker.add(function () {
              charm.update();
            });
          }

          var tweenMap = {
            linear: 'linear',
            // 线性
            accelerate: 'acceleration',
            // 加速
            decelerate: 'deceleration',
            // 减速
            accel_decel: 'accelerationCubed',
            // 先加速再加速
            elastic_start: 'bounce 10 0',
            // 开始时反弹
            elastic_end: "bounce 0 -10",
            // 结束时反弹
            elastic_start_end: "bounce 10 -10",
            // 开始结束都反弹
            bounce_start: "bounce 10 0",
            // 开始时弹跳
            bounce_end: "bounce 0 10",
            // 结束时弹跳
            bounce_start_end: "bounce 10 -10" // 开始和结束都弹跳

          };
          self.ani = charm.slide(actor.sprite, pos[0] || x, pos[1] || y, duration * 60, tweenMap[tween]);

          self.ani.onComplete = function () {
            on_finished && Sk.misceval.callsim(on_finished);
          };

          resolve();
        });
      }));
    }, true));
    $loc.stop = new Sk.builtin.func(function (self) {
      self.ani.pause();
    });
    $loc.running = (0, _utils.defineGetter)(function (self) {
      return Sk.ffi.remapToPy(self.ani.tweens[0].playing);
    });
  }, 'Animate', []); // 主循环

  app.ticker.add(function (delta) {
    Sk.globals.update && Sk.misceval.callsimAsync(null, Sk.globals.update);
  });
  var keys = ["K_0", "K_1", "K_2", "K_3", "K_4", "K_5", "K_6", "K_7", "K_8", "K_9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "SHIFT", "CTRL", "ALT", "LEFT", "UP", "RIGHT", "DOWN", "PAGEUP", "PAGEDOWN", "END", "HOME", "ESCAPE", "ENTER", "SPACE", "RETURN", "BACKSPACE", "INSERT", "DELETE", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "F13", "F14", "F15"];
  var nativeKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'Shift', 'Ctrl', 'Alt', 'ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown', 'PageUp', 'PageDown', 'End', 'Home', 'Escape', 'Enter', '', 'Return', 'Backspace', 'Insert', 'Delete', "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "F13", "F14", "F15"];
  var keysMap = {};
  nativeKeys.map(function (nativeKeys, index) {
    keysMap[nativeKeys] = keys[index];
  });
  var keyboard = {}; // 键盘按下事件

  window.addEventListener('keydown', function (e) {
    keyboard[keysMap[e.key]] = true;
    Sk.globals.on_key_down && Sk.misceval.callsimAsync(null, Sk.globals.on_key_down, Sk.ffi.remapToPy(keysMap[e.key]));
  });
  window.addEventListener('keyup', function (e) {
    keyboard[keysMap[e.key]] = false;
    Sk.globals.on_key_down && Sk.misceval.callsimAsync(null, Sk.globals.on_key_down, Sk.ffi.remapToPy(keysMap[e.key]));
  }); // 键盘名称

  mod.Keys = Sk.misceval.callsimOrSuspend(Sk.misceval.buildClass(mod, function ($gbl, $loc) {
    keys.map(function (key) {
      $loc[key] = (0, _utils.defineGetter)(function () {
        return Sk.ffi.remapToPy(key);
      });
    });
  }, 'Keys', [])); // 键盘按下

  mod.keyboard = Sk.misceval.callsimOrSuspend(Sk.misceval.buildClass(mod, function ($gbl, $loc) {
    keys.map(function (key, i) {
      $loc[key.toLowerCase()] = (0, _utils.defineGetter)(function () {
        return keyboard[key] || false;
      });
    });
  }, 'keyboard', []));
  var mouseDownMap = {
    '0': 'LEFT',
    '1': 'MIDDLE',
    '2': 'RIGHT'
  };
  var mousePos = {};
  var mouse = {}; // 鼠标按下事件

  app.view.addEventListener('mousedown', function (e) {
    mouse[mouseDownMap[e.button]] = true;
    Sk.globals.on_mouse_down && Sk.misceval.callsimAsync(null, Sk.globals.on_mouse_down, Sk.ffi.remapToPy([transX(e.offsetX, true), transY(e.offsetY, true)]), Sk.ffi.remapToPy(mouseDownMap[e.button]));
  }); // 鼠标抬起事件

  app.view.addEventListener('mouseup', function (e) {
    mouse[mouseDownMap[e.button]] = false;
    Sk.globals.on_mouse_up && Sk.misceval.callsimAsync(null, Sk.globals.on_mouse_up, Sk.ffi.remapToPy([transX(e.offsetX, true), transY(e.offsetY, true)]), Sk.ffi.remapToPy(mouseDownMap[e.button]));
  }); // 禁用鼠标右键

  document.oncontextmenu = function () {
    return false;
  }; // 鼠标移动事件


  app.view.addEventListener('mousemove', function (e) {
    mousePos = {
      x: transX(e.offsetX, true),
      y: transY(e.offsetY, true)
    };
    Sk.globals.on_mouse_move && Sk.misceval.callsimAsync(null, Sk.globals.on_mouse_move, Sk.ffi.remapToPy([mousePos.x, mousePos.y])), Sk.ffi.remapToPy(mouseDownMap[e.button]);
  }); // 鼠标滚轮事件

  app.view.addEventListener('wheel', function (e) {
    if (e.deltaY > 0) {
      mouse['WHEEL_DOWN'] = true;
      mouse['WHEEL_UP'] = false;
    } else if (e.deltaY < 0) {
      mouse['WHEEL_UP'] = true;
      mouse['WHEEL_DOWN'] = false;
    } else {
      mouse['WHEEL_UP'] = false;
      mouse['WHEEL_DOWN'] = false;
    }
  }); // 鼠标位置

  mod.mouse = Sk.misceval.callsimOrSuspend(Sk.misceval.buildClass(mod, function ($gbl, $loc) {
    $loc.x = (0, _utils.defineGetter)(function () {
      return mousePos.x;
    });
    $loc.y = (0, _utils.defineGetter)(function () {
      return mousePos.y;
    });
    $loc.pos = (0, _utils.defineGetter)(function () {
      return Sk.ffi.remapToPy([mousePos.x, mousePos.y]);
    });
    $loc.LEFT = (0, _utils.defineGetter)(function () {
      return mouse.LEFT || false;
    });
    $loc.MIDDLE = (0, _utils.defineGetter)(function () {
      return mouse.MIDDLE || false;
    });
    $loc.RIGHT = (0, _utils.defineGetter)(function () {
      return mouse.RIGHT || false;
    });
    $loc.WHEEL_UP = (0, _utils.defineGetter)(function () {
      return mouse.WHEEL_UP || false;
    });
    $loc.WHEEL_DOWN = (0, _utils.defineGetter)(function () {
      return mouse.WHEEL_DOWN || false;
    });
  }, 'Mouse', []));
  return mod;
};
},{"./utils":"utils.js"}],"../../../../../.config/yarn/global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "49619" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../../.config/yarn/global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","pygame-zero.js"], null)
//# sourceMappingURL=/pygame-zero.js.map