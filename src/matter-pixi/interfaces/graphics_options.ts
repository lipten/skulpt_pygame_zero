'use strict'

/**
 * The options that can be passed to a graphics object with physics.
 */
export interface GraphicsOptions {
  /**
   * The x position of the shape.
   */
  x: number;

  /**
   * The y position of the shape.
   */
  y: number;

  /**
   * If the shape is a rectangle this is the width of the rectangle.
   */
  width: number;

  /**
   * If the shape is a rectangle this is the height of the rectangle.
   */
  height: number;
  
  /**
   * If the shape is a circle this is the radius of the circle.
   */
  radius?: number;

  /**
   * The color of the fill of the rectangle or circle.
   */
  fill?: number;

  /**
   * The thickness of the graphic object's line.
   */
  lineWidth?: number;

  /**
   * The color of the line of the rectangle or circle.
   */
  lineColor?: number;
}