'use strict'

import { Graphics } from '@pixi/graphics';
import { Body, Bodies, IBodyDefinition } from 'matter-js';
import { GraphicsOptions } from '../interfaces/graphics_options';

// Fix for issue with pixi throwing an error if there's a global pixi object
// and we try to extend the Graphics module.
// @ts-ignore
const GraphicsObject = window.PIXI ? window.PIXI.Graphics : Graphics;
/**
 * Represents a rectangular or circular shape with a physics body attached to
 * it.
 */
export class PhysicsGraphics extends GraphicsObject {
  /**
   * A reference to the options for the graphic object's position and style.
   * 
   * @property {GraphicsOptions}
   */
  graphicsOptions: GraphicsOptions = {
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    fill: 0x000000,
    lineWidth: 1,
    lineColor: 0xffffff,
  }

  /**
   * A reference to the options for the graphic object's body.
   * 
   * @property {IBodyDefinition}
   */
  physicsOptions: IBodyDefinition;

  /**
   * The physics body of the graphics object.
   * 
   * @private
   * 
   * @property {Body}
   */
  private _body: Body;


  /**
   * @param {GraphicsOptions} graphicsOptions The options for the appearance and initial position of the graphics object.
   * @param {PhysicsOptions} physicsOptions The options to apply to the graphic object's body.
   * @param {update}
   */
  constructor(graphicsOptions?: GraphicsOptions, physicsOptions: IBodyDefinition = {}, update?: ({position, rotation}) => void) {
    super();

    this.graphicsOptions = Object.assign(this.graphicsOptions, graphicsOptions);
    this.physicsOptions = physicsOptions;

    const halfWidth = this.graphicsOptions.width / 2;
    const halfHeight = this.graphicsOptions.height / 2;

    this.pivot.x = halfWidth;
    this.pivot.y = halfHeight;

    this._update = update;
    // this._createShape();

    if (this.graphicsOptions.radius) this._body = Bodies.circle(this.graphicsOptions.x, this.graphicsOptions.y, this.graphicsOptions.radius, this.physicsOptions);
    else this._body = Bodies.rectangle(this.graphicsOptions.x + halfWidth, this.graphicsOptions.y + halfHeight, this.graphicsOptions.width, this.graphicsOptions.height, this.physicsOptions);
  }

  /**
   * Returns the body of the graphics object.
   * 
   * @returns {Body}
   */
  get body() { return this._body; }

  /**
   * Updates the position of the graphics object according to where its body 
   * should be.
   */
  update() {
    this._update({
      position: this._body.position,
      rotation: this._body.angle,
    })
  }
}