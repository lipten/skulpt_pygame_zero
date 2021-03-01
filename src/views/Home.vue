<template>
  <div class="home">
    <div class="container">
      <div class="left-area">
        <textarea id="yourcode" class="code-area"></textarea>
      </div>
      <div class="right-area">
        <el-button type="primary" @click="run">运行</el-button>
        <div id="stage" class="stage"></div>
        <div class="output">
          <p>输出内容：</p>
          <div id="output" ></div>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/idea.css'
import 'codemirror/mode/python/python.js'
import {runPy} from '../utils/skulpt-main'

export default defineComponent({
  name: 'Home',
  components: {
  },
  mounted() {
    this.editor = CodeMirror.fromTextArea(document.getElementById('yourcode') as HTMLTextAreaElement, {
      lineNumbers: true,
      mode:  "python",
      theme: "idea",
    });
    this.editor.setValue(
`from pgz import *
import random

resources = {
  'bg': 'https://static.lipten.link/blogs/bg.png',
  'xiaomeng1': 'https://static.lipten.link/blogs/xiaomeng1.png',
  'xiaomeng2': 'https://static.lipten.link/blogs/xiaomeng2.png',
  'star': 'https://static.lipten.link/blogs/star.png',
  'bgm': 'https://static.lipten.link/blogs/bgm.mp3',
  'sound': 'https://static.lipten.link/blogs/sound.mp3'
}
bg=Actor(resources['bg'])
xiaomeng = Actor((resources['xiaomeng1'], resources['xiaomeng2']))
xiaomeng.pos = 0, -120
xiaomeng.width = 100
xiaomeng.height = 140

star_list = []

music.play(resources['bgm'])
music.set_volume(0.2)

score = 0
time = 30
game_end = False
class Star:
    def __init__(self, x, y, speed):
        self.star = Actor(resources['star'])
        self.star.x = x
        self.star.y = y
        self.speed = speed
        self.is_out = False

    def move(self):
        star = self.star
        star.y -= self.speed
        if star.y < HEIGHT / 2 * -1:
            self.is_out = True
            self.star.remove()


def make_star():
    x = random.randint(WIDTH / -2, WIDTH / 2)
    y = HEIGHT / 2
    speed = random.randint(4, 10)
    star = Star(x, y, speed)
    star_list.append(star)


clock.schedule_interval(make_star, 1)

def countdown():
    global time
    global game_end
    if time <= 0:
        game_end = True
        clock.unschedule(countdown)
        clock.unschedule(make_star)
        music.stop()
    else:
        time -= 1

clock.schedule_interval(countdown, 1)

def update():
    global score
    if not game_end:
        for star in star_list:
            star.move()
            if star.star.collide_actor(xiaomeng):
                score += 1
                sound.play("resources['sound']")
                star.is_out = True
                star.star.remove()
            if star.is_out:
                star_list.remove(star)

        if keyboard.Left and xiaomeng.x > WIDTH / 2 * -1:
            xiaomeng.x -= 15
        elif keyboard.Right and xiaomeng.x < WIDTH / 2:
            xiaomeng.x += 15
        pen.clear()
        text = "得分：" + str(score) + "  时间：" + str(time)
        pen.text(text, (0, 140), "yellow", 30)
    else:
        pen.text("time over !!!", (0,0), 'purple',  40)

def on_key_down(key):
    if key == 'ArrowLeft':
        xiaomeng.frame = 2
    elif key == 'ArrowRight':
        xiaomeng.frame = 1


def on_mouse_down(pos):
    x, y = pos
    if x > 0:
        xiaomeng.frame = 1
        xiaomeng.x += 50
    else:
        xiaomeng.frame = 2
        xiaomeng.x -= 50`)
  },
  methods: {
    run() {
      runPy(this.editor.getValue())
    },
    upload() {
      console.log()
    }
  },
});
</script>

<style lang="scss">
  .CodeMirror {
    height: 100vh;
  }
</style>
<style lang="scss" scoped>
.container {
  padding-right: 500px;
  position: relative;
}
.left-area {
  width: 100%;
  border-right: 1px solid #aaa;
}
.right-area {
  position: absolute;
  right: 0;
  top: 0;
  width: 500px;
  .stage {
    width: 100%;
    height: 400px;
    background: #fff;
  }
  .output {
    height: 400px;
    background: rgb(211, 211, 211);
    p {
      margin: 0;
      padding: 10px 0;
    }
  }
}
</style>