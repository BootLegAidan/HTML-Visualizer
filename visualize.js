// let sensitivity = 0.1 ; // Percent (0 - 100)
let dispStyle = 0;
let color = {
  value: {
    r: 255,
    g: 255,
    b: 255,
    a: 1
  },
  setFill(c=this.value) {
    ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${c.a})`
  },
  setStroke(c=this.value) {
    ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},${c.a})`
  },
  opacity(float,c=this.value) {
    return {
      r: c.r,
      g: c.g,
      b: c.b,
      a: c.a * float
    }
  },
  darken(float,c=this.value) {
    return {
      r: c.r*float,
      g: c.g*float,
      b: c.b*float,
      a: c.a
    }
  },
  invert(c=this.value) {
    return {
      r: 255-c.r,
      g: 255-c.g,
      b: 255-c.b,
      a: c.a
    }
  }
}
let currentSong = ''
let musicDir = 'C:/Users/Aidan/Music/'
let threshold = 0
// if (Math.random() < 0.05) {
//   alert('Find a new song')
// }

let offscreenC,ctx,canvas,started
let smth = 0.5
let bins = 1024
fft = new p5.FFT(smth,bins)
let tick = 0
let frames = {
  trackSize: 50,
  low: [],
  high: []
}

function start() {
  offscreenC=document.createElement('canvas');
  canvas = document.getElementById('canvas')
  ctx = canvas.getContext('2d')
  songList.sort((a,b)=>(a.title.toUpperCase()>b.title.toUpperCase()?1:-1))
  const songs = document.getElementById("songs")
  let songListEl = document.createElement('div')
  songListEl.id='songList'
  document.body.append(songListEl)
  songList.forEach((item, i) => {
    let songEl = document.createElement('div')
    songEl.classList.add('song')
    songEl.path = item.title
    songEl.innerHTML = `<span class="title">${item.title}</span>  -  <span>${item.artist}</span>`;
    songEl.addEventListener('click',(e) => {
      let songDir
      song.onended(()=>{})
      song.stop()
      if (e.path) {
        let pathIndex = 0
        while (e.path[pathIndex].className != 'song' && pathIndex < e.path.length) {
          pathIndex++
        }
        songDir = e.path[pathIndex]
      } else if (e.explicitOriginalTarget) {
        e.explicitOriginalTarget
        songDir = e.explicitOriginalTarget
      } else {
        if (e.target.tagName == 'SPAN') {
          songDir = e.target.parentNode
        } else {
          songDir = e.target
        }
      }
      song = loadSound(songInfo[songDir.path].path, success, failed, loading)
      currentSong = item
      fft.setInput(song)
      song.onended(()=>{
        console.log('done');
        newSong()
        fft.setInput(song)
        song.play()
      })
    })
    songListEl.append(songEl)
  })
  alerter_show()
  newSong()
  fft.setInput(song)
  onResize()
  started = true
  setInterval(()=>{
    document.getElementById('songTime').style.width = `${Math.floor(1000*(song.currentTime() / currentSong.length))/10}%`
  },1000)
  loadOptions()

}

function saveOptions() {
  localStorage.setItem('HTMLVizOptions',JSON.stringify({
    quality: parseInt(document.getElementById('bins').value),
    volume: Math.floor(song.getVolume()*100),
    smoothing: fft.smoothing*100,
    style: dispStyle,
    color: document.getElementById('color').value
  }))
}
function loadOptions() {
  let dat = JSON.parse(localStorage.getItem('HTMLVizOptions'))
  let b = document.getElementById('bins').value = ((isNaN(dat.quality) && 10) || dat.quality);
  fft.bins = bins = 2**b
  let v = document.getElementById('volume').value = Math.floor((isNaN(dat.volume) && 50) || dat.volume);
  song.setVolume(v/100)
  let s = document.getElementById('smoothing').value = Math.floor((isNaN(dat.smoothing) && 40) || dat.smoothing);
  fft.smoothing = s/100
  dispStyle = document.getElementById('style').value = Math.floor((isNaN(dat.style) && "0") || dat.style);
  let c = document.getElementById('color').value = ((dat.color.length != 7 && "#ffffff") || dat.color);
  color.value.r = parseInt(c[1]+c[2],16)
  color.value.g = parseInt(c[3]+c[4],16)
  color.value.b = parseInt(c[5]+c[6],16)
  document.querySelector(':root').style.setProperty('--primary', c);
  document.querySelector(':root').style.setProperty('--secondary', `rgb(${color.invert().r},${color.invert().g},${color.invert().b})`);
}

function onResize() {
  let [w,h] = [window.innerWidth,window.innerHeight]
  // console.log(w,h);
  offscreenC.width = canvas.width = w;
  offscreenC.height = canvas.height = h;

  canvas.style.width = canvas.width+'px';
  canvas.style.height = canvas.height+'px'
}
window.addEventListener('resize',onResize)
const songButton = document.getElementById('play')
const inp = document.getElementById("get-files");
const snacker = document.getElementById("snackbar");

let mic
let song
let Song
let lastSpect = []
let sliders = []
let state="song"


function setMic() {
  mic = new p5.AudioIn()
  mic.start()

  song.pause()
  fft.setInput(mic)
}
function newSong() {
  Song = songList[Math.floor(Math.random()*songList.length)].title
  song = loadSound(songInfo[Song].path, success, failed, loading)
  currentSong = songInfo[Song]
  song.onended(()=>{
    console.log('done');
    newSong()
    fft.setInput(song)
    song.play()
  })

}
function setup(Song = songList[Math.floor(Math.random()*songList.length)]){
}

const success = () => {
    if (song.isPlaying) {
      song.stop()
    }
    document.getElementById('songPlaying').innerHTML = `${currentSong.title}<br>${currentSong.artist}`
    song.play();
    song.setVolume(document.getElementById('volume').value/100)
}

const failed = () => {
    song.onended(()=>{})
    song.stop()
    snacker.innerHTML = "Failed to load song, reload page";
    console.log('FAILED');
}

const loading = (progress) => {
}

function typed() {
    if (song.isPlaying()) {
        song.stop()
    }
    else {
        song.play()
        fft.setInput(song)
        songButton.innerHTML='pause(mic)'
        alerter_hide()
    }
}

function togglePlay() {

    if(song.isPlaying()){
        song.pause()
        songButton.innerHTML='play'
        fft.setInput(mic)
        maxval=300
        fval=100
        state = "mic"
    }
    else{
        song.play()
        songButton.innerHTML='pause(mic)'
        maxval=255
        fval=180
        state="song"
    }
}



function draw() {
  if (!started) {
    return
  }
  tick++
  // fft.input.fftSize = bins*4
  // fft.input.fftSize = bins * 2
  // if ((tick % 5) == 0) {
  //   spectrum = []
  //   console.log('cleared');
  // }
  if ([41,42,43,44,45,59,60].includes(dispStyle)) {
    spectrum = fft.waveform()
  } else {
    spectrum = fft.analyze()
  }
  spectrum.length = bins


  // let mean = 0
  let sum = 0
  for (let i of spectrum) {
    sum += i
  }
  // mean /= bins

  // let h, temp, w, x, y, lastImgDat, chars;
  if (![11,27,28,34].includes(dispStyle)) {
    ctx.clearRect(0,0,canvas.width,canvas.height)
  }

  canvas.style.background = 'transparent';
  canvas.style.transform = ''
  switch (dispStyle) {
    case 7:
      canvas.style.background = 'linear-gradient(to bottom, #43cea2, #185a9d)'
    break; case 11:
      lastImgDat = ctx.getImageData(0,0,canvas.width,canvas.height)
      if (lastImgDat) {
        ctx.putImageData(lastImgDat,0,styleCfg[11].scrollSpeed)
      }
    break; case 23:
    case 24:
    case 25:
    case 26:
      canvas.style.transform = 'scaleY(-1)'
    break; case 27:
      offscreenC.getContext('2d').drawImage(canvas,0,0)
      ctx.translate(canvas.width/2,canvas.height/2)
      ctx.scale(0.999,0.999)
      ctx.rotate(Math.sin(tick/100)*0.01)
      ctx.translate(-canvas.width/2,-canvas.height/2)
      ctx.drawImage(offscreenC,0,0)
      ctx.resetTransform()
    break; case 28:
      offscreenC.getContext('2d').drawImage(canvas,0,0)
      ctx.translate(canvas.width/2,canvas.height/2)
      ctx.scale(0.99,0.99)
      // ctx.rotate(Math.sin(tick/100)*0.01)
      ctx.translate(-canvas.width/2,-canvas.height/2)
      ctx.drawImage(offscreenC,0,0)
      ctx.resetTransform()
    break; default:
  }
  ctx.lineCap = 'round'
  // ctx.strokeStyle = 'white'
  // ctx.fillStyle = 'white'
  ctx.lineWidth = 5;
  color.setFill()
  color.setStroke()
  if (dispStyle >= styles.length) {
    dispStyle = styles.length - 1
    document.getElementById('style').value = dispStyle
  }
  for(let i=0;i<bins;i++) {
    sliders[i] -= 0.5
    if (isNaN(sliders[i]) || sliders[i] < spectrum[i]) {
      sliders[i] = spectrum[i]
    }
    styles[dispStyle]({
      bin: spectrum[i],
      bins: bins,
      height: canvas.height/255,
      i: i,
      lastBin: (i - 1 < 0 ? 0 : spectrum[i-1]),
      lastSpectrum: lastSpect,
      maxSlider: sliders[i],
      minC: Math.min(canvas.height,canvas.width),
      nextBin: (i + 1 >= bins ? 0 : spectrum[i+1]),
      now: Date.now(),
      rads: (Math.PI*2)/bins,
      spectrum: spectrum,
      sum: sum,
      tickNum: tick,
      volume: song.getVolume(),
      width: canvas.width/bins,
    })
    ctx.resetTransform()
  }
  lastSpect = spectrum
  let fps = Math.floor(frameRate())
  if (tick % frames.trackSize == 0) {
    frames.low.shift()
    frames.high.shift()
  }

  // if (frames.low.length < 2) {
  //   frames.low.push(fps)
  // } else if (frames.low[1] > fps){
  //   frames.low[1] = fps
  // }
  // if (frames.high.length < 2) {
  //   frames.high.push(fps)
  // } else if (frames.high[1] < fps){
  //   frames.high[1] = fps
  // }
  // document.getElementById('frameRate').innerHTML = fps + 'FPS' + '<br>' + `
  // ` + frames.high[0] + ' - ' + frames.low[0]
}


function alerter_show() {
}

function alerter_hide() {
    snacker.className = ""
}

let reset = document.getElementById('reset')

function slides(){
    fval = document.getElementById("ranges").value
    reset.innerHTML=fval
}

function resets(){
    if(state==="song") fval = 180
    else fval = 160

    reset.innerHTML=fval
    document.getElementById("ranges").value=fval
}
