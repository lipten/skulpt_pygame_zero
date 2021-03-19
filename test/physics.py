from pgzrun import *

resources = {
  'box': 'https://static.lipten.link/blogs/sprint-box.png',
  'ball': 'https://static.lipten.link/blogs/sprint-ball.png',
}
pen=draw()
pen.circle((10, 100), 50, 'blue')
ground = pen.rect((0,350),500,30, 'red')
ground.physicsImpostor(True)

box = Actor(resources['box'], (10, 10))
box.size=50,50
box.physicsImpostor()
box.draw()

ball = Actor(resources['ball'], (100, 10))
ball.size = 50,50
ball.physicsImpostor(is_circle=True)
ball.draw()

go()