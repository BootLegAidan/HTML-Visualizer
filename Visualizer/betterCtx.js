// let betterCtx = {
//   el: canvas,
//   ctx: canvas.get
// }
function fillStyle(color) {
  if (color.match(/(gray)\((.)+\)/)) {
    let value = color.match(/(gray)\((.+)\)/)[2]
    value = parseFloat(value)
    color = `rgb(${255*value},${255*value},${255*value})`
  }
  ctx.fillStyle = color
  return color
}
function fillRect(x,y,w,h) {
  ctx.fillRect(Math.floor(x),Math.floor(y),Math.ceil(w),Math.ceil(h))
}
function clearRect(x,y,w,h) {
  ctx.clearRect(Math.floor(x),Math.floor(y),Math.ceil(w),Math.ceil(h))
}
function fillCircle(x, y, r) {
  ctx.beginPath()
  ctx.arc(x,y,r,0,Math.PI*2)
  ctx.fill()
}
function moveTo(x, y) {
  ctx.moveTo(Math.floor(x),Math.floor(y))
}
function lineTo(x, y) {
  ctx.lineTo(Math.floor(x),Math.floor(y))
}
function center (dim='both',dir=1) {
  switch (dim) {
    case 'x': ctx.translate(dir*(canvas.width/2),0); break;
    case 'y': ctx.translate(0,dir*(canvas.height/2)); break;
    default: ctx.translate(dir*(canvas.width/2),dir*(canvas.height/2)); break;
  }
}
function flip (dim='both') {
  center(dim)
  switch (dim) {
    case 'x': ctx.scale(-1,1); break;
    case 'y': ctx.scale(1,-1); break;
    default: ctx.scale(-1,-1); break;
  }
  center(dim,-1)
}



function invX(x) {
  return canvas.width - x
}
function invY(y) {
  return canvas.height - y
}

function cenX(x) {
  return (canvas.width*0.5) + x
}
function cenY(y) {
  return (canvas.height*0.5) + y
}
// function debug(x) {
//   if ()
// }
// class BetterCtx {
//   constructor() {
//
//   }
//   moveTo (x, y) {
//     ctx.moveTo(Math.floor(x),Math.floor(y))
//   }
//
// }
