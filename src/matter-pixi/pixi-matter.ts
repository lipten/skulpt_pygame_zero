'use strict'

import { Engine, World, MouseConstraint } from 'matter-js';

import { PhysicsSprite } from './physics_objects/physics_sprite';
import { PhysicsGraphics } from './physics_objects/physics_graphics';

/**
 * Manages pixi objects within the Matter engine.
 */
export class PixiMatter {
  /**
   * A reference to the Matter engine.
   * 
   * @private
   * 
   * @property {Engine}
   */
  private _engine = Engine.create();

  /**
   * A reference to all of the pixi objects added to the world.
   * 
   * @private
   * 
   * @property {Array<PhysicsSprite|PhysicsGraphics>}
   */
  private _pixiObjects: Array<PhysicsSprite | PhysicsGraphics> = [];

  constructor() {
    Engine.run(this.engine);
  }

  /**
   * Returns the reference to the Matter engine.
   * 
   * @returns {Engine}
   */
  get engine() { return this._engine; }

  /**
   * Returns the pixi objects added to the world.
   * 
   * @property {Array<PhysicsSprite|PhysicsGraphics>}
   */
  get pixiObjects() { return this._pixiObjects; }

  /**
   * Updates the position of each pixi object added to the world.
   */
  update() {
    this._pixiObjects.forEach(po => po.update());
  }

  /**
   * Adds one or more pixi objects to the Matter world.
   * 
   * @param {Array<PhysicsSprite|PhysicsGraphics>} pixiObjects The pixi object/s to add to the Matter world.
   */
  addToWorld(...pixiObjects: Array<PhysicsSprite | PhysicsGraphics>) {
    pixiObjects.forEach(po => World.addBody(this.engine.world, po.body));

    this._pixiObjects = this._pixiObjects.concat(pixiObjects);
  }

  /**
   * Removes one or more pixi sprites from the Matter world.
   * 
   * @param {Array<PhysicsSprite|PhysicsGraphics>} pixiObjects The pixi object/s to remove from the Matter world.
   */
  removeFromWorld(...pixiObjects: Array<PhysicsSprite | PhysicsGraphics>) {
    pixiObjects.forEach(po => World.remove(this.engine.world, po.body));

    this._pixiObjects = this._pixiObjects.filter(po => !pixiObjects.includes(po));
  }
}