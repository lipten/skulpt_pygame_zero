'use strict'

import { Sprite } from '@pixi/sprite';
import { Texture } from '@pixi/core';
import { Body, Bodies, IBodyDefinition } from 'matter-js';

import { SpriteOptions } from '../interfaces/sprite_options';

/**
 * Extends the pixi sprite class to include a Matter body and its properties.
 */
export class PhysicsSprite {
  /**
   * A reference to the physics options for this sprite's body.
   * 
   * @property {IBodyDefinition}
   */
  physicsOptions: IBodyDefinition;

  /**
   * The physics body of the sprite.
   * 
   * @private
   * 
   * @property {Body}
   */
  private _body: Body;
  private _update: ({position, rotation}) => void;
  private _sprite: Sprite;

  /**
   * @param {sprite} The target sprite.
   * @param {PhysicsOptions} physicsOptions The options to apply to the sprite's body.
   * @param {update} 
   */
  constructor(sprite: Sprite, physicsOptions: IBodyDefinition = {}, update?: ({position, rotation}) => void) {
    const {x, y, width, height, texture} = sprite;
    this._sprite = sprite;
    this._update = update;
    this.physicsOptions = physicsOptions;
    if (physicsOptions.isCircle) this._body = Bodies.circle(x, y, width/2, physicsOptions);
    else this._body = Bodies.rectangle(x, y, width, height, physicsOptions);
  }

  /**
   * Returns the physics body of the sprite.
   * 
   * @returns {Body}
   */
  get body(): Body { return this._body; }

  /**
   * Updates the position of the sprite according to where its body should be.
   */
  update() {
    if (this._update) {
      this._update({
        position: this._body.position,
        rotation: this._body.angle,
      })
    } else {
      this._sprite.position = this._body.position;
      this._sprite.rotation = this._body.angle;
    }
  }
}