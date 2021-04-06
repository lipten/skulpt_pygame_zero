export function loadScript(src: string, varName: string){
  if (window[varName]) {
    return Promise.resolve(window[varName]);
  }
  const res = new Promise(function(resolve, reject) {
    const el = document.createElement('script');
    el.onload = function() {
      resolve(varName && window[varName]);
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

// 运行前销毁
export const resetPygameZero = function(ModuleCache) {
  if (ModuleCache.App) {
    // document.getElementById('stage').removeChild(ModuleCache.App.view);
    ModuleCache.App.destroy({
      removeView: true
    });
    window.PIXI.loader.destroy();
    ModuleCache.App = void 0;
    ModuleCache.timerMap.forEach(function(value, key) {
      window.clearInterval(value)
      window.clearTimeout(value)
    })
    ModuleCache.timerMap.clear();
    ModuleCache.soundMap = {};
    ModuleCache.music.pause();
    ModuleCache.music = null;
    ModuleCache.music = new Audio();
    Object.keys(ModuleCache.windowListener).map((key) => {
      const eventName = key.replace('Listener', '');
      window.removeEventListener(eventName, ModuleCache.windowListener[key])
    })
  }
}

// 17中标准颜色名对应的色值
export const ColorNameMap = {
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

export const translateTools = function(app) {
  const halfWidth = Math.round(app.view.width/2);
  const halfHeight = Math.round(app.view.height/2);
  const tools = {
    // 笛卡尔坐标系转换
    transX(x, isReserve = false) {
      // if (isReserve) {
      //   return x - halfWidth
      // } else {
      //   return x + halfWidth
      // }
      return x;
    },
    transY(y, isReserve = false) {
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
    },
    transPos(pos, isReserve = false){
      if (!pos) {
        return pos
      }
      return [tools.transX(pos[0], isReserve), tools.transY(pos[1], isReserve)]
    },
    // 字符串色值转十六进制数字
    transColor(color) {
      if (Array.isArray(color)) {
        return window.PIXI.utils.rgb2hex(color);
      } else {
        if (color.match('#')) {
          return window.PIXI.utils.string2hex(color);
        } else {
          if (ColorNameMap[color]) {
            return window.PIXI.utils.string2hex(ColorNameMap[color]);
          } else {
            return 0xffffff;
          }
        }
      }
    }
  }
  return tools;
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
  

