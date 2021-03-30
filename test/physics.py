from pgzrun import *
import math

resources = {
  'box': 'https://static.lipten.link/blogs/2D_Pix_image_7%20(1).png',
  'ball': 'https://static.lipten.link/blogs/780.png',
}
pen=draw()

# 添加圆形物体
circle = pen.filled_circle((100, 100), 50, 'blue')
# 添加地板
ground = pen.filled_rect((0,350),500,30, 'red')
# 地板倾斜10度
ground.rotation = math.pi / 18
# 添加方形箱子角色
box = Actor(resources['box'], (200, 10))
box.size= 50,50
box.draw()
# 添加球型角色
ball = Actor(resources['ball'], (120, 10))
ball.size = 50,50
ball.draw()

def enablePhysics():
  # 圆形开启物理引擎
  circle.physicsImpostor(False, {'frictionAir': 0.1, 'restitution': 1}) # 转成物理对象
  # 地板开启物理引擎
  ground.physicsImpostor(True)
  # 方形箱子开启物理引擎
  box.physicsImpostor()
  # 球型开启物理引擎
  ball.physicsImpostor(is_circle=True, physicsOptions={'frictionAir': 0.1, 'restitution': 1})

# 1秒后开启重力
clock.schedule(enablePhysics, 1)

go()