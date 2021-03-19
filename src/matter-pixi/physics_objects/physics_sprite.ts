'use strict'

import { Sprite } from '@pixi/sprite';
import { Texture } from '@pixi/core';
import { Body, Bodies, IBodyDefinition } from 'matter-js';

import { SpriteOptions } from '../interfaces/sprite_options';

/**
 * Extends the pixi sprite class to include a Matter body and its properties.
 */
export class PhysicsSprite extends Sprite {
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

  /**
   * @param {Texture} texture The texture of the sprite.
   * @param {SpriteOptions} spriteOptions The options to define the initial properties of the sprite.
   * @param {PhysicsOptions} physicsOptions The options to apply to the sprite's body.
   */
  constructor(texture: Texture, spriteOptions: SpriteOptions = {}, physicsOptions: IBodyDefinition = {}) {
    super(texture);

    this.anchor.x = 0.5;
    this.anchor.y = 0.5;

    this.position.x = spriteOptions.x || 0;
    this.position.y = spriteOptions.y || 0;

    if (spriteOptions.width) this.width = spriteOptions.width;
    if (spriteOptions.height) this.height = spriteOptions.height;

    this.physicsOptions = physicsOptions;

    if (spriteOptions.isCircle) this._body = Bodies.circle(this.x, this.y, this.width, this.physicsOptions);
    else this._body = Bodies.rectangle(this.x, this.y, this.width, this.height, this.physicsOptions);
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
    this.position.x = this._body.position.x;
    this.position.y = this._body.position.y;
    this.rotation = this._body.angle;
  }
}