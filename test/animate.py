from pgzrun import *
alien = Actor('https://static.lipten.link/blogs/pig1.png')
alien.draw()
def on_finished():
    print("finished")
    
animate(alien, pos=(WIDTH/2, HEIGHT/2), duration=1, tween="accelerate", on_finished=on_finished)

go()