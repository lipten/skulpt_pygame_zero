from pgzrun import *

resources = {
  'box': 'https://static.lipten.link/blogs/sprint-box.png',
  'ball': 'https://static.lipten.link/blogs/sprint-ball.png',
}

box = Actor(resources['box'])
box.x = 10
box.y = 10
box.width = 50
box.height = 50
box.physicsImpostor();
box.draw();

ball = Actor(resources['ball'])
ball.x = 100
ball.y = 10
ball.width = 115
ball.height = 115
ball.physicsImpostor(is_circle=True);
ball.draw();

def changePos():
  box.y = 10

clock.schedule(changePos, 2)
go()