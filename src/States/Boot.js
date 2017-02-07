import Phaser from 'phaser'

export default class Boot extends Phaser.State {
  create() {
    this.state.start('Preload')
  }
}
