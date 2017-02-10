import * as config from 'views/stickyBall/config'
import TWEEN from 'tween.js'
import { distance, posInCircle, equal } from 'views/stickyBall/utils'

const quadrantOne = 'quadrantOne'
const quadrantTwo = 'quadrantTwo'
const quadrantThree = 'quadrantThree'
const quadrantFour = 'quadrantFour'

let stickyBall
class StickyBall {
  constructor(ctx) {
    this.ctx = canvas.getContext('2d')
    this.resetRadius = config.radius
    this.ball = {
      pos: {
        x: config.xPox,
        y: config.yPox
      },
      radius: config.radius,
      color: config.gray
    }
    this.dragBall= {

    }
  }
  /**
   * 初始化小球，添加事件
   */
  init() {
    this.ctx.beginPath()
    this.drawBallOnCanvas(this.ball.pos.x * config.dpr, this.ball.pos.y * config.dpr, this.ball.radius* config.dpr, 0, Math.PI*2, this.ball.color)
    this.ctx.canvas.addEventListener('touchstart', this.dragStart.bind(this))
    this.ctx.canvas.addEventListener('touchmove', this.dragMove.bind(this))
    this.ctx.canvas.addEventListener('touchend', this.dragEnd.bind(this))
  }
  /**
   * 画小球
   * @param x
   * @param y
   * @param radius
   * @param startAngle
   * @param endAngle
   */
  drawBallOnCanvas(x,y,radius, startAngle, endAngle, color) {
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
    event.preventDefault()
    let pos = this.getMousePos(event)
    if(this.isPosInPath(pos, this.ball, posInCircle)) {
      this.canDragBall = true // touchstart在球上，可以拖动球
    }
  }
  /**
   * touchmove事件
   */
  dragMove(event) {
    event.preventDefault()
    if (this.canDragBall) {
      let pos = stickyBall.getMousePos(event)
      stickyBall.dragBall.pos = pos
      stickyBall.angleWithXRay = Math.atan(Math.abs(stickyBall.ball.pos.y - pos.y)/Math.abs(stickyBall.ball.pos.x - pos.x))
      stickyBall.dragMoveDraw(pos)
    }
  }
  dragEnd(event) {
    event.preventDefault()
    // 选择缓动函数
    var bounce_animate_type = TWEEN.Easing.Elastic.InOut
    TWEEN.removeAll()
    let tween = new TWEEN.Tween(this.dragBall.pos)
      .to(this.ball.pos, 100)
      .easing(bounce_animate_type)
      .start()
    if (this.canDragBall) {
      bounceAnimate()
      this.canDragBall = false
    }
    function bounceAnimate(time) {
      stickyBall.dragMoveDraw(stickyBall.dragBall.pos)
      if (!equal(stickyBall.dragBall.pos, stickyBall.ball.pos)) {
        requestAnimationFrame(bounceAnimate)
      } else {
        stickyBall.bounceEffect()
      }
      TWEEN.update(time)
    }
  }
  bounceEffect() {
    let rangeHead, rangeBack
    let count = 0
    if (this.quadrant === quadrantFour) {
      rangeHead = {
        x: this.ball.pos.x + config.bounceRange * Math.cos(this.angleWithXRay),
        y: this.ball.pos.y + config.bounceRange * Math.sin(this.angleWithXRay)
      }
      rangeBack = {
        x: this.ball.pos.x - config.bounceRange * Math.cos(this.angleWithXRay),
        y: this.ball.pos.y - config.bounceRange * Math.sin(this.angleWithXRay)
      }
    }
    if (this.quadrant === quadrantThree) {
      rangeHead = {
        x: this.ball.pos.x + config.bounceRange * Math.cos(this.angleWithXRay),
        y: this.ball.pos.y - config.bounceRange * Math.sin(this.angleWithXRay)
      }
      rangeBack = {
        x: this.ball.pos.x - config.bounceRange * Math.cos(this.angleWithXRay),
        y: this.ball.pos.y + config.bounceRange * Math.sin(this.angleWithXRay)
      }
    }
    if (this.quadrant === quadrantTwo) {
      rangeBack = {
        x: this.ball.pos.x + config.bounceRange * Math.cos(this.angleWithXRay),
        y: this.ball.pos.y + config.bounceRange * Math.sin(this.angleWithXRay)
      }
      rangeHead = {
        x: this.ball.pos.x - config.bounceRange * Math.cos(this.angleWithXRay),
        y: this.ball.pos.y - config.bounceRange * Math.sin(this.angleWithXRay)
      }
    }
    if (this.quadrant === quadrantOne) {
      rangeBack = {
        x: this.ball.pos.x + config.bounceRange * Math.cos(this.angleWithXRay),
        y: this.ball.pos.y - config.bounceRange * Math.sin(this.angleWithXRay)
      }
      rangeHead = {
        x: this.ball.pos.x - config.bounceRange * Math.cos(this.angleWithXRay),
        y: this.ball.pos.y + config.bounceRange * Math.sin(this.angleWithXRay)
      }
    }
    // remove previous tweens if needed
    TWEEN.removeAll();
    // build the tween to go ahead
    var tweenHead	= new TWEEN.Tween(this.ball.pos)
      .to(rangeHead, 50)
      .easing(TWEEN.Easing.Elastic.Out)
    // build the tween to go backward
    var tweenBack	= new TWEEN.Tween(this.ball.pos)
      .to(rangeBack, 50)
      .easing(TWEEN.Easing.Elastic.Out)
    // after tweenHead do tweenBack
    tweenHead.chain(tweenBack)
    // after tweenBack do tweenHead, so it is cycling
    tweenBack.chain(tweenHead)

    // start the first
    tweenHead.start()

    bounceAnimate()

    function bounceAnimate(time) {
      stickyBall.dragMoveDraw(stickyBall.ball.pos)
      count++
      if (count < 10) {
        requestAnimationFrame(bounceAnimate)
      } else {
        stickyBall.ball = {
          pos: {
            x: config.xPox,
            y: config.yPox
          },
          radius: config.radius
        }
        stickyBall.ctx.clearRect(0, 0, stickyBall.ctx.canvas.width, stickyBall.ctx.canvas.height)
        stickyBall.drawBallOnCanvas(stickyBall.ball.pos.x* config.dpr, stickyBall.ball.pos.y* config.dpr, stickyBall.ball.radius* config.dpr, 0, Math.PI*2, stickyBall.ball.color)
      }
      TWEEN.update(time)
    }
  }
  dragMoveDraw(pos){
    if (this.isPosInPath(pos, { pos: this.ball.pos, radius: this.resetRadius }, posInCircle)) {
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
      this.drawBallOnCanvas(this.ball.pos.x* config.dpr, this.ball.pos.y* config.dpr, this.resetRadius* config.dpr, 0, Math.PI*2, this.ball.color)
      return
    }
    let curDis = distance(pos, this.ball.pos) //当前距离
    // 优化一下距离的变化
    if (curDis <= 20) {
      this.ball.radius = 13
    } else if (20 <curDis && curDis <= 40) {
      this.ball.radius = 10
    } else {
      this.ball.radius = 5
    }
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
    // 画两圆之间的连接线
    let angle = Math.atan(Math.abs(this.ball.pos.y - pos.y)/Math.abs(this.ball.pos.x - pos.x))
    let alpha = Math.acos((config.radius - this.ball.radius)/ distance(pos, this.ball.pos))
    let theta = Math.PI - alpha
    let pOneLeft, pOneRight, dragOneLeft, dragOneRight,startAngleOne ,startAngleTwo
    if (pos.x >= this.ball.pos.x && pos.y > this.ball.pos.y) { // 第四象限
      this.quadrant = quadrantFour
      // 以原来的小圆圆心为中心的坐标系中，拖拽圆的圆心在第四象限
      if (angle + theta <= Math.PI) {
        let chi = Math.PI - angle - theta
        pOneLeft = {
          x: this.ball.pos.x - this.ball.radius * Math.cos(chi),
          y: this.ball.pos.y + this.ball.radius * Math.sin(chi)
        }
      } else {
        let chi = angle + theta - Math.PI
        pOneLeft = {
          x: this.ball.pos.x - this.ball.radius * Math.cos(chi),
          y: this.ball.pos.y - this.ball.radius * Math.sin(chi)
        }
      }
      if (theta - alpha <= Math.PI/2) {
        let chi = theta - alpha
        pOneRight = {
          x: this.ball.pos.x + this.ball.radius * Math.cos(chi),
          y: this.ball.pos.y + this.ball.radius * Math.sin(chi)
        }
      } else {
        let chi = theta - alpha - Math.PI/2
        pOneRight = {
          x: this.ball.pos.x - this.ball.radius * Math.sin(chi),
          y: this.ball.pos.y - this.ball.radius * Math.cos(chi)
        }
      }
      if (angle + alpha >= Math.PI/2) {
        let chi = Math.PI - alpha -angle
        dragOneRight = {
          x: pos.x + config.radius * Math.cos(chi),
          y: pos.y - config.radius * Math.sin(chi)
        }
      } else {
        let chi = Math.PI/2 - angle - alpha
        dragOneRight = {
          x: pos.x - config.radius * Math.sin(chi),
          y: pos.y - config.radius * Math.cos(chi)
        }
      }
      if (angle + theta <= Math.PI) {
        let chi = Math.PI - angle - theta
        dragOneLeft = {
          x: pos.x - config.radius * Math.cos(chi),
          y: pos.y + config.radius * Math.sin(chi)
        }
      } else {
        let chi = angle + theta - Math.PI
        dragOneLeft = {
          x: pos.x - config.radius * Math.cos(chi),
          y: pos.y - config.radius * Math.sin(chi)
        }
      }
      startAngleOne = angle + theta
      startAngleTwo = Math.PI*2 - theta + angle
    }
    if (pos.x < this.ball.pos.x && pos.y >= this.ball.pos.y) {
      this.quadrant = quadrantThree // 第三象限
      if(theta - angle <= Math.PI/2) {
        let chi = theta - angle
        pOneLeft = {
          x: this.ball.pos.x - this.ball.radius * Math.cos(chi),
          y: this.ball.pos.y - this.ball.radius * Math.sin(chi)
        }
      } else {
        let chi = Math.PI - (theta - angle)
        pOneLeft = {
          x: this.ball.pos.x + this.ball.radius * Math.cos(chi),
          y: this.ball.pos.y - this.ball.radius * Math.sin(chi)
        }
      }
      if (angle + theta <= Math.PI) {
        let chi = Math.PI - theta - alpha
        pOneRight = {
          x: this.ball.pos.x + this.ball.radius * Math.cos(chi),
          y: this.ball.pos.y + this.ball.radius * Math.sin(chi)
        }
      } else {
        let chi = angle + theta - Math.PI
        pOneRight = {
          x: this.ball.pos.x + this.ball.radius * Math.cos(chi),
          y: this.ball.pos.y - this.ball.radius * Math.sin(chi)
        }
      }
      if (angle + theta >= Math.PI) {
        let chi = theta + angle - Math.PI
        dragOneRight = {
          x: pos.x + config.radius * Math.cos(chi),
          y: pos.y - config.radius * Math.sin(chi)
        }
      } else {
        let chi = Math.PI - angle - theta
        dragOneRight = {
          x: pos.x + config.radius * Math.cos(chi),
          y: pos.y + config.radius * Math.sin(chi)
        }
      }
      startAngleOne = theta - angle + Math.PI
      startAngleTwo = Math.PI - theta - angle
    }
    if (pos.x <= this.ball.pos.x && pos.y < this.ball.pos.y) {
      this.quadrant = quadrantTwo  // 第二象限
      if(theta + angle >= Math.PI) {
        let chi = theta + angle - Math.PI
        pOneLeft = {
          x: this.ball.pos.x + this.ball.radius * Math.cos(chi),
          y: this.ball.pos.y + this.ball.radius * Math.sin(chi)
        }
      } else {
        let chi = Math.PI - (theta + angle)
        pOneLeft = {
          x: this.ball.pos.x + this.ball.radius * Math.cos(chi),
          y: this.ball.pos.y - this.ball.radius * Math.sin(chi)
        }
      }
      if (theta - angle >= Math.PI/2) {
        let chi = Math.PI - (theta - angle)
        dragOneRight = {
          x: pos.x + config.radius * Math.cos(chi),
          y: pos.y + config.radius * Math.sin(chi)
        }
      } else {
        let chi = theta - angle
        dragOneRight = {
          x: pos.x - config.radius * Math.cos(chi),
          y: pos.y + config.radius * Math.sin(chi)
        }
      }
      startAngleOne = Math.PI + theta + angle
      startAngleTwo = Math.PI - (theta - angle)
    }
    if (pos.x > this.ball.pos.x && pos.y <= this.ball.pos.y) {
      this.quadrant = quadrantOne  // 第一象限
      if(theta - angle >= Math.PI/2) {
        let chi = Math.PI - (theta - angle )
        pOneLeft = {
          x: this.ball.pos.x - this.ball.radius * Math.cos(chi),
          y: this.ball.pos.y + this.ball.radius * Math.sin(chi)
        }
      } else {
        let chi = theta - angle
        pOneLeft = {
          x: this.ball.pos.x + this.ball.radius * Math.cos(chi),
          y: this.ball.pos.y + this.ball.radius * Math.sin(chi)
        }
      }
      if (theta + angle >= Math.PI) {
        let chi = theta + angle - Math.PI
        dragOneRight = {
          x: pos.x - config.radius * Math.cos(chi),
          y: pos.y + config.radius * Math.sin(chi)
        }
      } else {
        let chi = Math.PI - theta - angle
        dragOneRight = {
          x: pos.x - config.radius * Math.cos(chi),
          y: pos.y - config.radius * Math.sin(chi)
        }
      }
      startAngleOne = theta - angle
      startAngleTwo = 2*Math.PI - theta - angle
    }
    let control = {
      x: (this.ball.pos.x + pos.x)/2,
      y: (this.ball.pos.y + pos.y)/2
    }
    this.ctx.beginPath()
    this.ctx.strokeStyle = config.gray
    this.ctx.fillStyle = config.gray
    this.ctx.arc(this.ball.pos.x* config.dpr, this.ball.pos.y* config.dpr, this.ball.radius* config.dpr,startAngleOne, Math.PI + startAngleOne, false)
    this.ctx.quadraticCurveTo(control.x* config.dpr, control.y* config.dpr, dragOneRight.x* config.dpr, dragOneRight.y* config.dpr)
    this.ctx.arc(pos.x* config.dpr, pos.y* config.dpr, config.radius* config.dpr, startAngleTwo, Math.PI + startAngleTwo, false)
    this.ctx.quadraticCurveTo(control.x* config.dpr, control.y* config.dpr, pOneLeft.x* config.dpr, pOneLeft.y* config.dpr)
    this.ctx.stroke()
    this.ctx.fill()
  }
  /**
   * 获取鼠标相对于canvas的坐标
   * @param event
   * @returns {{x: number, y: number}}
   */
  getMousePos(event) {
    const mousePos = event.touches[0] || event.changedTouches[0]
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
  canvas.setAttribute('style', ';height:' + config.sh + 'px;width:' + config.sw + 'px;');
  canvas.width = config.sw * config.dpr;
  canvas.height = config.sh * config.dpr;
  stickyBall = new StickyBall(canvas.getContext('2d'))
  stickyBall.init()
}


