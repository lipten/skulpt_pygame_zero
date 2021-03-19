declare module '@pixi/graphics' {
  export class Graphics {
    x: number;
    y: number;
    position: Vector;
    pivot: Vector;
    width: number;
    height: number;
    rotation: number;

    beginFill(color = 0, alpha = 1): this;
    lineStyle(width?: number, color?: number): this;

    drawCircle(x: number, y: number, radius: number): this;
    drawRect(x: number, y: number, width: number, height: number): this;
  }
}

interface Vector {
  x: number;
  y: number;
}