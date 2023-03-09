let sensitivity = 0.1 ; // Percent (0 - 100)
let dispStyle = 0;
let musicDir = 'C:/Users/Aidan/Music/'
let threshold = 0
if (Math.random() < 0.05) {
  alert('Find a new song')
}

let offscreenC,ctx,canvas,started
let smth = 0.75
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
  // song = loadSound(`${musicDir}${Song}.mp3`, success, failed, loading)
  // song._onended = newSong
  // mic = new p5.AudioIn()
  // mic.start()

  fft.setInput(song)
  // canvas.style.position='absolute'
  // canvas.style.top = '0px'
  onResize()
  started = true
}
// canvas.style.height = canvas.height+'px';
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


// let strength = 150
// let fval = 180
// let maxx = 0
// let maxval=255

let mic
let song
let Song
// let maxxspec
// let fft
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
  // song.onended(()=>{})
  // console.log(songInfo[Song]);
  song = loadSound(songInfo[Song].path, success, failed, loading)
  song.onended(()=>{
    console.log('done');
    newSong()
    fft.setInput(song)
    song.play()
  })

}
function setup(Song = songList[Math.floor(Math.random()*songList.length)]){
    // createCanvas(window.innerWidth,window.innerHeight)
    // background(0)

}

const success = () => {
    if (song.isPlaying) {
      song.stop()
    }

    document.getElementById('songPlaying').innerHTML = song.url.replace('.mp3','').replace(musicDir,'')
    // console.log('SUCCESS');
    // snacker.innerHTML = "Tap here to play";
    // snacker.onclick = () => {
    //     songButton.innerHTML = "Pause(mic)";
    //     alerter_hide();
    // }
    song.play();
    song.setVolume(document.getElementById('volume').value/100)
}

const failed = () => {
    song.onended(()=>{})
    song.stop()
    snacker.innerHTML = "Failed to load song, reload page";
    console.log('FAILED');
    // setInterval(newSong,500)
}

const loading = (progress) => {
    // snacker.innerHTML = `Loading... ${(progress * 100).toFixed(0)} %`;
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

let globalTemps = {
  36: {}
}

function draw() {
  if (!started) {
    return
  }
  tick++
  // ctx.fillStyle = 'black'
  // ctx.fillRect(0,0,canvas.width,canvas.height)
  // fft.input.fftSize = bins*4
  fft.input.fftSize = bins * 2
  spectrum = fft.analyze()

  let width = canvas.width/bins
  let maxH = canvas.height/255
  let rads = (Math.PI*2)/bins
  let offset = Math.min(canvas.height,canvas.width)
  let now = Date.now()

  let sum = 0
  let mean = 0
  for (let i of spectrum) {
    mean += i
  }
  mean /= bins

  let h, temp, w, x, y, lastImgDat, chars;
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
        ctx.putImageData(lastImgDat,0,canvas.height / 250)
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
    break; case 41:
    case 42:
    case 43:
    case 44:
    case 45:
      spectrum = fft.waveform()
    break; default:
  }
  ctx.lineCap = 'round'
  ctx.strokeStyle = 'white'
  ctx.fillStyle = 'white'
  ctx.lineWidth = 5;

  for(let i=0;i<bins;i++) {
    let height = spectrum[i]
    // if (i == 0) {
    //   ctx.fillText(height,50,50)
    // }
    let mean = ((height+lastSpect[i])/2)
    sum += height

    // if (sensitivity/100 >= height/255){
    //   height = (lastSpect[i]||1)-1
    // }
    // if (threshold >= height/255) {
    //   height = 0
    // }
    switch (dispStyle) {
      case 0:
        ctx.fillRect(Math.floor(i*width),canvas.height,Math.ceil(width),-height*maxH)
      break; case 1:
        // center('y')
        ctx.fillRect(Math.floor(i*width),(canvas.height/2)-(height*maxH*0.5),Math.ceil(width),height*maxH)
        // ctx.fillRect(Math.floor(i*width),maxH*255*0.5,Math.ceil(width),height*maxH)
      break; case 2:
        // ctx.scale(1,-1)
        if (i == 0) {
          ctx.beginPath()
          ctx.moveTo(0,canvas.height)
          ctx.lineTo(0,canvas.height-(height*maxH))
        }
        ctx.quadraticCurveTo(
          i*width,
          canvas.height-(height*maxH),
          (i+0.5)*width,
          canvas.height-(((height+spectrum[i+1])/2)*maxH)
        )
        if (i >= bins-1) {
          ctx.lineTo(canvas.width,canvas.height-(height*maxH))
          ctx.lineTo(canvas.width,canvas.height)
          ctx.fill()
        }
      break; case 3:
        ctx.translate(canvas.width/2,canvas.height/2)
        if (i == 0) {
          ctx.beginPath()
        }
        ctx.lineTo(Math.sin(rads*i)*height,Math.cos(rads*i)*height)
        if (i >= bins - 1) {
          ctx.fill()
          ctx.stroke()
        }
      break; case 4:
        ctx.fillStyle = `rgba(255,255,255,${(height/255)/4})`
        ctx.translate(canvas.width/2,canvas.height/2)
        ctx.rotate((rads/2)*i)
        ctx.beginPath()
        ctx.arc(offset/4,0,(offset/10)*(height/255),0,Math.PI*2)
        ctx.rotate(-(rads/2)*i*2)
        ctx.arc(offset/4,0,(offset/10)*(height/255),0,Math.PI*2)
        ctx.fill()
      break; case 5:
        ctx.translate(0,canvas.height/2)
        if (i == 0) {
          ctx.beginPath()
          ctx.moveTo(i*width,Math.sin((Date.now()/5000)+(Math.PI/(bins/8))*i)*(height*(maxH/3)))
        }
        ctx.lineTo(i*width,Math.sin((Date.now()/5000)+(Math.PI/(bins/8))*i)*(height*(maxH/3)))
        if (i >= bins - 1) {
          ctx.stroke()
        }
      break; case 6:
        ctx.translate(0,canvas.height/2)
        ctx.fillStyle = `#43cea2`
        ctx.fillRect(
          Math.floor(i*width),
          0,
          Math.ceil(width),
          (-height/(maxH/3))-(mean/2)
        )
        ctx.fillStyle = `#185a9d`
        ctx.fillRect(
          Math.floor(i*width),
          0,
          Math.ceil(width),
          (lastSpect[i]/(maxH/3))+(mean/2)
        )
        ctx.fillStyle = `#35A7A0`
        ctx.fillRect(Math.floor(i*width),0,Math.ceil(width),-(mean/2)/(maxH/3))
        ctx.fillStyle = `#23779E`
        ctx.fillRect(Math.floor(i*width),0,Math.ceil(width),(mean/2)/(maxH/3))
        ctx.fillStyle = `#2E94A0`
        ctx.fillRect(Math.floor(i*width),-(mean/4),Math.ceil(width),(mean/2)/(maxH/3))
      break; case 7:
        ctx.fillStyle = 'black'
        ctx.fillRect(
          Math.floor(i*width),
          0,
          Math.ceil(width),
          (canvas.height/2)-(height*(maxH/2))
        )
        ctx.fillRect(
          Math.floor(i*width),
          canvas.height,
          Math.ceil(width),
          -(canvas.height/2)+(height*(maxH/2))
        )
      break; case 8:
        ctx.translate(0,canvas.height/2)
        ctx.fillStyle='rgba(33, 41, 34, 0.15)'
        ctx.beginPath()
        ctx.arc(i*width,-canvas.height/3,height*(maxH/9),0,Math.PI*2)
        ctx.fill()

        ctx.fillStyle='rgba(62, 98, 89, 0.15)'
        ctx.beginPath()
        ctx.arc(i*width,0,height*(maxH/9),0,Math.PI*2)
        ctx.fill()

        ctx.fillStyle='rgba(174, 246, 199, 0.15)'
        ctx.beginPath()
        ctx.arc(i*width,canvas.height/3,height*(maxH/9),0,Math.PI*2)
        ctx.fill()
      break; case 9:
        ctx.translate(0,canvas.height/2)
        sliders[i] -= 0.5
        if (isNaN(sliders[i]) || sliders[i] < height) {
          sliders[i] = height
        }
        ctx.fillStyle = 'rgba(15,15,15,1)'
        ctx.fillRect(Math.floor(i*width),-height*maxH*0.5,Math.ceil(width),height*maxH)
        // ctx.fillRect(Math.floor(i*width),0,Math.ceil(width),height*maxH*0.5)

        ctx.fillStyle = 'red'
        ctx.fillRect(Math.floor(i*width),sliders[i]*maxH*0.5,Math.ceil(width),Math.ceil(width))
        ctx.fillRect(Math.floor(i*width),-sliders[i]*maxH*0.5,Math.ceil(width),-Math.ceil(width))
      break; case 10:
        x = i % (bins**0.5)
        y = Math.floor(i/(bins**0.5))
        w = canvas.width/(bins**0.5)
        h = canvas.height/(bins**0.5)
        ctx.fillStyle = `rgb(${mean},${lastSpect[i]},${height})`
        ctx.fillRect(Math.floor(x*w),Math.floor(y*h),Math.ceil(w),Math.ceil(h))
      break; case 11:
        h = canvas.height / 250
        w = canvas.width / bins
        // x = (tick % (canvas.width/w))*w;
        x = w * i
        // if (x == 0) {
        //   ctx.clearRect(0,0,canvas.width,canvas.height)
        // }
        // ctx.fillStyle = 'rgba(0,0,0,0.01)'
        // ctx.clearRect(x+(w*5),0,w*10,canvas.height)

        ctx.fillStyle = `rgb(${mean},${lastSpect[i]},${height})`
        ctx.fillRect(Math.floor(x),Math.floor(0),Math.ceil(w),Math.ceil(h))
      break; case 12:
        ctx.fillStyle = 'white'
        ctx.strokeStyle = 'white'

        ctx.save()
        for (let j of [-1,1]) {
          ctx.translate(canvas.width/2,canvas.height/2)
          ctx.scale(j,-1)
          ctx.translate(-canvas.width/2,-canvas.height/2)
          ctx.fillRect(Math.floor(i*width/2),0,Math.ceil(width/2),Math.ceil(spectrum[i]*maxH))
          ctx.resetTransform()
        }
        ctx.restore()
        // ctx.fillRect(canvas.width - (i*width/2),0,-width/2,spectrum[i]*maxH)
      break; case 13:
        ctx.lineWidth = 10;
        if (i == 0) {
          ctx.beginPath()
          ctx.moveTo(0,height*maxH)
          temp = height
        } else if (height < temp
          // && height > spectrum[i-1]
        ) {
          ctx.lineTo(i*width,height*maxH)
          temp = height
        } else {
          temp += 0.5
        }
        if (i >= bins - 2) {
          ctx.lineTo(i*width,height*maxH)
          ctx.stroke()
        }
      break; case 14:
        ctx.lineWidth = 10;
        if (i == 0) {
          ctx.beginPath()
          ctx.moveTo(0,canvas.height-(height*maxH))
          temp = height
        } else if (height < temp
          // && height > spectrum[i-1]
        ) {
          ctx.lineTo(i*width,canvas.height-(height*maxH))
          // ctx.quadraticCurveTo(
          //   i*width,
          //   canvas.height-(height*maxH),
          //   (i+0.5)*width,
          //   canvas.height-(((height+spectrum[i+1])/2)*maxH)
          // )
          temp = height
        }
        if (i >= bins - 2) {
          ctx.lineTo(i*width,canvas.height-(height*maxH))
          ctx.stroke()
        }
      break; case 15:
        center('y')
        if (i == 0) {
          ctx.beginPath()
          ctx.moveTo(i*width,Math.sin((Date.now()/5000)+(((Math.PI*3)/bins)*i)+((sum/bins)/32)+(height/200))*canvas.height/3)
        }
        ctx.lineTo(i*width,Math.sin((Date.now()/5000)+(((Math.PI*3)/bins)*i)+((sum/bins)/32)+(height/200))*canvas.height/3)
        if (i >= bins - 2) {
          ctx.stroke()
        }
        // fillCircle(i*width,Math.sin((((Math.PI*3)/bins)*i)+(height/128))*canvas.height/3,width/2)
        // fillRect(i*width,0,width,(canvas.height/3)*Math.sin(i/(bins*0.05)))
      break; case 16:
        width = canvas.height/bins
        maxH = (canvas.width/4)/255
        for (let j of [0,1]) {
          if (j == 1){
            flip('x')
          }
          fillCircle((width/2)+(height*maxH),(width/2)+(i*width),width/2)
          center('x')
          fillCircle(-(width/2)-(height*maxH),(width/2)+(i*width),width/2)
          ctx.resetTransform()
        }
      break; case 17:
        center('y')
        if (i == 0) {
          ctx.beginPath()
          ctx.moveTo(i*width,Math.sin((Date.now()/5000)+(((Math.PI*3)/bins)*i)+(height/200))*canvas.height/3)
        }
        ctx.lineTo(i*width,Math.sin((Date.now()/5000)+(((Math.PI*3)/bins)*i)+(height/200))*canvas.height/3)
        if (i >= bins - 2) {
          ctx.stroke()
        }
      break; case 18:
        ctx.fillStyle='rgba(255,255,255,0.025)'
        // ctx.fillRect(i*width,0,width,height)
        ctx.beginPath()
        ctx.moveTo((i-7)*width,0)
        ctx.lineTo((i-4)*width,height*maxH*0.5)
        ctx.lineTo((i-2.5)*width,height*maxH*0.75)
        ctx.lineTo(i*width,height*maxH)
        ctx.lineTo((i+2.5)*width,height*maxH*0.75)
        ctx.lineTo((i+4)*width,height*maxH*0.5)
        ctx.lineTo((i+7)*width,0)
        ctx.fill()
      break; case 19:
        ctx.fillStyle=`hsla(${(360/bins)*i},70%,70%,2.5%)`
        center('y')
        // ctx.fillRect(i*width,0,width,height)
        ctx.beginPath()
        ctx.moveTo((i-7)*width,0)
        ctx.lineTo((i-4)*width,height*(maxH/2)*0.5)
        ctx.lineTo((i-2.5)*width,height*(maxH/2)*0.75)
        ctx.lineTo(i*width,height*(maxH/2))
        ctx.lineTo((i+2.5)*width,height*(maxH/2)*0.75)
        ctx.lineTo((i+4)*width,height*(maxH/2)*0.5)
        ctx.lineTo((i+7)*width,0)
        ctx.lineTo((i+4)*width,-height*(maxH/2)*0.5)
        ctx.lineTo((i+2.5)*width,-height*(maxH/2)*0.75)
        ctx.lineTo(i*width,-height*(maxH/2))
        ctx.lineTo((i-2.5)*width,-height*(maxH/2)*0.75)
        ctx.lineTo((i-4)*width,-height*(maxH/2)*0.5)

        ctx.fill()
      break; case 20:
        center('y')
        fillRect(i*width*0.5,-height*maxH*0.5,width*0.25,height*maxH)
        fillRect(canvas.width-(i*width*0.5),-height*maxH*0.5,width*0.25,height*maxH)
      break; case 21:
        center('y')
        ctx.beginPath()
        ctx.moveTo(i*width*0.5,-height*maxH*0.5)
        ctx.lineTo(i*width*0.5,height*maxH*0.5)
        ctx.lineTo((i+1)*width*0.5,-spectrum[i+1]*maxH*0.5)
        ctx.lineTo((i+1)*width*0.5,spectrum[i+1]*maxH*0.5)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(canvas.width-(i*width*0.5),-height*maxH*0.5)
        ctx.lineTo(canvas.width-(i*width*0.5),height*maxH*0.5)
        ctx.lineTo(canvas.width-((i+1)*width*0.5),-spectrum[i+1]*maxH*0.5)
        ctx.lineTo(canvas.width-((i+1)*width*0.5),spectrum[i+1]*maxH*0.5)
        ctx.stroke()
      break; case 22:
        ctx.fillStyle = `hsl(${(360/bins)*i},70%,70%)`
        let nextH = (i < bins - 1 ? spectrum[i+1] : 0)
        center('y')
        ctx.beginPath()
        ctx.moveTo(Math.floor(i*width*0.5),-height*maxH*0.5)
        ctx.lineTo(Math.floor(i*width*0.5),height*maxH*0.5)
        ctx.lineTo(Math.floor((i+1)*width*0.5),nextH*maxH*0.5)
        ctx.lineTo(Math.floor((i+1)*width*0.5),-nextH*maxH*0.5)
        ctx.lineTo(Math.floor(i*width*0.5),-height*maxH*0.5)
        ctx.lineTo(Math.floor(i*width*0.5),height*maxH*0.5)
        ctx.fill()

        ctx.beginPath()
        ctx.moveTo(Math.floor(canvas.width-(i*width*0.5)),-height*maxH*0.5)
        ctx.lineTo(Math.floor(canvas.width-(i*width*0.5)),height*maxH*0.5)
        ctx.lineTo(Math.floor(canvas.width-((i+1)*width*0.5)),nextH*maxH*0.5)
        ctx.lineTo(Math.floor(canvas.width-((i+1)*width*0.5)),-nextH*maxH*0.5)
        ctx.lineTo(Math.floor(canvas.width-(i*width*0.5)),-height*maxH*0.5)
        ctx.lineTo(Math.floor(canvas.width-(i*width*0.5)),height*maxH*0.5)
        ctx.fill()
      break; case 23:
        temp = width
        ctx.fillStyle = '#fff'
        fillRect(width*i,0,width,height*maxH*0.75)
        ctx.fillStyle = '#bbb'
        ctx.beginPath()
        moveTo(i*width,height*maxH*0.75)
        lineTo((i+1)*width,height*maxH*0.75)
        lineTo((i+1.5)*width,(height*maxH*0.75)+(temp/2))
        lineTo((i+0.5)*width,(height*maxH*0.75)+(temp/2))
        ctx.fill()

        ctx.fillStyle = '#777'
        ctx.beginPath()
        moveTo((i+1)*width,height*maxH*0.75)
        lineTo((i+1)*width,spectrum[i+1]*maxH*0.75)
        lineTo((i+1.5)*width,(spectrum[i+1]*maxH*0.75)+(temp/2))
        lineTo((i+1.5)*width,(height*maxH*0.75)+(temp/2))
        ctx.fill()
      break; case 24:
        temp = width
        ;[spectrum,spectrum,spectrum,spectrum,spectrum,spectrum,spectrum,spectrum,spectrum,spectrum].forEach((item, j) => {
          j = 9 - j
          let h = item[i]
          ctx.fillStyle = `rgb(${250/(j+1)},${250/(j+1)},${250/(j+1)})`
          fillRect((width*i)+(temp*0.5*j),0,width,(h*maxH*0.75)+(temp*1.5*j))
          ctx.fillStyle = `rgb(${200/(j+1)},${200/(j+1)},${200/(j+1)})`
          ctx.beginPath()
          moveTo((i*width)+(temp*0.5*j),(h*maxH*0.75)+(temp*1.5*j))
          lineTo(((i+1)*width)+(temp*0.5*j),(h*maxH*0.75)+(temp*1.5*j))
          lineTo(((i+1.5)*width)+(temp*0.5*j),((h*maxH*0.75)+(temp/2))+(temp*1.5*j))
          lineTo(((i+0.5)*width)+(temp*0.5*j),((h*maxH*0.75)+(temp/2))+(temp*1.5*j))
          ctx.fill()
          ctx.fillStyle = `rgb(${150/(j+1)},${150/(j+1)},${150/(j+1)})`
          ctx.beginPath()
          moveTo(((i+1)*width)+(temp*0.5*j),(h*maxH*0.75)+(temp*1.5*j))
          lineTo(((i+1)*width)+(temp*0.5*j),(item[i+1]*maxH*0.75)+(temp*1.5*j))
          lineTo(((i+1.5)*width)+(temp*0.5*j),((item[i+1]*maxH*0.75)+(temp/2))+(temp*1.5*j))
          lineTo(((i+1.5)*width)+(temp*0.5*j),((h*maxH*0.75)+(temp/2))+(temp*1.5*j))
          ctx.fill()
        });
      break; case 25:
        temp = width
        ;[spectrum,spectrum,spectrum,spectrum,spectrum,spectrum,spectrum,spectrum,spectrum,spectrum].forEach((item, j) => {
          j = 9 - j
          let h = item[i]
          ctx.fillStyle = `hsl(${(360/bins)*i},${75/(j+1)}%,${75/(j+1)}%)`
          fillRect((width*i)+(temp*0.5*j),0,width,(h*maxH*0.75)+(temp*1.5*j))
          ctx.fillStyle = `hsl(${(360/bins)*i},${50/(j+1)}%,${50/(j+1)}%)`
          ctx.beginPath()
          moveTo((i*width)+(temp*0.5*j),(h*maxH*0.75)+(temp*1.5*j))
          lineTo(((i+1)*width)+(temp*0.5*j),(h*maxH*0.75)+(temp*1.5*j))
          lineTo(((i+1.5)*width)+(temp*0.5*j),((h*maxH*0.75)+(temp/2))+(temp*1.5*j))
          lineTo(((i+0.5)*width)+(temp*0.5*j),((h*maxH*0.75)+(temp/2))+(temp*1.5*j))
          ctx.fill()
          ctx.fillStyle = `hsl(${(360/bins)*i},${25/(j+1)}%,${25/(j+1)}%)`
          ctx.beginPath()
          moveTo(((i+1)*width)+(temp*0.5*j),(h*maxH*0.75)+(temp*1.5*j))
          lineTo(((i+1)*width)+(temp*0.5*j),(item[i+1]*maxH*0.75)+(temp*1.5*j))
          lineTo(((i+1.5)*width)+(temp*0.5*j),((item[i+1]*maxH*0.75)+(temp/2))+(temp*1.5*j))
          lineTo(((i+1.5)*width)+(temp*0.5*j),((h*maxH*0.75)+(temp/2))+(temp*1.5*j))
          ctx.fill()
        });
      break; case 26:
        temp = width
        ;[lastSpect,spectrum].forEach((item, j) => {
          j = 1 - j
          let h = item[i]
          ctx.fillStyle = `hsl(${(360/bins)*i},${75/(j+1)}%,${75/(j+1)}%)`
          fillRect((width*i)+(temp*0.5*j),0,width,(h*maxH*0.75)+(temp*1.5*j))
          ctx.fillStyle = `hsl(${(360/bins)*i},${50/(j+1)}%,${50/(j+1)}%)`
          ctx.beginPath()
          moveTo((i*width)+(temp*0.5*j),(h*maxH*0.75)+(temp*1.5*j))
          lineTo(((i+1)*width)+(temp*0.5*j),(h*maxH*0.75)+(temp*1.5*j))
          lineTo(((i+1.5)*width)+(temp*0.5*j),((h*maxH*0.75)+(temp/2))+(temp*1.5*j))
          lineTo(((i+0.5)*width)+(temp*0.5*j),((h*maxH*0.75)+(temp/2))+(temp*1.5*j))
          ctx.fill()
          ctx.fillStyle = `hsl(${(360/bins)*i},${25/(j+1)}%,${25/(j+1)}%)`
          ctx.beginPath()
          moveTo(((i+1)*width)+(temp*0.5*j),(h*maxH*0.75)+(temp*1.5*j))
          lineTo(((i+1)*width)+(temp*0.5*j),(item[i+1]*maxH*0.75)+(temp*1.5*j))
          lineTo(((i+1.5)*width)+(temp*0.5*j),((item[i+1]*maxH*0.75)+(temp/2))+(temp*1.5*j))
          lineTo(((i+1.5)*width)+(temp*0.5*j),((h*maxH*0.75)+(temp/2))+(temp*1.5*j))
          ctx.fill()
        });
      break; case 27:
      case 28:
        ctx.fillStyle = `rgb(${height},${height},${height})`
        temp = canvas.width/bins
        fillRect((canvas.width/2)-(i*temp*0.5),0,temp/2,10)
        fillRect((canvas.width/2)+(i*temp*0.5),0,temp/2,10)

        fillRect((canvas.width/2)-(i*temp*0.5),canvas.height-10,temp/2,10)
        fillRect((canvas.width/2)+(i*temp*0.5),canvas.height-10,temp/2,10)

        temp = canvas.height/bins
        fillRect(0,(canvas.height/2)-(i*temp*0.5),10,temp/2)
        fillRect(0,(canvas.height/2)+(i*temp*0.5),10,temp/2)

        fillRect(canvas.width-10,(canvas.height/2)-(i*temp*0.5),10,temp/2)
        fillRect(canvas.width-10,(canvas.height/2)+(i*temp*0.5),10,temp/2)
      break; case 29:
        fillCircle(
          i*(canvas.width/bins)
          ,(
            (1+
              (Math.sin(
                ((i)**0.5)+Math.cos(i*5)
              ) * Math.cos(i - 9))
            ) / 2
          )*canvas.height
          ,(height/255)*25
        )
      break; case 30:
        maxH = (Math.min(canvas.width,canvas.height)*0.9)/(bins*2)
        center()
        // ctx.beginPath()
        // ctx.arc(0,0,maxH*(bins-i),0,((Math.PI/255)*height))
        // ctx.stroke()
        // flip('x')
        // center('x')
        ctx.beginPath()
        ctx.arc(0,0,maxH*(bins-i),(Math.PI/2)-(Math.PI/255)*height,(Math.PI/2)+(Math.PI/255)*height)
        ctx.stroke()
        ctx.fillStyle = `rgb(${height},${height},${height})`
        ctx.fillRect((canvas.width/2)+(canvas.width/4)+(i*width*0.25),(canvas.height/2)-6.25,width,12.5)
      break; case 31:
        center()
        fillCircle(
          fakeRandom(i+87,tick/1000,i)*canvas.width*0.5
          ,fakeRandom(i+53,tick/1000,i)*canvas.height*0.5
          ,(height/255)*25
        )
      break; case 32:
        let steps = Math.sqrt(bins)
        let heightStep = canvas.height/steps
        let widthStep = canvas.width/steps;
        x = i % steps;
        y = Math.floor(i/steps)
        fillCircle((x+0.5)*widthStep,(y+0.5)*heightStep,Math.min(widthStep,heightStep)*(height/255))
      break; case 33:
        // ctx.fillStyle = `rgb(${255-((255/bins)*i)},${255-((255/bins)*i)},${255-((255/bins)*i)})`
        fillStyle(`gray(${height/255})`)
        // maxH = (Math.min(canvas.width,canvas.height)*0.9)/(bins*2)
        center()
        fillCircle(0,0,(Math.min(canvas.height,canvas.width)/bins/2)*(bins-i))
      break; case 34:
        ctx.translate((canvas.width/2),(canvas.height/2))
        ctx.rotate(tick/50)
        ctx.fillStyle = `rgb(${height},${height},${height})`
        ctx.fillRect((Math.min(canvas.width,canvas.height)/4)+(i*width*0.25),-6.25,width,12.5)
      break; case 35:
        chars = ' ..:::++++######'
        maxH = (canvas.height/255)
        height = (Math.floor(height/(width/2))*(width/2))
        fillStyle('hsla(0,0,100%,1)')
        ctx.font = `${width*2}px serif`;
        ctx.font = `${width*2}px VT323`;
        for (let j = 0; height >= 0; height -= width/2) {
          // ctx.fillText('#',i*width,(height)*maxH,width)
          // ctx.fillText(chars[Math.floor((height/255)*chars.length)],i*width,canvas.height-((height)*maxH),width)
          ctx.fillText(chars[Math.floor(new alea(i+''+height)()*chars.length)],i*width,canvas.height-((height)*maxH),width)
          // ctx.fillText(chars[Math.floor(new alea((i+Math.floor(now/100))+''+height)()*chars.length)],i*width,canvas.height-((height)*maxH),width)


        }
      break; case 36:
        chars = ' ..:::++++######'
        maxH = (canvas.height/255)
        height = (Math.floor(height/(width))*(width))
        fillStyle('hsla(0,0,100%,1)')
        ctx.font = `${width*2}px serif`;
        ctx.font = `${width*2}px VT323`;
        for (let j = 0; height >= 0; height -= width/2) {
          // ctx.fillText('#',i*width,(height)*maxH,width)
          // ctx.fillText(chars[Math.floor((height/255)*chars.length)],i*width,canvas.height-((height)*maxH),width)
          // ctx.fillText(chars[Math.floor(new alea(i+''+height)()*chars.length)],i*width,canvas.height-((height)*maxH),width)
          ctx.fillText(
            chars[
              Math.floor(
                new alea(
                  (i+Math.floor(now/100))+
                  ''+
                  height
                )()*chars.length
              )
            ],i*width,canvas.height-((height)*maxH),width
          )


        }
      break; case 37:
        center()
        ctx.fillStyle = `hsla(${(360/bins)*i},70%,70%,0.25)`
        pos = [
          ((new alea(i+'x')() * 2) - 1) * Math.sin(tick*0.001*(new alea(i+'xc')())),
          ((new alea(i+'y')() * 2) - 1) * Math.cos(tick*0.001*(new alea(i+'yc')()))
        ]
        fillCircle(
          pos[0] * canvas.width/2,
          pos[1] * canvas.height/2,
          (height/255)*25
        )
      break; case 38:
        center()
        ctx.fillStyle = `rgba(255,255,255,0.25)`
        pos = [
          ((new alea(i+'x')() * 2) - 1) * Math.sin(tick*0.001*(new alea(i+'xc')())),
          ((new alea(i+'y')() * 2) - 1) * Math.cos(tick*0.001*(new alea(i+'yc')()))
        ]
        fillCircle(
          pos[0] * canvas.width/2,
          pos[1] * canvas.height/2,
          (height/255)*25
        )
      break; case 39:
        center()
        ctx.fillStyle = `rgba(255,255,255,0.25)`
        pos = [
          (((new alea(i+'x')() * 2) - 1) * Math.sin(tick*0.001*(new alea(i+'xc')()))),
          (((new alea(i+'y')() * 2) - 1) * Math.cos(tick*0.001*(new alea(i+'yc')())))
        ]
        fillCircle(
          (pos[0] * canvas.width/2) + (Math.random()*(height/255)*5),
          (pos[1] * canvas.height/2) +  (Math.random()*(height/255)*5),
          (height/255)*25
        )
      break; case 40:
        center()
        maxH = (Math.min(canvas.width,canvas.height)/255)/2
        ctx.beginPath()
        moveTo(
          Math.sin((Math.PI/bins)*i)*height*maxH,
          Math.cos((Math.PI/bins)*i)*height*maxH
        )
        lineTo(
          Math.sin((Math.PI/bins)*(i+1))*spectrum[i+1]*maxH,
          Math.cos((Math.PI/bins)*(i+1))*spectrum[i+1]*maxH
        )
        ctx.stroke()
        ctx.beginPath()
        moveTo(
          -Math.sin((Math.PI/bins)*i)*height*maxH,
          Math.cos((Math.PI/bins)*i)*height*maxH
        )
        lineTo(
          -Math.sin((Math.PI/bins)*(i+1))*spectrum[i+1]*maxH,
          Math.cos((Math.PI/bins)*(i+1))*spectrum[i+1]*maxH
        )
        ctx.stroke()
      break; case 41:
        center('y')
        ctx.fillStyle = 'white'
        gap = canvas.height/4
        if (i % 2 == 0) {
          for (let j = -1; j <= 1; j++) {
            ctx.beginPath()
            ctx.moveTo(i*width,(spectrum[i]*gap*3)+(gap*j))
            ctx.lineTo((i+1)*width, (spectrum[i+1]*gap*3)+(gap*j))
            ctx.lineTo((i+2)*width, (spectrum[i+2]*gap*3)+(gap*j))

            ctx.stroke()
          }
        }
      break; case 42:
        ctx.fillStyle = 'white'
        fillRect(i*width,0,width,(canvas.height/2)+(spectrum[i]*canvas.height*0.25))
      break; case 43:
        ctx.fillStyle = 'white'
        fillRect(i*width,(canvas.height*0.25)+(spectrum[i]*canvas.height*0.25),width,(canvas.height/2)+(spectrum[i]*canvas.height*0.25))
      break; case 44:
        ctx.fillStyle = 'white'
        fillRect(i*width,(canvas.height*0.25)+(spectrum[i]*canvas.height*0.25),width,(canvas.height/2)-(spectrum[i]*canvas.height*0.5))
      break; case 45:
        // center('y')
        ctx.fillStyle = 'white'
        if (i == 0) {
          ctx.stroke()
          ctx.beginPath()
          moveTo(i*width,(height*canvas.height*0.5)+(canvas.height/2))
        }
        height = (height + lastSpect[i])/2
        nextHeight = (spectrum[i-1]+lastSpect[i-1])/2
        // lineTo(i*width,(height*canvas.height*0.5)+(canvas.height/2))
        ctx.quadraticCurveTo(
          (i-0.5) * width,    ((height+nextHeight)*0.5*canvas.height*0.5) + (canvas.height/2),
          i * width,    (height*canvas.height*0.5) + (canvas.height/2)
        )
      break; default:
        dispStyle--
        document.getElementById('style').value = dispStyle
    }
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

//HTML
//<-------------------------------->
// inp.onchange = (event) => {
//     console.log(event)
//     song.stop()
//     alerter_show()
//     song = loadSound(event.target.files[0], typed, failed, loading)
//     const dropdown = document.createElement("option")
//     const songname = event.target.files[0].name
//     dropdown.text = songname.substr(0, 8)
//     songs.add(dropdown)
// }

// songs.oninput = (event) => {
//     alerter_show()
//     console.log(event.target.value)
//     song.stop()
//     song = loadSound(`${musicDir}${event.target.value}.mp3`, typed, failed, loading)
// }

function alerter_show() {
    // snacker.className = "show"
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
