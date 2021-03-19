'use strict'

/**
 * Defines the options that can be passed to sprite when created to specify
 * initial starting position and other properties.
 */
export interface SpriteOptions {
  /**
   * The initial x position of the sprite.
   */
  x?: number;

  /**
   * The initial y position of the sprite.
   */
  y?: number;

  /**
   * The width of the sprite.
   */
  width?: number;

  /**
   * The height of the sprite.
   */
  height?: number;

  /**
   * Indicates whether the sprite is circular or not.
   */
  isCircle?: boolean;
}