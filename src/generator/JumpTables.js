/**
 * Created by luckyCao on 17/2/6.
 */
let _instance = null
export default class JumpTables {
  constructor() {
    this.calculateJumpVelocities();
    this.calculateJumpTables();
  }
  static get instance() {
    if(_instance === null) {
      _instance = new JumpTables()
    }
    return _instance
  }
  calculateJumpVelocities() {

  }
  calculateJumpTables() {

  }
}