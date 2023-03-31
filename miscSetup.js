let globalTemps = {
  13: {
    val: 0,
    index: 0
  },
  36: {},
  46: [],
  47: [],
  53: {
    max: undefined,
    num: 0
  },
  54: [],
  55: {
    vels: [],
    pos: []
  },
  56: {
    vel: [],
    pos: [],
    goal: [],
    goalCompleted: []
  },
  57: {
    vel: [],
    pos: []
  }
}
const styleCfg = {
  11: {
    scrollSpeed: 10
  },
  24: {
    layers: 10
  },
  36: {
    scrollSpeed: 25
  },
  46: {
    iterations: 25
  },
  47: {
    iterations: 15,
    saveFrequency: 4
  },
  56: {
    goalCompleteDist: 25
  },
  57: {
    enablePush: true,
    pushDist: 75
  }
}
let mouse = {
  x: 0,
  y: 0,
  down: false
}
document.addEventListener('mousemove',(e)=>{
  mouse.x = e.clientX,
  mouse.y = e.clientY
})
document.addEventListener('mousedown',(e)=>{
  mouse.down = true
})
document.addEventListener('mouseup',(e)=>{
  mouse.down = false
})

function fakeRandom(x=0,y=0,i,samples=5) {
  let segments = [
    (x,y) => Math.sin(x-y),
    (x,y) => Math.sin(x+y),
    (x,y) => Math.sin((x**0.5)+(y**0.5))
    // (x,y) => Math.sin(x*y),
    // (x,y) => Math.sin(x/y)
  ]
  let result = 0

  let rand = new alea(i)
  for (let i = 0; i < samples; i++) {
    result += segments[Math.floor(rand()*segments.length)](x,y)
  }
  result /= samples

  if (fakeRandomResults.length <= 1000) {
    fakeRandomResults.push(result)
    // fakeRandomResults.shift()
    // fakeRandomResults.shift()
  } else {
    fakeRandomResults.shift()
  }
  this.calls++
  return result
}
fakeRandom.calls = 0
fakeRandomResults = []

function minMax(arr,storeResults=false) {
  if (!storeResults) {

    this.min = undefined
    this.max = undefined;
  }
  for (let i of arr) {
    if (isNaN(this.min) || i < this.min) {this.min = i}
    if (isNaN(this.max) || i > this.max) {this.max = i}
  }
  return `Min: ${min} \n Max: ${max}`
}

function DownloadCanvasAsImage(){
    let downloadLink = document.createElement('a');
    downloadLink.setAttribute('download', 'CanvasAsImage.png');
    let dataURL = canvas.toDataURL('image/png');
    let url = dataURL.replace(/^data:image\/png/,'data:application/octet-stream');
    downloadLink.setAttribute('href', url);
    downloadLink.click();
}
