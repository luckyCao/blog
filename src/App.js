import 'pixi.js'
import 'p2'
import Phaser from 'phaser'
import { GAME_WIDTH, GAME_HEIGHT } from 'Params'
import Boot from 'States/Boot'
import Preload from 'States/Preload'
import Play from 'States/Play'

let game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, 'game')

game.state.add('Boot', Boot)
game.state.add('Preload', Preload)
game.state.add('Play', Play)
game.state.start('Boot')




