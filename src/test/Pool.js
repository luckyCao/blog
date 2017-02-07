import { expect } from 'chai'
import Pool from '../Helper/Pool'

describe('Pool', () => {
  let Sprite = class{
    constructor(height, width){
      this.height = height
      this.width = width
    }
  }
  it('check count after init', () => {
    let poolInstance = new Pool(Sprite, 16)
    expect(poolInstance.count).to.equal(16)
  })

  it('test count props after create 10 item', () => {
    let poolInstance = new Pool(Sprite, 16)
    let group = []
    for (let i = 0; i < 10; i++) {
      group.push(poolInstance.createItem())
    }
    expect(poolInstance.count).to.equal(6)
  })

  it('test createItem func', () => {
    let num = 1
    let poolInstance = new Pool(Sprite, 16, () => {
      return new Sprite(num++, 0)
    })
    expect(poolInstance.createItem().height).to.equal(16)
  })

  it('test destroyItem func', () => {
    let poolInstance = new Pool(Sprite, 16)
    let item = poolInstance.createItem()
    item.height = 100
    poolInstance.destroyItem(item)
    expect(poolInstance.createItem().height).to.equal(100)
  })

  it('test grow feature', () => {
    let poolInstance = new Pool(Sprite, 10)
    let group = []
    for (let i = 0; i < 11; i++) {
      group.push(poolInstance.createItem())
    }
    expect(poolInstance.poolSize).to.equal(11)
  })

  it('test count after create and destroy', () => {
    let poolInstance = new Pool(Sprite, 10)
    let group = []
    for (let i = 0; i < 11; i++) {
      group.push(poolInstance.createItem())
    }
    for (let i = 0; i < 5; i++) {
      poolInstance.destroyItem(group[i])
    }
    expect(poolInstance.count).to.equal(5)
  })
})