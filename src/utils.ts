import { PhysicsGraphics } from './matter-pixi';
import { Body } from 'matter-js';

export function loadScript(src, varName){
  if (window[varName]) {
    return Promise.resolve(window[varName]);
  }
  const res = new Promise(function(resolve, reject) {
    const el = document.createElement('script');
    el.onload = function() {
      resolve(varName && window.varName);
    };

    el.onerror = function(e) {
      el.onload = null;
      el.onerror = null;
      document.body.removeChild(el);
      reject(e);
    };
    el.src = src;
    el.async = true;
    document.body.appendChild(el);
  });
  return res;
}


// 碰撞检测函数
export function hitTestRectangle(r1, r2) {
  // 如果r2是坐标点
  if (Array.isArray(r2)) {
    r2.x = r2[0];
    r2.y = r2[1];
    r2.width = 0;
    r2.height = 0;
  }

  //Define the variables we'll need to calculate
  let hit;

  //hit will determine whether there's a collision
  hit = false;

  //Find the center points of each sprite
  r1.centerX = r1.x + r1.width / 2;
  r1.centerY = r1.y + r1.height / 2;
  r2.centerX = r2.x + r2.width / 2;
  r2.centerY = r2.y + r2.height / 2;

  //Find the half-widths and half-heights of each sprite
  r1.halfWidth = r1.width / 2;
  r1.halfHeight = r1.height / 2;
  r2.halfWidth = r2.width / 2;
  r2.halfHeight = r2.height / 2;

  //Calculate the distance vector between the sprites
  const vx = r1.centerX - r2.centerX;
  const vy = r1.centerY - r2.centerY;

  //Figure out the combined half-widths and half-heights
  const combinedHalfWidths = r1.halfWidth + r2.halfWidth;
  const combinedHalfHeights = r1.halfHeight + r2.halfHeight;

  //Check for a collision on the x axis
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
  }

  //`hit` will be either `true` or `false`
  return hit;
}

// 加载纹理
const JsonLoadedMap = {};
export function textureRecources (resource) {
  function loadResource(resource) {
    let list;
    if (Array.isArray(resource)) {
      list = [...resource];
      resource = list[0]
    }
    return new Promise((resolve, reject) => {
      if (window.PIXI.utils.TextureCache[resource]) {
        resolve(window.PIXI.utils.TextureCache[resource])
      } else {
        window.PIXI.loader.add(list || resource).load(function() {
          const texture = window.PIXI.loader.resources[resource].texture;
          resolve(texture)
        });
      }
    })
  }
  if (/\.json$/.test(resource)) {
    if (JsonLoadedMap[resource]) {
      return loadResource(JsonLoadedMap[resource])
    } else {
      return fetch(resource).then((res) => {
        return res.json()
      }).then((res) => {
        const prefix = resource.replace('index.json', '');
        const resoureList = res.map((item) => {
          return prefix + item
        })
        JsonLoadedMap[resource] = resoureList;
        return loadResource(resoureList)
      })
    }
  } else {
    return loadResource(resource)
  }
}
const Sk = window.Sk;
// getter函数
export const defineGetter = function(func) {
  return Sk.misceval.callsimOrSuspend(Sk.builtins.property, new Sk.builtin.func(func), new Sk.builtin.func(function() {}));
}
// 生成kwargs函数
export function genkwaFunc(func, isJsArgs) {
  const kwaFunc = function(kwa, ...args){
    if (!isJsArgs) {
      args = new Sk.builtins['tuple'](args); /*vararg*/
    }
    const kwargs = new Sk.builtin.dict(kwa);
    return func(args, kwargs)
  }
  kwaFunc['co_kwargs'] = true;
  return kwaFunc;
}
// 监听属性getter/setter
export const defineProperty = function(obj, property) {
  return Sk.misceval.callsimOrSuspend(Sk.builtins.property, new Sk.builtin.func(function(self) {
    if (typeof obj === 'function') {
      return obj(self)
    } else {
      return Sk.ffi.remapToPy(self[obj][property])
    }
  }), new Sk.builtin.func(function(self, val) {
    if (typeof property === 'function') {
      property(self, val)
    } else {
      self[obj][property] = val.v;
    }
  }))
}
  
// 拓展graphics功能
export const upgradeGraphics = function(mod, app, pixiMatter, func) {
  return new Sk.builtin.func(function(self, ...args) {
    return Sk.misceval.callsimOrSuspend(Sk.misceval.buildClass(mod, function($gbl, $loc) {
      $loc.__init__ = new Sk.builtin.func(function(selfGraph) {
        selfGraph.graph = new PIXI.Graphics();
        const graph = selfGraph.graph;
        func(self, graph, ...args)
        const halfWidth = selfGraph.graph.width / 2;
        const halfHeight = selfGraph.graph.height / 2;
        const x = selfGraph.graph.graphicsData[0].shape.x;
        const y = selfGraph.graph.graphicsData[0].shape.y;
        if (selfGraph.graph.isCircle) {
          selfGraph.graph.pivot.set(halfWidth * 2, halfHeight * 2)
          selfGraph.graph.position.set(halfWidth * 2, halfWidth * 2)
        } else {
          selfGraph.graph.pivot.set(x+halfWidth, y+halfHeight)
          selfGraph.graph.position.set(x+halfWidth, y+halfHeight)
        }
      })
      $loc.rotation = defineProperty(function(selfGraph) {
        return Sk.ffi.remapToPy(selfGraph.rotation)
      }, function (selfGraph, val) {
        if (selfGraph.physicGraphics) {
          Body.setAngle(selfGraph.physicGraphics._body, val.v)
        } else {
          // selfGraph.graph.position.set(selfGraph.graph.x + pivotX, selfGraph.graph.y - pivotY)
          selfGraph.graph.rotation = val.v
        }
      })
      $loc.physicsImpostor = new Sk.builtin.func(genkwaFunc(function(args, kwa) {
        kwa = Sk.ffi.remapToJs(kwa);
        let [selfGraph, is_static, physicsOptions] = args;
        is_static = Sk.ffi.remapToJs(is_static || kwa.is_static) || false;
        let is_circle = false;
        physicsOptions = Sk.ffi.remapToJs(physicsOptions || kwa.physicsOptions) || {}
        const {graphicsData, width, height, line, rotation} = selfGraph.graph
        const extra = {}
        if (selfGraph.graph.isCircle){
          is_circle = true;
          extra.radius = graphicsData[0].shape.radius;
        }
        if (selfGraph.graph.isFilled) {
          extra.fill = graphicsData[0].fillStyle.color
        }
        selfGraph.physicGraphics = new PhysicsGraphics({
          x: graphicsData[0].shape.x,
          y: graphicsData[0].shape.y,
          width: width,
          height: height,
          lineWidth: line.width,
          lineColor: line.color,
          ...extra,
        },{
          isCircle: is_circle,
          isStatic: is_static,
          ...physicsOptions,
        },({position, rotation}) => {
          selfGraph.graph.position = position;
          selfGraph.graph.rotation = rotation;
        });
        Body.setAngle(selfGraph.physicGraphics._body, rotation)
        pixiMatter.addToWorld(selfGraph.physicGraphics);
        // app.stage.removeChild(selfGraph.graph);
        // app.stage.addChild(selfGraph.physicGraphics);
      }, true))
    }))
  })
}