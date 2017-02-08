/**
 * 判断点是否在圆里面
  * @param circle
 */
export function distance(pos1, pos2) {
  return Math.pow(Math.pow((pos1.x - pos2.x), 2) + Math.pow((pos1.y - pos2.y), 2), 1 / 2)
}
export function posInCircle(circle) {
  return pos => distance(pos, circle.pos) < (circle.radius + 10)
}


