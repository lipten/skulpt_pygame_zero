from pgzrun import * # 导入游戏库

x = WIDTH/2   # 小球的x坐标，初始化在窗口中间
y = HEIGHT/2  # 小球的y坐标，初始化在窗口中间
speed_x = 3   # 小球x方向的速度
speed_y = 5   # 小球y方向的速度
r = 30        # 小球的半径

def draw():   # 绘制模块，每帧重复执行
    screen.fill('white')  # 白色背景
    # 绘制一个填充圆，坐标(x,y)，半径r，红色
    screen.draw.filled_circle((x, y), r, 'red')

def update(): # 更新模块，每帧重复操作
    global x,y,speed_x,speed_y # 要修改的变量在这里说明下
    x = x+speed_x   # 利用x方向速度更新x坐标
    y = y+speed_y   # 利用y方向速度更新y坐标
    if x >= WIDTH-r or x <= r:  # 当小球碰到左右边界时
        speed_x = -speed_x       # x方向速度反转
    if y >= HEIGHT-r or y <= r: # 当小球碰到上下边界时
        speed_y = -speed_y       # y方向速度反转

go()   # 开始执行游戏