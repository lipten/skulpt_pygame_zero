from pgzero import *
import random
pen = screen.draw
resources = {
  'bg': 'https://static.lipten.link/blogs/bg2.png',
  'pig1': 'https://static.lipten.link/blogs/pig1.png',
  'pig2': 'https://static.lipten.link/blogs/pig2.png',
  'money': 'https://static.lipten.link/blogs/pocket.png',
  'bgm': 'https://static.lipten.link/blogs/bgm.mp3',
  'sound': 'https://static.lipten.link/blogs/sound.mp3'
}

half_width = WIDTH/2
half_height = HEIGHT/2

bg=Actor(resources['bg'])
bg.width = WIDTH
bg.height = HEIGHT
bg.pos = half_width, half_height
pig = Actor((resources['pig2'], resources['pig1']))
pig.pos = half_width, half_height+120
pig.width = 180
pig.height = 140

money_list = []
music.play(resources['bgm'])
music.set_volume(0.2)

score = 0
time = 30
game_end = False
class Money:
    def __init__(self, x, y, speed):
        self.money = Actor(resources['money'])
        self.money.x = x
        self.money.y = y
        self.money.width = 60
        self.money.height = 60
        self.speed = speed
        self.is_out = False

    def move(self):
        money = self.money
        money.y += self.speed
        if money.y > HEIGHT:
            self.is_out = True
            self.money.remove()


def make_money():
    x = random.randint(0, WIDTH)
    y = 0
    speed = random.randint(4, 10)
    money = Money(x, y, speed)
    money_list.append(money)


clock.schedule_interval(make_money, 1)

def countdown():
    global time
    global game_end
    if time <= 0:
        game_end = True
        clock.unschedule(countdown)
        clock.unschedule(make_money)
        music.stop()
    else:
        time -= 1

clock.schedule_interval(countdown, 1)

def update():
    global score
    if not game_end:
        for money in money_list:
            money.move()
            if money.money.collide_actor(pig):
                score += 1
                sound.play(resources['sound'])
                money.is_out = True
                money.money.remove()
            if money.is_out:
                money_list.remove(money)

        if keyboard.left and pig.x > 0:
            pig.x -= 15
        elif keyboard.right and pig.x < WIDTH:
            pig.x += 15
        pen.clear()
        text = "得分：" + str(score) + "  时间：" + str(time)
        pen.text(text, (half_width,100), "yellow", 30)
    else:
        pen.text("time over !!!", (half_width,half_height), 'purple',  40)

def on_key_down(key):
    if key == Keys.LEFT:
        pig.frame = 2
    elif key == Keys.RIGHT:
        pig.frame = 1


def on_mouse_down(pos, button):
    x, y = pos
    if mouse.LEFT:
        pig.frame = 2
        pig.x -= 50
    elif mouse.RIGHT:
        pig.frame = 1
        pig.x += 50