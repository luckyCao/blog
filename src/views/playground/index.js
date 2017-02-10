window.onload = function main(){
  const dw = document.getElementsByTagName('div')[0].clientWidth
  const dh = document.getElementsByTagName('div')[0].clientHeight
  const canvas = document.getElementById('canvas')
  canvas.width = dw
  canvas.height = dh

  canvas.addEventListener('touchstart', function(event){

  })
  canvas.addEventListener('touchmove', function(event){
    console.log('move')
    console.log({x: event.touches[0].clientX, y: event.touches[0].clientY})
  })
  canvas.addEventListener('touchend', function(event){
    console.log('end')
  })
}