import 'styles/index.less'
import * as config from 'views/stickyBall/config'
import { distance, posInCircle } from 'views/stickyBall/utils'

class StickyBall {
  constructor(ctx) {
    this.ctx = canvas.getContext('2d')
    this.preDis = 0
    this.ball = {
      pos: {
        x: config.xPox,
        y: config.yPox
      },
      radius: config.radius,
      color: config.gray
    }
  }
  /**
   * 初始化小球，添加事件
   */
  init() {
    this.drawBall(this.ball.pos.x, this.ball.pos.y, this.ball.radius, 0, Math.PI*2, this.ball.color)
    this.ctx.canvas.addEventListener('touchstart', this.dragStart.bind(this))
    this.ctx.canvas.addEventListener('touchmove', this.dragMove.bind(this))
  }
  /**
   * 画小球
   * @param x
   * @param y
   * @param radius
   * @param startAngle
   * @param endAngle
   */
  drawBall(x,y,radius, startAngle, endAngle, color) {
    this.ctx.save();
    this.ctx.beginPath()
    this.ctx.arc(x, y, radius, startAngle, endAngle, false)
    this.ctx.strokeStyle = color
    this.ctx.fillStyle = color
    this.ctx.stroke()
    this.ctx.fill()
    this.ctx.restore()
  }
  /**
   * touchstart事件
   */
  dragStart(event) {
    let pos = this.getMousePos(event)
    if(this.isPosInPath(pos, this.ball, posInCircle)) {
      this.canDragBall = true // touchstart在球上，可以拖动球
    }
  }
  /**
   * touchmove事件
   */
  dragMove(event) {
    console.log(1)
    if (this.canDragBall) {
      let pos = this.getMousePos(event)
      let curDis = distance(pos, this.ball.pos) //当前距离
      if (curDis > this.preDis) {
        this.ball.radius -= 0.2
      } else {
        this.ball.radius += 0.2
      }
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
      this.drawBall(this.ball.pos.x, this.ball.pos.y, this.ball.radius, 0, Math.PI*2, this.ball.color)
      this.drawBall(pos.x, pos.y, config.radius, 0, Math.PI*2, config.gray)
      this.preDis = curDis
    }
  }
  /**
   * 获取鼠标相对于canvas的坐标
   * @param event
   * @returns {{x: number, y: number}}
   */
  getMousePos(event) {
    const mousePos = event.touches[0]
    const canvasBound = this.ctx.canvas.getBoundingClientRect()
    return {
      x: mousePos.clientX - canvasBound.top,
      y: mousePos.clientY - canvasBound.left
    }
  }
  /**
   *
   * @param position
   * @param func
   * @returns {*}
   */
  isPosInPath(position, ball, func) {
    return func(ball)(position)
  }
}
window.onload = function main(){
  const canvas = document.getElementById('canvas')
  canvas.height = window.innerHeight
  canvas.width = window.innerWidth
  const stickyBall = new StickyBall(canvas.getContext('2d'))
  stickyBall.init()
}
