from pgzrun import *
import math

resources = {
  'box': 'https://static.lipten.link/blogs/2D_Pix_image_7%20(1).png',
  'ball': 'https://static.lipten.link/blogs/780.png',
}
pen=draw()
circle = pen.filled_circle((100, 100), 50, 'blue')
physicsOptions = {'frictionAir': 0.1}
circle.physicsImpostor(False, physicsOptions)
ground = pen.filled_rect((0,350),500,30, 'red')
ground.rotation = 0.1
ground.physicsImpostor(True)

box = Actor(resources['box'], (10, 10))
box.size= 50,50
box.physicsImpostor()
box.draw()

ball = Actor(resources['ball'], (100, 10))
ball.size = 50,50
ball.physicsImpostor(is_circle=True)
ball.draw()

go()