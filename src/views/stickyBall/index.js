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
    this.ctx.beginPath()
    this.ctx.arc(100, 100, 30, -Math.PI/4, -Math.PI/3+Math.PI, false)
    this.ctx.stroke()
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
    if (this.canDragBall) {
      let pos = this.getMousePos(event)
      let curDis = distance(pos, this.ball.pos) //当前距离
      // 距离拉远
      if (curDis > this.preDis && this.ball.radius > config.minRadius) {
        this.ball.radius -= 0.2
      }
      // 距离拉近
      if (curDis < this.preDis && this.ball.radius < config.radius) {
        this.ball.radius = (this.ball.radius + 0.2) > config.radius ? config.radius : (this.ball.radius + 0.2)
      }
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
      this.drawBall(this.ball.pos.x, this.ball.pos.y, this.ball.radius, 0, Math.PI*2, this.ball.color)
      this.drawBall(pos.x, pos.y, config.radius, 0, Math.PI*2, config.gray)
      // 画两圆之间的连接线
      let angle = Math.atan(Math.abs(this.ball.pos.y - pos.y)/Math.abs(this.ball.pos.x - pos.x))
      let startPointOne = this.getContactPoint(pos, config.radius, this.ball.pos, this.ball.radius, 1, true)
      let endPointOne = this.getContactPoint(pos, config.radius, this.ball.pos, this.ball.radius, 1, false)
      let startPointTwo = this.getContactPoint(pos, config.radius, this.ball.pos, this.ball.radius, -1, true)
      let endPointTwo = this.getContactPoint(pos, config.radius, this.ball.pos, this.ball.radius, -1, false)
      let control = {
        x: (this.ball.pos.x + pos.x)/2,
        y: (this.ball.pos.y + pos.y)/2
      }
      // this.ctx.beginPath()
      // this.ctx.moveTo(startPointTwo.x, startPointTwo.y)
      // this.ctx.arc(this.ball.pos.x, pos.y, radius, startAngle, endAngle, false)
      let startAngle = angle + Math.PI/2
      if (this.ball.pos.y < pos.y && this.ball.pos.x > pos.x) {
        startAngle = Math.PI - angle
      }
      if (this.ball.pos.y > pos.y && this.ball.pos.x > pos.x) {
        startAngle = Math.PI + angle
      }
      if (this.ball.pos.y > pos.y && this.ball.pos.x < pos.x) {
        startAngle = 2 * Math.PI - angle
      }
      this.ctx.beginPath()
      this.ctx.moveTo(startPointTwo.x, startPointTwo.y)
      this.ctx.arc(this.ball.pos.x, this.ball.pos.y, this.ball.radius, startAngle, startAngle + Math.PI, false)
      this.ctx.moveTo(startPointOne.x, startPointOne.y)
      this.ctx.quadraticCurveTo(control.x, control.y, endPointOne.x, endPointOne.y)
      // this.ctx.moveTo(startPointTwo.x, startPointTwo.y)
      // this.ctx.quadraticCurveTo(control.x, control.y, endPointTwo.x, endPointTwo.y)
      this.ctx.stroke()
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
  /**
   *
   * @param pos  要求切点的圆心
   * @param radius 要求切点的圆的半径
   * @param rPos  相对的圆的圆心
   * @param isRight  是否在以要求切点的圆的圆心为视角看向相对圆方向的右边
   * @param getReference  获取相应的相对圆的切点
   * @returns {{x: *, y: *}}
   */
  getContactPoint(pos, radius, rPos , rRadius, isRight, getReference) {
    let sign = { x: 1, y: 1}
    if (pos.x > rPos.x && pos.y > rPos.y) {
      sign = { x: 1, y: -1 }
    }
    if (pos.x > rPos.x && pos.y < rPos.y) {
      sign = { x: -1, y: -1}
    }
    if (pos.x < rPos.x && pos.y < rPos.y) {
      sign = { x: -1, y: 1}
    }
    if (getReference) {
      return {
        x: rPos.x + isRight * sign.x * rRadius * Math.sin(Math.PI/4),
        y: rPos.y + isRight * sign.y * rRadius * Math.sin(Math.PI/4)
      }
    }
    return {
      x: pos.x + isRight * sign.x * radius * Math.sin(Math.PI/4),
      y: pos.y + isRight * sign.y * radius * Math.sin(Math.PI/4)
    }
  }
}
window.onload = function main(){
  const canvas = document.getElementById('canvas')
  canvas.height = window.innerHeight
  canvas.width = window.innerWidth
  const stickyBall = new StickyBall(canvas.getContext('2d'))
  stickyBall.init()
}
