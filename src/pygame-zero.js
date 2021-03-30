const Sk = window.Sk;
const PIXI = window.PIXI;
import {loadScript, textureRecources, defineGetter, defineProperty, hitTestRectangle, genkwaFunc, upgradeGraphics} from './utils'
import { PixiMatter, PhysicsSprite, PhysicsGraphics } from './matter-pixi';
const pixiMatter = new PixiMatter();

// 17中标准颜色名对应的色值
const ColorNameMap = {
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
  yellow: '#FFFF00',
}

window.$builtinmodule = function() {
  const mod = { __name__: new Sk.builtin.str("pygame-zero") };
  let type = "WebGL"
  if(!PIXI.utils.isWebGLSupported()){
    type = "canvas"
  }

  // PIXI.utils.sayHello(type)
  //Aliases
  const Application = PIXI.Application,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    utils = PIXI.utils,
    Sprite = PIXI.Sprite,
    Graphics = PIXI.Graphics,
    Text = PIXI.Text,
    TextStyle = PIXI.TextStyle;
  window.PIXI.loader.pre((resource, next) => {
    resource.crossOrigin = 'anonymous';
    resource.loadType = window.PIXI.loaders.Resource.LOAD_TYPE.XHR;
    next();
  });
  if (window.PGZApp) {
    // document.getElementById('stage').removeChild(window.PGZApp.view);
    window.PGZApp.destroy({
      removeView: true
    });
    loader.destroy();
    window.PGZApp = void 0;
  }
  let width = 500;
  let height = 400;
  if (window.PyGameZero.container) {
    width = window.PyGameZero.container.offsetWidth;
    height = window.PyGameZero.container.offsetHeight;
  }
  window.PGZApp = new Application({
    backgroundColor: 0x000000,
    width,
    height,
  });
  const app = window.PGZApp;
  window.PyGameZero.container.appendChild(app.view);
 
  const halfWidth = Math.round(app.view.width/2);
  const halfHeight = Math.round(app.view.height/2);
  // 笛卡尔坐标系转换
  function transX(x, isReserve) {
    // if (isReserve) {
    //   return x - halfWidth
    // } else {
    //   return x + halfWidth
    // }
    return x;
  }
  // 笛卡尔坐标系转换
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
  function transPos(pos, isReserve){
    if (!pos) {
      return pos
    }
    return [transX(pos[0], isReserve), transY(pos[1], isReserve)]
  }
  // 字符串色值转十六进制数字
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
  
  mod.WIDTH = defineGetter(() => Sk.ffi.remapToPy(app.view.width));
  mod.HEIGHT = defineGetter(() => Sk.ffi.remapToPy(app.view.height));

  // 角色类
  mod.Actor = Sk.misceval.buildClass(mod, function($gbl, $loc) {
    // $loc.__init__就是构造器
    $loc.__init__ = new Sk.builtin.func(function(self, actorName, pos) {
      return new Sk.misceval.promiseToSuspension(new Promise(function(resolve) {
        actorName = Sk.ffi.remapToJs(actorName);
        pos = Sk.ffi.remapToJs(pos) || [];
        textureRecources(actorName || `./assets/${actorName.v}/index.json`).then(function(texture) {
          const sprite = new Sprite(texture)
          sprite.zOrder=1
          self.sprite = sprite;
          self.sprite.anchor.set(0.5);
          self.sprite.x = transX(pos[0] || 0)
          self.sprite.y = transY(pos[1] || 0)
          self.actorName = actorName;
          resolve()
        })
      }));
    });
    $loc.x = defineProperty(function(self){
      return Sk.ffi.remapToPy(transX(self.sprite.x, true))
    }, function(self, val){
      if (self.physicSprite) {
        Matter.Body.setPosition(self.physicSprite._body, {x: transX(val.v), y: self.physicSprite.y})
      } else {
        self.sprite.x = transX(val.v)
      }
    })
    $loc.y = defineProperty(function(self){
      return Sk.ffi.remapToPy(transY(self.sprite.y, true))
    }, function(self, val){
      if (self.physicSprite) {
        Matter.Body.setPosition(self.physicSprite._body, {x: self.physicSprite.x, y: transX(val.v)})
      } else {
        self.sprite.y = transX(val.v)
      }
    })
    $loc.width = defineProperty('sprite', 'width')
    $loc.height = defineProperty('sprite', 'height')
    $loc.size = defineProperty(function(self) {
      return Sk.ffi.remapToPy([self.sprite.width, self.sprite.height])
    }, function (self, val) {
      const pos = Sk.ffi.remapToJs(val)
      const [width, height] = pos;
      self.sprite.width = width;
      self.sprite.height = height;
      self['sprite']['pos'] = [width, height];
    })
    $loc.pos = defineProperty(function(self) {
      return Sk.ffi.remapToPy(transPos([self.sprite.x, self.sprite.y], true))
    }, function (self, val) {
      const pos = transPos(Sk.ffi.remapToJs(val))
      const [x, y] = pos;
      if (self.physicSprite) {
        Matter.Body.setPosition(self.physicSprite._body, {x: x, y: y})
      } else {
        self.sprite.x = x;
        self.sprite.y = y;
        self['sprite']['pos'] = [x, y];
      }
    })
    $loc.angle = defineProperty('sprite', 'angle')
    $loc.show  = defineProperty('sprite', 'visible')
    $loc.image = defineProperty(function(self) {
      return Sk.ffi.remapToPy(self['sprite']['texture'])
    }, function (self, val) {
      return new Sk.misceval.promiseToSuspension(new Promise(function(resolve) {
        textureRecources(val.v).then(function(texture) {
          self['sprite']['texture'] = texture;
          resolve()
        })
      }))
    })
    $loc.frame = defineProperty(function(self) {
      return Sk.ffi.remapToPy(self['sprite']['texture'])
      }, function (self, val) {
      return new Sk.misceval.promiseToSuspension(new Promise(function(resolve) {
        textureRecources(self.actorName[val.v-1] || `./assets/${self.actorName}/造型${val.v}.png`).then(function(texture) {
          self['sprite']['texture'] = texture;
          resolve()
        })
      }))
    })
    $loc.distance_to = new Sk.builtin.func(function(self, pos) {
      pos = transPos(Sk.ffi.remapToJs(pos));
      // 计算两点距离：|AB| = √((x1-x2)²+(y1-y2)²)
      return Sk.ffi.remapToPy(Math.round(Math.abs(Math.sqrt(Math.pow(self.sprite.x - pos[0], 2) + Math.pow(self.sprite.y - pos[1], 2)))))
    })
    $loc.angle_to = new Sk.builtin.func(function(self, pos) {
      pos = transPos(Sk.ffi.remapToJs(pos));
      // 计算两点角度：arcsin(|y1-y2| ÷ √((x1-x2)²+(y1-y2)²)) ÷ π ×180
      const x1 = self.sprite.y;
      const x2 = pos[0];
      const y1 = self.sprite.y;
      const y2 = pos[1];
      const x = Math.abs(x1-x2);
      const y = Math.abs(y1-y2);
      const z = Math.sqrt(x*x+y*y);
      return Sk.ffi.remapToPy(Math.round(Math.asin(y/z)/Math.PI*180))
    })
    $loc.collide_point = new Sk.builtin.func(function(self, pos) {
      return hitTestRectangle(self.sprite, transPos(Sk.ffi.remapToJs(pos)))
    })
    $loc.collide_actor = new Sk.builtin.func(function(self, actor) {
      return hitTestRectangle(self.sprite, actor.sprite)
    })
    $loc.colliderect = new Sk.builtin.func(function(self, actor) {
      return hitTestRectangle(self.sprite, actor.sprite)
    })
    $loc.remove = new Sk.builtin.func(function(self) {
      app.stage.removeChild(self.sprite);
    })
    $loc.draw = new Sk.builtin.func(function(self) {
      app.stage.addChild(self.physicSprite || self.sprite);
    })
    // 物理引擎
    $loc.physicsImpostor = new Sk.builtin.func(genkwaFunc(function(args, kwa) {
      // args = Sk.ffi.remapToJs(args);
      kwa = Sk.ffi.remapToJs(kwa);
      let [self, is_circle, is_static] = args;
      is_circle = Sk.ffi.remapToJs(is_circle || kwa.is_circle) || false;
      is_static = Sk.ffi.remapToJs(is_static || kwa.is_static) || false;
      const {x, y, width, height, texture} = self.sprite
      self.physicSprite = new PhysicsSprite(texture, {
        x: x,
        y: y,
        width: width,
        height: height,
        isCircle: is_circle,
        isStatic: is_static,
      })
      // const ground = new PhysicsGraphics({ x: 0, y: 300, width: 500, height: 50, fill: 0xff0000 }, { isStatic: true,angle: Math.PI * 0.06 });
      // app.stage.addChild(ground);
      pixiMatter.addToWorld(self.physicSprite);
    }, true))
  }, 'Actor')
  // 矩形类
  mod.Rect = Sk.misceval.buildClass(mod, function($gbl, $loc) {
    // $loc.__init__就是构造器
    let _self;
    $loc.__init__ = new Sk.builtin.func(function(self, pos, size) {
      pos = transPos(Sk.ffi.remapToJs(pos));
      size = Sk.ffi.remapToJs(size);
      self.pos = {
        x: pos[0],
        y: pos[1],
      }
      self.size = {
        width: size[0],
        height: size[1],
      }
    });
    $loc.pos = defineGetter((self) => Sk.ffi.remapToPy(transPos(self.pos, true)))
    $loc.size = defineGetter((self) => Sk.ffi.remapToPy(self.size))
  }, 'Rect', [])
  // 画笔类
  mod.draw = Sk.misceval.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = new Sk.builtin.func(function(self) {
      self.size = 5;
      self.graphMap = [];
    })
    $loc.size = new Sk.builtin.func(function(self, size) {
      self.size = size.v;
    })
    // $loc.fill = new Sk.builtin.func(function(self, color) {
    //   color = transColor(Sk.ffi.remapToJs(color));
    //   graph.beginFill(color)
    // })
    $loc.line =  new Sk.builtin.func(function(self, start, end, color) {
      color = transColor(Sk.ffi.remapToJs(color));
      start = Sk.ffi.remapToJs(start);
      end = Sk.ffi.remapToJs(end);
      graph.lineStyle(self.size || 2, color, 1);
      graph.moveTo(start[0], start[1]);
      graph.lineTo(end[0], end[1]);
      app.stage.addChild(graph);
    })
    $loc.circle =  upgradeGraphics(mod, app, pixiMatter, (self, graph, pos, radius, color) => {
      color = transColor(Sk.ffi.remapToJs(color));
      pos = transPos(Sk.ffi.remapToJs(pos));
      graph.lineStyle(self.size, color, 1);
      graph.drawCircle(pos[0], pos[1], radius.v);
      graph.isCircle = true
      
      app.stage.addChild(graph);
    })
    $loc.filled_circle =  upgradeGraphics(mod, app, pixiMatter, (self, graph, pos, radius, color) => {
      color = transColor(Sk.ffi.remapToJs(color));
      pos = transPos(Sk.ffi.remapToJs(pos));
      graph.lineStyle(0);
      graph.beginFill(color, 1);
      graph.drawCircle(pos[0], pos[1], radius.v);
      graph.endFill();
      graph.isCircle = true
      graph.isFilled = true
      app.stage.addChild(graph);
    })
    $loc.rect =  upgradeGraphics(mod, app, pixiMatter, (self, graph, ...args) => {
      if (Sk.abstr.typeName(args[0]) === "Rect") {
        const [rect, color] = args;
        graph.lineStyle(self.size, transColor(Sk.ffi.remapToJs(color)), 1);
        graph.drawRect(rect.pos.x, rect.pos.y, rect.size.width, rect.size.height);
      } else {
        let left, top
        const leftTop = Sk.ffi.remapToJs(args[0])
        if (Array.isArray(leftTop)) {
          left = leftTop[0]
          top = leftTop[1]
          args.shift();
        } else {
          left = args[0].v
          top = args[1].v
          args.shift();
          args.shift();
        }
        let [width, height, color] = args;
        width = Sk.ffi.remapToJs(width)
        height = Sk.ffi.remapToJs(height)
        graph.lineStyle(self.size, transColor(Sk.ffi.remapToJs(color)), 1);
        graph.drawRect(transX(left), transY(top), width, height);
        // setTimeout(() => {
        //   graph.x = 200
        // }, 2000)
        app.stage.addChild(graph);
      }
    })
    $loc.filled_rect =  upgradeGraphics(mod, app, pixiMatter, (self, graph, ...args) => {
      if (Sk.abstr.typeName(args[0]) === "Rect") {
        const [rect, color] = args;
        graph.lineStyle(0);
        graph.beginFill(transColor(Sk.ffi.remapToJs(color)), 1);
        graph.drawRect(rect.pos.x, rect.pos.y, rect.size.width, rect.size.height);
        graph.endFill();
      } else {
        let left, top
        const leftTop = Sk.ffi.remapToJs(args[0])
        if (Array.isArray(leftTop)) {
          left = leftTop[0]
          top = leftTop[1]
          args.shift();
        } else {
          left = args[0].v
          top = args[1].v
          args.shift();
          args.shift();
        }
        let [width, height, color] = args;
        width = Sk.ffi.remapToJs(width)
        height = Sk.ffi.remapToJs(height)
        color = transColor(Sk.ffi.remapToJs(color))
        graph.lineStyle(0);
        graph.beginFill(color, 1);
        graph.drawRect(transX(left), transY(top), width, height);
        graph.endFill();
      }
      graph.isFilled = true
      app.stage.addChild(graph);
    })
    $loc.clear = new Sk.builtin.func(function(self) {
      self.graphMap.map((graph) => graph.clear())
      self.graphMap.length = 0
      self.basicText && self.basicText.destroy()
    })
    $loc.text = new Sk.builtin.func(genkwaFunc(function(args, kwa) {
      // args = Sk.ffi.remapToJs(args);
      kwa = Sk.ffi.remapToJs(kwa);
      let [self, str, pos, color, fontsize, fontname] = args;
      color = transColor(Sk.ffi.remapToJs(color || kwa.color));
      fontsize = Sk.ffi.remapToJs(fontsize || kwa.fontsize);
      fontname = Sk.ffi.remapToJs(fontname || kwa.fontname)
      pos = transPos(Sk.ffi.remapToJs(pos))
      const style = new PIXI.TextStyle({
        fontFamily: fontname || 'PingFang SC',
        fontSize: fontsize,
        fill: color,
      });
      const basicText = new PIXI.Text(str.v, style);
      self.basicText = basicText
      basicText.anchor.set(0.5);
      if (pos) {
        basicText.x = pos[0];
        basicText.y = pos[1];
      }
      app.stage.addChild(basicText);
    }, true))
  }, 'Draw', []);
  // 屏幕类
  
  mod.screen = Sk.misceval.callsimOrSuspend(Sk.misceval.buildClass(mod, function($gbl, $loc) {
    $loc.draw = Sk.misceval.callsimOrSuspend(mod.draw)
    $loc.clear = new Sk.builtin.func(function(self) {
      // app.destroy();
      while(app.stage.children.length > 0){   var child = app.stage.getChildAt(0);  app.stage.removeChild(child);}
    })
    $loc.fill = new Sk.builtin.func(function(self, color) {
      graph.clear()
      graph.beginFill(transColor(Sk.ffi.remapToJs(color)), 1);
      graph.drawRect(0, 0, app.view.width, app.view.height);
      graph.endFill();
      app.stage.addChild(graph);
    })
  }, 'Screen', []));
  // 时间类
  mod.clock = Sk.misceval.callsimOrSuspend(Sk.misceval.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = new Sk.builtin.func(function(self) {
      self.timerMap = new WeakMap();
    })
    $loc.schedule = new Sk.builtin.func(function(self, callback, delay) {
      self.timerMap.set(callback, setTimeout(function() {
        Sk.misceval.callsimAsync(null, callback)
      }, delay.v * 1000))
    })
    $loc.schedule_interval = new Sk.builtin.func(function(self, callback, delay) {
      self.timerMap.set(callback, setInterval(function() {
        Sk.misceval.callsimAsync(null, callback)
      }, delay.v * 1000))
    })
    $loc.schedule_unique = new Sk.builtin.func(function(self, callback, delay) {
      if (self.timerMap.has(callback)) {
        clearTimeout(self.timerMap.get(callback))
        clearInterval(self.timerMap.get(callback))
      }
      self.timerMap.set(callback, setTimeout(function() {
        Sk.misceval.callsimAsync(null, callback)
      }, delay.v * 1000))
    })
    $loc.unschedule = new Sk.builtin.func(function(self, callback, delay) {
      if (self.timerMap.has(callback)) {
        clearTimeout(self.timerMap.get(callback))
        clearInterval(self.timerMap.get(callback))
      }
    })

  }, 'Clock', []));

  // 音乐类
  mod.music = Sk.misceval.callsimOrSuspend(Sk.misceval.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = new Sk.builtin.func(function(self) {
      self.audio = new Audio()
    })
    $loc.play = new Sk.builtin.func(function(self, name) {
      self.audio.src = name.v || `./assets/${name.v}.mp3`;
      self.audio.loop = true;
      self.audio.play();
    })
    $loc.play_once = new Sk.builtin.func(function(self, name) {
      self.audio.src = name.v || s`./assets/${name.v}.mp3`;
      self.audio.loop = false;
      self.audio.play();
    })
    $loc.is_playing = new Sk.builtin.func(function(self, name) {
      return !self.audio.paused
    })
    $loc.volume = defineProperty(function(self) {
      return self.audio.volume;
    }, function(self, val){
      self.audio.volume = val.v
    })
    $loc.set_volume = new Sk.builtin.func(function(self, val){
      self.audio.volume = val.v
    })
    $loc.get_volume = new Sk.builtin.func(function(self) {
      return self.audio.volume;
    })
    $loc.stop = new Sk.builtin.func(function(self, name) {
      self.audio.currentTime = 0
      self.audio.pause();
    })
  }, 'Music', []));

  // 音效类
  mod.sound = Sk.misceval.callsimOrSuspend(Sk.misceval.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = new Sk.builtin.func(function(self) {
      self.soundMap = {};
    })
    $loc.play = new Sk.builtin.func(function(self, name) {
      if(self.soundMap[name.v]) {
        self.soundMap[name.v].play()
        self.soundMap[name.v].currentTime = 0
      } else {
        const audio = new Audio()
        audio.src = name.v;
        audio.loop = false;
        audio.play();
        self.soundMap[name.v] = audio
      }
    })
    $loc.stop = new Sk.builtin.func(function(self, name) {
      self.soundMap[name.v].pause();
    })
  }, 'Sound', []));

  // 动画类
  mod.animate = Sk.misceval.buildClass(mod, function($gbl, $loc) {
    let charm;
    $loc.__init__ =  new Sk.builtin.func(genkwaFunc(function(args, kwa) {
      kwa = Sk.ffi.remapToJs(kwa);
      let [self, actor, tween, duration, on_finished, targets] = args;
      tween = tween || kwa.tween || 'linear';
      duration = duration || kwa.duration || 1;
      on_finished = on_finished || kwa.on_finished
      const x = transX(kwa.x) || actor.sprite.x;
      const y = transY(kwa.y) || actor.sprite.y;
      const pos = transPos(targets) || transPos(kwa.pos) || [x, y];
      return new Sk.misceval.promiseToSuspension(new Promise(function(resolve) {
        loadScript('https://cdnjs.cloudflare.com/ajax/libs/tween.js/17.1.1/Tween.min.js', 'Charm').then(() => {
          if (!charm) {
            // charm = new TWEEN(PIXI);
            app.ticker.add(() => {
              // charm.update()
              TWEEN.update();
            })
          }
          const tweenMap = {
            linear: TWEEN.Easing.linear, // 线性
            accelerate: TWEEN.Easing.Quartic.Out, // 加速
            decelerate: TWEEN.Easing.Quartic.In, // 减速
            accel_decel: TWEEN.Easing.Quartic.InOut, // 先加速再加速
            elastic_start: TWEEN.Easing.Elastic.In, // 开始时反弹
            elastic_end: TWEEN.Easing.Elastic.Out, // 结束时反弹
            elastic_start_end: TWEEN.Easing.Elastic.InOut, // 开始结束都反弹
            bounce_start: TWEEN.Easing.Bounce.In, // 开始时弹跳
            bounce_end: TWEEN.Easing.Bounce.Out, // 结束时弹跳
            bounce_start_end: TWEEN.Easing.Bounce.InOut, // 开始和结束都弹跳
          }
          self.ani = new TWEEN.Tween({
            x: actor.sprite.x,
            y: actor.sprite.y,
          }).to({
            x: pos[0] || x,
            y: pos[1] || y,
          }, duration * 1000).easing(tweenMap[tween])
          .onUpdate(function (object) {
            actor.sprite.y = object.y;
            actor.sprite.x = object.x;
          }).start();
          self.ani.onComplete = function() {
            on_finished && Sk.misceval.callsim(on_finished)
          }
          // self.ani = charm.slide(actor.sprite, pos[0] || x, pos[1] || y, duration * 60, tweenMap[tween])
          // self.ani.onComplete = function() {
          //   on_finished && Sk.misceval.callsim(on_finished)
          // }
          resolve();
        })
    }));
    }, true))
    $loc.stop = new Sk.builtin.func(function(self) {
      self.ani.pause();
    })
    $loc.running = defineGetter(function(self) {
      return Sk.ffi.remapToPy(self.ani.tweens[0].playing);
    })
  }, 'Animate', [])

  // 主循环
  app.ticker.add((delta) => {
    Sk.globals.draw && Sk.misceval.callsimAsync(null, Sk.globals.draw);
    Sk.globals.update && Sk.misceval.callsimAsync(null, Sk.globals.update);
    pixiMatter.update()
  });

  const keys = ["K_0", "K_1", "K_2", "K_3", "K_4", "K_5", "K_6", "K_7", "K_8", "K_9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "SHIFT", "CTRL", "ALT", "LEFT", "UP", "RIGHT", "DOWN", "PAGEUP", "PAGEDOWN", "END", "HOME", "ESCAPE", "ENTER", "SPACE", "RETURN", "BACKSPACE", "INSERT", "DELETE", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "F13", "F14", "F15"];
  const nativeKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'Shift', 'Ctrl', 'Alt', 'ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown', 'PageUp', 'PageDown', 'End', 'Home', 'Escape', 'Enter', '', 'Return', 'Backspace', 'Insert', 'Delete', "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "F13", "F14", "F15"]
  const keysMap = {}
  nativeKeys.map((nativeKeys, index) => {
    keysMap[nativeKeys] = keys[index]
  })
  const keyboard = {};
  
  // 键盘按下事件
  window.addEventListener('keydown', function(e) {
    keyboard[keysMap[e.key]] = true
    Sk.globals.on_key_down && Sk.misceval.callsimAsync(null, Sk.globals.on_key_down, Sk.ffi.remapToPy(keysMap[e.key]));
  })
  window.addEventListener('keyup', function(e) {
    keyboard[keysMap[e.key]] = false
    Sk.globals.on_key_down && Sk.misceval.callsimAsync(null, Sk.globals.on_key_down, Sk.ffi.remapToPy(keysMap[e.key]));
  })
  // 键盘名称
  mod.Keys = Sk.misceval.callsimOrSuspend(Sk.misceval.buildClass(mod, function($gbl, $loc) {
    keys.map((key) => {
      $loc[key] = defineGetter(() => Sk.ffi.remapToPy(key))
    })
  }, 'Keys', []));
  // 键盘按下
  mod.keyboard = Sk.misceval.callsimOrSuspend(Sk.misceval.buildClass(mod, function($gbl, $loc) {
    keys.map((key, i) => {
      $loc[key.toLowerCase()] = defineGetter(() => keyboard[key] || false)
    })
  }, 'keyboard', []));
  
  const mouseDownMap = {
    '0': 'LEFT',
    '1': 'MIDDLE',
    '2': 'RIGHT',
  }
  let mousePos = {};
  const mouse = {};
  let buttons = [];
  const insertData = function(arr, data) {
    if (data && !~arr.indexOf(data)) {
      arr.push(data)
    }
  }
  const delData = function(arr, data) {
    const index = arr.indexOf(data)
    if (~index) {
      arr.splice(index, 1)
    }
  }
  // 鼠标按下事件
  app.view.addEventListener('mousedown', function(e) {
    const button = (mouseDownMap[e.button] || '').toLowerCase()
    insertData(buttons, button)
    Sk.globals.on_mouse_down && Sk.misceval.callsimAsync(null, Sk.globals.on_mouse_down, Sk.ffi.remapToPy([
      transX(e.offsetX, true),
      transY(e.offsetY, true),
    ]), Sk.ffi.remapToPy(button));
  })
  // 鼠标抬起事件
  app.view.addEventListener('mouseup', function(e) {
    const button = (mouseDownMap[e.button] || '').toLowerCase()
    delData(buttons, button)
    Sk.globals.on_mouse_up && Sk.misceval.callsimAsync(null, Sk.globals.on_mouse_up, Sk.ffi.remapToPy([
      transX(e.offsetX, true),
      transY(e.offsetY, true),
    ]), Sk.ffi.remapToPy(mouseDownMap[e.button]));
  })
  // 禁用鼠标右键
  document.oncontextmenu = function(){
    return false;
  }
  // 鼠标移动事件
  app.view.addEventListener('mousemove', function(e) {
    mousePos = {
      x: transX(e.offsetX, true),
      y: transY(e.offsetY, true),
    }
    Sk.globals.on_mouse_move && Sk.misceval.callsimAsync(
      null,
      Sk.globals.on_mouse_move,
      Sk.ffi.remapToPy([mousePos.x, mousePos.y]),
      Sk.ffi.remapToPy([mousePos.x, mousePos.y]),
      Sk.ffi.remapToPy(buttons)
      );
  })
  // 鼠标滚轮事件
  app.view.addEventListener('wheel', function(e) {
    if (e.deltaY > 0) {
      insertData(buttons, 'wheel_down')
      delData(buttons, 'wheel_up')
    } else if (e.deltaY < 0) {
      insertData(buttons, 'wheel_up')
      delData(buttons, 'wheel_down')
    } else {
      delData(buttons, 'wheel_up')
      delData(buttons, 'wheel_down')
    }
  })
  
  // 鼠标位置
  mod.mouse = Sk.misceval.callsimOrSuspend(Sk.misceval.buildClass(mod, function($gbl, $loc) {
    $loc.x = defineGetter(() => mousePos.x)
    $loc.y = defineGetter(() => mousePos.y)
    $loc.pos = defineGetter(() => Sk.ffi.remapToPy([mousePos.x, mousePos.y]))
    $loc.LEFT = Sk.ffi.remapToPy('left')
    $loc.MIDDLE =  Sk.ffi.remapToPy('middle')
    $loc.RIGHT =  Sk.ffi.remapToPy('right')
    $loc.WHEEL_UP =  Sk.ffi.remapToPy('wheel_up')
    $loc.WHEEL_DOWN =  Sk.ffi.remapToPy('wheel_down')
  }, 'Mouse', []));

  mod.go =  new Sk.builtin.func(function(self) {
  })

  return mod;
};