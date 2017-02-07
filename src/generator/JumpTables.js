/**
 * Created by luckyCao on 17/2/6.
 */
let instance = null
export default class JumpTables {
  constructor() {
    this.calculateJumpVelocities()
    this.calculateJumpTables()
  }
  static get instance() {
    if (instance === null) {
      instance = new JumpTables()
    }
    return instance
  }
  calculateJumpVelocities() {

  }
  calculateJumpTables() {

  }
}
