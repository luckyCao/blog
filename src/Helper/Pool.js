/**
 * Created by caolei on 2017/2/7.
 */
export default class Pool {
  /**
   *
   * @param classType Pool中存储的对象类型
   * @param size      Pool的length
   * @param newFunc   Pool中对象的构造函数
   * @param canGrow   Pool是否可增长
   */
  constructor(classType, size, newFunc = null, canGrow = true) {
    this.ClassType = classType
    this.newFunc = newFunc
    this.poolSize = 0 // pool的大小
    this.count = 0  // 记录pool中对象使用的索引
    this.canGrow = canGrow
    this.list = []
    for (let i = 0; i < size; i++) {
      this.list[this.count++] = this.newItem()
    }
  }
  /**
   * 创建一个新的对象
   * @returns {*}
   */
  newItem() {
    this.poolSize++
    return this.newFunc !== null ? this.newFunc() : new this.ClassType()
  }

  /**
   * 从pool中拿一个对象
   * @returns {*}
   */
  createItem() {
    if (this.count > 0) {
      return this.list[--this.count]
    }
    return this.canGrow ? this.newItem() : null
  }

  /**
   * 把不用的对象放入pool
   * @param item
   */
  destroyItem(item) {
    this.list[this.count++] = item
  }
}
