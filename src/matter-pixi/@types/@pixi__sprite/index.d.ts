declare module '@pixi/sprite' {
  import { Texture } from '@pixi/core';

  export class Sprite {
    x: number;
    y: number;
    anchor: Vector;
    position: Vector;
    rotation: number;

    tint: number;
    alpha: number;
    width: number;
    height: number;

    constructor(texture: Texture)
  }
}

interface Vector {
  x: number;
  y: number;
}