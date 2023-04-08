let styles = [
  /* zero
  ████
  █  █
  █  █
  █  █
  ████
  */
  ({ bin, i, height, width })=>{ // 0
    fillRect(i*width,canvas.height,width,-bin*height)
  }, // 0

  ({i, width, bin, height})=>{ // 1
    fillRect(i*width,(canvas.height/2)-(bin*height*0.5),width,bin*height)
  }, // 1

  ({i, bin, height, width, nextBin})=>{ // 2
    if (i == 0) {
      ctx.fill()
      ctx.beginPath()
      moveTo(0,canvas.height)
    }
    ctx.quadraticCurveTo(
      i*width,
      invY(bin*height),
      (i+0.5)*width,
      invY(((bin+nextBin)/2)*height)
    )
    if (i >= bins-1) {
      lineTo(canvas.width,invY(bin*height))
      lineTo(canvas.width,canvas.height)
    }
  }, // 2

  ({i, rads, bin, minC})=>{ // 3
    // ctx.translate(canvas.width/2,canvas.height/2)
    if (i == 0) {
      ctx.fill()
      // ctx.stroke()
      ctx.beginPath()
    }
    lineTo(cenX(Math.sin(rads*i)*(bin*(minC/255)*0.4)),cenY(Math.cos(rads*i)*(bin*(minC/255)*0.4)))
  }, // 3

  ({bin, rads, i, minC})=>{ // 4
    color.setFill(color.opacity((bin/255)/4))
    // ctx.fillStyle = `rgba(255,255,255,${(bin/255)/4})`
    fillCircle(cenX(Math.sin((rads/2)*i)*minC/4),cenY(Math.cos((rads/2)*i)*minC/4),(minC/10)*(bin/255))
    fillCircle(cenX(Math.sin(-(rads/2)*i)*minC/4),cenY(Math.cos(-(rads/2)*i)*minC/4),(minC/10)*(bin/255))
  }, // 4

  ({i, width, now, bin, height})=>{ // 5
    if (i == 0) {
      ctx.stroke()
      ctx.beginPath()
      moveTo(i*width,cenY(Math.sin((now/5000)+(Math.PI/(bins/8))*i)*(bin*(height/3))))
    }
    lineTo(i*width,cenY(Math.sin((now/5000)+(Math.PI/(bins/8))*i)*(bin*(height/3))))
  }, // 5

  ({i, width, bin, height})=>{ // 6
    ctx.fillStyle = `rgba(${['255,0,0','0,255,0','0,0,255'][i % 3]},5%)`
    fillCircle(i*width,cenY(0),bin*height*0.1)
  }, // 6

  ({i, width, bin, height})=>{ // 7
    ctx.fillStyle = 'black'
    fillRect(
      i*width,
      0,
      width,
      (255-bin)*height*0.5
    )
    fillRect(
      i*width,
      invY(0),
      width,
      -(255-bin)*height*0.5
    )
  }, // 7

  ({i, width, bin, height})=>{ // 8
    ctx.fillStyle='rgba(255, 0, 0, 0.05)'
    fillCircle(i*width,cenY(-canvas.height/3),bin*(height/9))
    ctx.fillStyle='rgba(0, 255, 0, 0.05)'
    fillCircle(i*width,cenY(0),bin*(height/9))
    ctx.fillStyle='rgba(0, 0, 255, 0.05)'
    fillCircle(i*width,cenY(canvas.height/3),bin*(height/9))
  } // 8

  ,({i, bin, width, height, maxSlider, bins})=>{ // 9
    ctx.fillStyle = `hsl(${(360/bins)*i},30%,30%)`
    fillRect(i*width,cenY(-bin*height*0.5),width,bin*height)

    ctx.fillStyle = 'white'
    fillRect(i*width,cenY(maxSlider*height*0.5),width,width)
    fillRect(i*width,cenY(-maxSlider*height*0.5),width,-width)
  } // 9
  /* ten
   █  ████
  ██  █  █
   █  █  █
   █  █  █
   █  ████
  */
  ,({i, bins, bin, lastBin, nextBin})=>{ // 10
    let x = i % (bins**0.5)
    let y = Math.floor(i/(bins**0.5))
    let w = canvas.width/(bins**0.5)
    let h = canvas.height/(bins**0.5)
    ctx.fillStyle = `rgb(${lastBin},${bin},${nextBin})`
    fillRect(x*w,y*h,w,h)
  } // 10

  ,({bins,i,bin,width})=>{ // 11
    let h = canvas.height / 250
    color.setFill(color.darken((bin)/255))
    fillRect(i*width,0,width,styleCfg[11].scrollSpeed)
  } // 11

  ,({i,width,bin,height})=>{ // 12
    fillRect(i*width/2,invY(0),width/2,-bin*height)
    fillRect(invX(i*width/2),invY(0),width/2,-bin*height)
  } // 12

  ,({i, bin, height, width})=>{ // 13
    if (i == 0) {
      globalTemps[13] = {
        val: bin,
        index: i
      }
    }
    if (bin <= globalTemps[13].val) {
      fillRect((i+(globalTemps[13].index))*0.5*width,invY((bin+globalTemps[13].val)*0.5*height),10,10)
      fillRect(i*width,invY(bin*height),10,10)
      globalTemps[13] = {
        val: bin,
        index: i
      }
    }
  } // 13

  ,({i,width,bin,height,spectrum})=>{ // 14
    color.setFill()
    fillRect(i*width,invY(0),width,-bin*height*0.5)

    color.setFill(color.invert())
    fillRect((i)*width,invY((bin*height*0.5)+(spectrum[bins-i]*height*0.5)),width,spectrum[bins-i]*height*0.5)
  } // 14

  ,({i,width,now,bins,sum,bin})=>{ // 15
    if (i == 0) {
      ctx.stroke()
      ctx.beginPath()
      moveTo(i*width,cenY(Math.sin((now/5000)+(((Math.PI*3)/bins)*i)+((sum/bins)/32)+(bin/200))*canvas.height/3))
    }
    lineTo(i*width,cenY(Math.sin((now/5000)+(((Math.PI*3)/bins)*i)+((sum/bins)/32)+(bin/200))*canvas.height/3))
  } // 15

  ,({height,bin,width, i})=>{ // 16
    let h = canvas.height/bins
    let w = canvas.width/255
    for (let j of [0,1]) {
      if (j == 1){
        flip('x')
      }
      fillCircle((h/2)+(bin*w*0.25),(h/2)+(i*h),h/2)
      center('x')
      fillCircle(-(h/2)-(bin*w*0.25),(h/2)+(i*h),h/2)
      ctx.resetTransform()
    }
  } // 16

  ,({i,width,now,bins,bin})=>{ // 17
    if (i == 0) {
      ctx.stroke()
      ctx.beginPath()
      moveTo(i*width,cenY(Math.sin((now/5000)+(((Math.PI*3)/bins)*i)+(bin/200))*canvas.height/3))
    }
    lineTo(i*width,cenY(Math.sin((now/5000)+(((Math.PI*3)/bins)*i)+(bin/200))*canvas.height/3))
    if (i >= bins - 2) {
    }
  } // 17

  ,({i,width,bin,height})=>{ // 18
    color.setFill(color.opacity(0.025))
    ctx.beginPath()
    moveTo((i-7)*width,0)
    lineTo((i-4)*width,bin*height*0.5)
    lineTo((i-2.5)*width,bin*height*0.75)
    lineTo(i*width,bin*height)
    lineTo((i+2.5)*width,bin*height*0.75)
    lineTo((i+4)*width,bin*height*0.5)
    lineTo((i+7)*width,0)
    ctx.fill()
  } // 18

  ,({bins,i,bin,height,width})=>{ // 19
    ctx.fillStyle=`hsla(${(360/bins)*i},70%,70%,2.5%)`
    ctx.beginPath()
    moveTo((i-7)*width,cenY(0))
    lineTo((i-4)*width,cenY(bin*(height/2)*0.5))
    lineTo((i-2.5)*width,cenY(bin*(height/2)*0.75))
    lineTo(i*width,cenY(bin*(height/2)))
    lineTo((i+2.5)*width,cenY(bin*(height/2)*0.75))
    lineTo((i+4)*width,cenY(bin*(height/2)*0.5))
    lineTo((i+7)*width,cenY(0))
    lineTo((i+4)*width,cenY(-bin*(height/2)*0.5))
    lineTo((i+2.5)*width,cenY(-bin*(height/2)*0.75))
    lineTo(i*width,cenY(-bin*(height/2)))
    lineTo((i-2.5)*width,cenY(-bin*(height/2)*0.75))
    lineTo((i-4)*width,cenY(-bin*(height/2)*0.5))
    ctx.fill()
  } // 19
  /* twenty
  ████  ████
     █  █  █
  ████  █  █
  █     █  █
  ████  ████
  */
  ,({i,width,bin,height})=>{ // 20
    fillRect(i*width*0.5,cenY(-bin*height*0.5),height*0.25,bin*height)
    fillRect(invX(i*width*0.5),cenY(-bin*height*0.5),width*0.25,bin*height)
  } // 20

  ,({i,width,height,bin,nextBin})=>{ // 21
    ctx.beginPath()
    moveTo(i*width*0.5,cenY(-bin*height*0.5))
    lineTo(i*width*0.5,cenY(bin*height*0.5))
    lineTo((i+1)*width*0.5,cenY(-nextBin*height*0.5))
    lineTo((i+1)*width*0.5,cenY(nextBin*height*0.5))
    ctx.stroke()

    ctx.beginPath()
    moveTo(canvas.width-(i*width*0.5),cenY(-bin*height*0.5))
    lineTo(canvas.width-(i*width*0.5),cenY(bin*height*0.5))
    lineTo(canvas.width-((i+1)*width*0.5),cenY(-nextBin*height*0.5))
    lineTo(canvas.width-((i+1)*width*0.5),cenY(nextBin*height*0.5))
    ctx.stroke()
  } // 21

  ,({i, width, bin, height, bins, nextBin})=>{ // 22
    ctx.fillStyle = `hsl(${(360/bins)*i},70%,70%)`
    // let nextH = (i < bins - 1 ? spectrum[i+1] : 0)
    // center('y')
    ctx.beginPath()
    moveTo(i*width*0.5,cenY(-bin*height*0.5))
    lineTo(i*width*0.5,cenY(bin*height*0.5))
    lineTo((i+1)*width*0.5,cenY(nextBin*height*0.5))
    lineTo((i+1)*width*0.5,cenY(-nextBin*height*0.5))
    lineTo(i*width*0.5,cenY(-bin*height*0.5))
    lineTo(i*width*0.5,cenY(bin*height*0.5))
    ctx.fill()

    ctx.beginPath()
    moveTo(invX(i*width*0.5),cenY(-bin*height*0.5))
    lineTo(invX(i*width*0.5),cenY(bin*height*0.5))
    lineTo(invX((i+1)*width*0.5),cenY(nextBin*height*0.5))
    lineTo(invX((i+1)*width*0.5),cenY(-nextBin*height*0.5))
    lineTo(invX(i*width*0.5),cenY(-bin*height*0.5))
    lineTo(invX(i*width*0.5),cenY(bin*height*0.5))
    ctx.fill()
  } // 22

  ,({width,i,bin,height,nextBin})=>{ // 23
    // temp = width
    color.setFill()
    fillRect(width*i,0,width,bin*height*0.75)
    color.setFill(color.darken(0.66))
    ctx.beginPath()
    moveTo(i*width,bin*height*0.75)
    lineTo((i+1)*width,bin*height*0.75)
    lineTo((i+1.5)*width,(bin*height*0.75)+(width/2))
    lineTo((i+0.5)*width,(bin*height*0.75)+(width/2))
    ctx.fill()

    color.setFill(color.darken(0.33))
    ctx.beginPath()
    moveTo((i+1)*width,bin*height*0.75)
    lineTo((i+1)*width,nextBin*height*0.75)
    lineTo((i+1.5)*width,(nextBin*height*0.75)+(width/2))
    lineTo((i+1.5)*width,(bin*height*0.75)+(width/2))
    ctx.fill()
  } // 23

  ,({width,i,bin,height,nextBin})=>{ // 24
    // temp = width
    for (let j = styleCfg[24].layers; j > 0; j--) {
      color.setFill(color.darken(1-(j/styleCfg[24].layers)))
      fillRect((width*i)+(width*0.5*j),0,width,(bin*height*0.75)+(width*1.5*j))
      color.setFill(color.darken(0.66,color.darken(1-(j/styleCfg[24].layers))))
      ctx.beginPath()
      moveTo((i*width)+(width*0.5*j),(bin*height*0.75)+(width*1.5*j))
      lineTo(((i+1)*width)+(width*0.5*j),(bin*height*0.75)+(width*1.5*j))
      lineTo(((i+1.5)*width)+(width*0.5*j),((bin*height*0.75)+(width/2))+(width*1.5*j))
      lineTo(((i+0.5)*width)+(width*0.5*j),((bin*height*0.75)+(width/2))+(width*1.5*j))
      ctx.fill()
      color.setFill(color.darken(0.33,color.darken(1-(j/styleCfg[24].layers))))
      ctx.beginPath()
      moveTo(((i+1)*width)+(width*0.5*j),(bin*height*0.75)+(width*1.5*j))
      lineTo(((i+1)*width)+(width*0.5*j),(nextBin*height*0.75)+(width*1.5*j))
      lineTo(((i+1.5)*width)+(width*0.5*j),((nextBin*height*0.75)+(width/2))+(width*1.5*j))
      lineTo(((i+1.5)*width)+(width*0.5*j),((bin*height*0.75)+(width/2))+(width*1.5*j))
      ctx.fill()
    }
  } // 24

  ,({width,i,bin,height,nextBin,bins})=>{ // 25
    // temp = width
    for (let j = styleCfg[24].layers; j > 0; j--) {
      ctx.fillStyle = `hsl(${(360/bins)*i},${75/(j+1)}%,${75/(j+1)}%)`
      fillRect((width*i)+(width*0.5*j),0,width,(bin*height*0.75)+(width*1.5*j))
      ctx.fillStyle = `hsl(${(360/bins)*i},${50/(j+1)}%,${50/(j+1)}%)`
      ctx.beginPath()
      moveTo((i*width)+(width*0.5*j),(bin*height*0.75)+(width*1.5*j))
      lineTo(((i+1)*width)+(width*0.5*j),(bin*height*0.75)+(width*1.5*j))
      lineTo(((i+1.5)*width)+(width*0.5*j),((bin*height*0.75)+(width/2))+(width*1.5*j))
      lineTo(((i+0.5)*width)+(width*0.5*j),((bin*height*0.75)+(width/2))+(width*1.5*j))
      ctx.fill()
      ctx.fillStyle = `hsl(${(360/bins)*i},${25/(j+1)}%,${25/(j+1)}%)`
      ctx.beginPath()
      moveTo(((i+1)*width)+(width*0.5*j),(bin*height*0.75)+(width*1.5*j))
      lineTo(((i+1)*width)+(width*0.5*j),(nextBin*height*0.75)+(width*1.5*j))
      lineTo(((i+1.5)*width)+(width*0.5*j),((nextBin*height*0.75)+(width/2))+(width*1.5*j))
      lineTo(((i+1.5)*width)+(width*0.5*j),((bin*height*0.75)+(width/2))+(width*1.5*j))
      ctx.fill()
    }
  } // 25

  ,({width,i,bin,height,nextBin,lastBin})=>{ // 26
    for (let j = styleCfg[24].layers; j > 0; j--) {
      ctx.fillStyle = `rgb(${lastBin/(j+1)},${bin/(j+1)},${nextBin/(j+1)})`
      fillRect((width*i)+(width*0.5*j),0,width,(bin*height*0.75)+(width*1.5*j))
      ctx.fillStyle = `rgb(${(lastBin*0.66)/(j+1)},${(bin*0.66)/(j+1)},${(nextBin*0.66)/(j+1)})`
      ctx.beginPath()
      moveTo((i*width)+(width*0.5*j),(bin*height*0.75)+(width*1.5*j))
      lineTo(((i+1)*width)+(width*0.5*j),(bin*height*0.75)+(width*1.5*j))
      lineTo(((i+1.5)*width)+(width*0.5*j),((bin*height*0.75)+(width/2))+(width*1.5*j))
      lineTo(((i+0.5)*width)+(width*0.5*j),((bin*height*0.75)+(width/2))+(width*1.5*j))
      ctx.fill()
      ctx.fillStyle = `rgb(${(lastBin*0.33)/(j+1)},${(bin*0.33)/(j+1)},${(nextBin*0.33)/(j+1)})`
      ctx.beginPath()
      moveTo(((i+1)*width)+(width*0.5*j),(bin*height*0.75)+(width*1.5*j))
      lineTo(((i+1)*width)+(width*0.5*j),(nextBin*height*0.75)+(width*1.5*j))
      lineTo(((i+1.5)*width)+(width*0.5*j),((nextBin*height*0.75)+(width/2))+(width*1.5*j))
      lineTo(((i+1.5)*width)+(width*0.5*j),((bin*height*0.75)+(width/2))+(width*1.5*j))
      ctx.fill()
    }
  } // 26

  ,({bin,i,bins,width})=>{ // 27
    color.setFill(color.darken((bin)/255))
    fillRect(cenX(-i*width*0.5),0,width/2,10)
    fillRect(cenX(i*width*0.5),0,width/2,10)
    fillRect(cenX(-i*width*0.5),invY(10),width/2,10)
    fillRect(cenX(i*width*0.5),invY(10),width/2,10)
    let temp = canvas.height/bins
    fillRect(0,cenY(-i*temp*0.5),10,temp/2)
    fillRect(0,cenY(i*temp*0.5),10,temp/2)
    fillRect(invX(10),cenY(-i*temp*0.5),10,temp/2)
    fillRect(invX(10),cenY(i*temp*0.5),10,temp/2)
  } // 27

  ,({bin,i,bins,width})=>{ // 28
    color.setFill(color.darken((bin)/255))
    fillRect(cenX(-i*width*0.5),0,width/2,10)
    fillRect(cenX(i*width*0.5),0,width/2,10)
    fillRect(cenX(-i*width*0.5),invY(10),width/2,10)
    fillRect(cenX(i*width*0.5),invY(10),width/2,10)
    let temp = canvas.height/bins
    fillRect(0,cenY(-i*temp*0.5),10,temp/2)
    fillRect(0,cenY(i*temp*0.5),10,temp/2)
    fillRect(invX(10),cenY(-i*temp*0.5),10,temp/2)
    fillRect(invX(10),cenY(i*temp*0.5),10,temp/2)
  } // 28

  ,({i,width,bin})=>{ // 29
    fillCircle(i*width,((1+(Math.sin(((i)**0.5)+Math.cos(i*5)) * Math.cos(i - 9))) / 2)*canvas.height,(bin/255)*25)
  } // 29
  /* thirty
  ████  ████
     █  █  █
  ████  █  █
     █  █  █
  ████  ████
  */
  ,({minC,bins,i,bin,width})=>{ // 30
    ctx.beginPath()
    ctx.arc(cenX(0),cenY(0),(minC/(bins*2))*0.9*(bins-i),(Math.PI/2)-(Math.PI/255)*bin,(Math.PI/2)+(Math.PI/255)*bin)
    ctx.stroke()
  } // 30

  ,({tickNum,i,bin})=>{ // 31
    center()
    fillCircle(
      fakeRandom(i+87,tickNum/1000,i)*canvas.width*0.5
      ,fakeRandom(i+53,tickNum/1000,i)*canvas.height*0.5
      ,(bin/255)*25
    )
  } // 31

  ,({bins,i,bin})=>{ // 32
    let steps = Math.sqrt(bins)
    let heightStep = canvas.height/steps
    let widthStep = canvas.width/steps;
    let x = i % steps;
    let y = Math.floor(i/steps)
    fillCircle((x+0.5)*widthStep,(y+0.5)*heightStep,Math.min(widthStep,heightStep)*(bin/255))
  } // 32

  ,({bin,minC,bins,i})=>{ // 33
    color.setFill(color.darken((bin)/255))
    fillCircle(cenX(0),cenY(0),(minC/bins/2)*(bins-i))
  } // 33

  ,({tickNum,i,bins,minC,bin})=>{ // 34
    ctx.translate((canvas.width/2),(canvas.height/2))
    ctx.rotate(tickNum/50)
    color.setFill(color.darken((bin)/255))
    ctx.fillRect(i*(minC/bins)*0.5,-5,(minC/bins)*0.5,10)
  } // 34

  ,({height,width,i,bin})=>{ // 35
    let chars = ' ..:::++++######'
    let h = (Math.floor(bin/(width/2))*(width/2))
    fillStyle('hsla(0,0,100%,1)')
    ctx.font = `${width*2}px serif`;
    ctx.font = `${width*2}px VT323`;
    for (let j = 0; h >= 0; h -= width/2) {
      ctx.fillText(chars[Math.floor(new alea(i+''+h)()*chars.length)],i*width,invY((h)*height),width)
    }
  } // 35


  ,({height,width,i,bin,tickNum})=>{ // 36
    let chars = ' ..:::++++######'
    let h = (Math.floor(bin/(width/2))*(width/2))
    fillStyle('hsla(0,0,100%,1)')
    ctx.font = `${width*2}px serif`;
    ctx.font = `${width*2}px VT323`;
    for (let j = 0; h >= 0; h -= width/2) {
      ctx.fillText(chars[Math.floor(new alea(Math.floor(i+(tickNum*styleCfg[36].scrollSpeed*0.01))+''+h)()*chars.length)],i*width,invY((h)*height),width)
    }
  } // 36

  ,({bins,i,tickNum,bin})=>{ // 37
    ctx.fillStyle = `hsla(${(360/bins)*i},70%,70%,0.25)`
    let pos = [
      ((new alea(i+'x')() * 2) - 1) * Math.sin(tickNum*0.001*(new alea(i+'xc')())),
      ((new alea(i+'y')() * 2) - 1) * Math.cos(tickNum*0.001*(new alea(i+'yc')()))
    ]
    fillCircle(
      cenX(pos[0] * canvas.width/2),
      cenY(pos[1] * canvas.height/2),
      (bin/255)*25
    )
  } // 37

  ,({bins,i,tickNum,bin})=>{ // 38
    color.setFill(color.opacity(0.25))
    let pos = [
      ((new alea(i+'x')() * 2) - 1) * Math.sin(tickNum*0.001*(new alea(i+'xc')())),
      ((new alea(i+'y')() * 2) - 1) * Math.cos(tickNum*0.001*(new alea(i+'yc')()))
    ]
    fillCircle(
      cenX(pos[0] * canvas.width/2),
      cenY(pos[1] * canvas.height/2),
      (bin/255)*25
    )
  } // 38

  ,({bins,i,tickNum,bin})=>{ // 39
    color.setFill(color.opacity(0.25))
    let pos = [
      ((new alea(i+'x')() * 2) - 1) * Math.sin(tickNum*0.001*(new alea(i+'xc')())),
      ((new alea(i+'y')() * 2) - 1) * Math.cos(tickNum*0.001*(new alea(i+'yc')()))
    ]
    fillCircle(
      cenX(pos[0] * canvas.width/2) + (Math.random()*(bin/25)),
      cenY(pos[1] * canvas.height/2) + (Math.random()*(bin/25)),
      (bin/255)*25
    )
  } // 39
  /* forty
  █  █  ████
  █  █  █  █
  ████  █  █
     █  █  █
     █  ████
  */
  ,({minC,bins,bin,i,nextBin})=>{ // 40
    // center()
    // maxH = (Math.min(canvas.width,canvas.height)/255)/2
    ctx.beginPath()
    moveTo(
      cenX(Math.sin((Math.PI/bins)*i)*bin*(minC/(255*2))),
      cenY(Math.cos((Math.PI/bins)*i)*bin*(minC/(255*2)))
    )
    lineTo(
      cenX(Math.sin((Math.PI/bins)*(i+1))*nextBin*(minC/(255*2))),
      cenY(Math.cos((Math.PI/bins)*(i+1))*nextBin*(minC/(255*2)))
    )
    ctx.stroke()
    ctx.beginPath()
    moveTo(
      cenX(-Math.sin((Math.PI/bins)*i)*bin*(minC/(255*2))),
      cenY(Math.cos((Math.PI/bins)*i)*bin*(minC/(255*2)))
    )
    lineTo(
      cenX(-Math.sin((Math.PI/bins)*(i+1))*nextBin*(minC/(255*2))),
      cenY(Math.cos((Math.PI/bins)*(i+1))*nextBin*(minC/(255*2)))
    )
    ctx.stroke()
  } // 40

  ,({i,width,bin,nextBin,spectrum,volume})=>{ // 41
    // center('y')
    gap = canvas.height/4
    if (i % 2 == 0) {
      for (let j = -1; j <= 1; j++) {
        ctx.beginPath()
        ctx.moveTo(i*width,cenY((bin*gap*(1/volume))+(gap*j)))
        ctx.lineTo((i+1)*width, cenY((nextBin*gap*(1/volume))+(gap*j)))
        ctx.lineTo((i+2)*width, cenY((spectrum[i+2]*gap*(1/volume))+(gap*j)))

        ctx.stroke()
      }
    }
  } // 41

  ,({i,width,bin,volume})=>{ // 42
    fillRect(i*width,0,width,cenY(spectrum[i]*canvas.height*0.4*(1/volume)))
  } // 42

  ,({i,width,bin})=>{ // 43
    fillRect(i*width,(canvas.height*0.25)+(bin*canvas.height*0.25),width,cenY(spectrum[i]*canvas.height*0.25))
  } // 43

  ,({i,width,bin})=>{ // 44
    fillRect(i*width,(canvas.height*0.25)+(bin*canvas.height*0.25),width,cenY(-spectrum[i]*canvas.height*0.5))
  } // 44

  ,({i,width,lastSpectrum,lastBin,bin})=>{ // 45
    if (i == 0) {
      ctx.stroke()
      ctx.beginPath()
      moveTo(i*width,cenY(bin*canvas.height*0.5))
    }
    let avBin = (bin + lastSpectrum[i])/2
    let avNextBin = (lastBin+(lastSpectrum[i-1]||0))/2
    ctx.quadraticCurveTo(
      (i-0.5) * width,
      cenY((avBin+avNextBin)*0.5*canvas.height*0.5),
      i * width,
      cenY(avBin*canvas.height*0.5)
    )
  } // 45

  ,({bin,i,width})=>{ // 46
    center('y')
    for (let j = styleCfg[46].iterations; j > 1; j--) {
      if (i == 0) {
        globalTemps[46][j] = (bin/255)
      } else {
        globalTemps[46][j] = ((bin/255) + (globalTemps[46][j])*j)/(1+j)
      }
      ctx.fillStyle = `hsl(${(360/(styleCfg[46].iterations-1))*j},70%,70%)`
      fillRect(i*width,-(globalTemps[46][j]*canvas.height*0.3),width,(globalTemps[46][j]*canvas.height*0.3*2))
    }
  } // 46

  ,({tickNum,spectrum,i,width})=>{ // 47
    let freq = styleCfg[47].saveFrequency
    let iterations = styleCfg[47].iterations
    if (i == 0) {
      if ((tickNum % freq) == 0) {
        globalTemps[47].unshift(spectrum)
      }
      if (globalTemps[47].length > iterations) {
        globalTemps[47].pop()
      }
    }
    globalTemps[47].forEach((spect, index) => {
      ctx.beginPath()
      ctx.moveTo((i)*width,invY((spect[i]/255)*(canvas.height/iterations))-((canvas.height/iterations)*index*0.8))
      ctx.lineTo((i+1)*width,invY(((spect[i+1]||0)/255)*(canvas.height/iterations))-((canvas.height/iterations)*index*0.8))
      ctx.stroke()
    });
  } // 47

  ,({i,spectrum,width,tickNum})=>{ // 48
    let freq = styleCfg[47].saveFrequency
    let iterations = styleCfg[47].iterations
    if (i == 0) {
      if ((tickNum % freq) == 0) {
        globalTemps[47].push(spectrum)
      }
      if (globalTemps[47].length > iterations) {
        globalTemps[47].shift()
      }
    }
    globalTemps[47].forEach((spect, index) => {
      color.setFill(color.darken((index/iterations)))
      fillRect(
        i*width,
        invY((spect[i]/255)*(canvas.height/iterations)*5)-((canvas.height/iterations)*(iterations-index)*0.5),
        width,
        (spect[i]/255)*(canvas.height/iterations)*5
      )
    });
  } // 48

  ,({i,spectrum,width,tickNum})=>{ // 49
    let freq = styleCfg[47].saveFrequency
    let iterations = styleCfg[47].iterations
    if (i == 0) {
      if ((tickNum % freq) == 0) {
        globalTemps[47].push(spectrum)
      }
      if (globalTemps[47].length > iterations) {
        globalTemps[47].shift()
      }
    }
    globalTemps[47].forEach((spect, index) => {
      ctx.beginPath()
      ctx.moveTo(i*width,invY((spect[i]/255)*(canvas.height/iterations))-((canvas.height/iterations)*(iterations-index)*0.8))
      ctx.lineTo((i+1)*width,invY((spect[i]/255)*(canvas.height/iterations))-((canvas.height/iterations)*(iterations-index)*0.8))
      ctx.lineTo((i+1)*width,invY((spect[i+1]/255)*(canvas.height/iterations))-((canvas.height/iterations)*(iterations-index)*0.8))
      ctx.stroke()
    });
  } // 49
  /* fifty
  ████  ████
  █     █  █
  ████  █  █
     █  █  █
  ████  ████
  */
  ,({i,tickNum,width,spectrum})=>{ // 50
    let freq = styleCfg[47].saveFrequency
    let iterations = styleCfg[47].iterations
    if (i == 0) {
      if ((tick % freq) == 0) {
        globalTemps[47].push(spectrum)
      }
      if (globalTemps[47].length > iterations) {
        globalTemps[47].shift()
      }
    }
    globalTemps[47].forEach((spect, index) => {
      ctx.fillStyle = `rgb(${spect[i-1]||spect[i]},${spect[i]},${spect[i+1]||spect[i]})`
      height = (spect[i]/(255*0.5))
      fillRect(
        (i*width)+(width*0.25*(1-height)),
        invY((canvas.height/iterations)*index)+((canvas.height/iterations)*0.25*(1-height)),
        (width*height*0.5),
        ((canvas.height/iterations)*height*0.5)
      )
    });
  } // 50

  ,({lastBin,bin,nextBin,i,width,height})=>{ // 51
    fillStyle(`rgb(${(lastBin+bin)/2},${bin},${(nextBin+bin)/2})`)
    ctx.fillRect(i*width,invY(0),width,-bin*height)
  } // 51

  ,({lastBin,nextBin,bin,i,width,height})=>{ // 52
    fillStyle(`hsl(${(lastBin+nextBin)/2},${(bin/255)*100}%,70%)`)
    ctx.fillRect(i*width,invY(0),width,-bin*height)
  } // 52

  ,({bin,i,width})=>{ // 53
    let num = globalTemps[53].num
    if (i == 0) {
      globalTemps[53].num = (0)
    }

    globalTemps[53].num = Math.sin(num) + (bin/255)
    if ((
      Math.abs(num) > globalTemps[53].max || isNaN(globalTemps[53].max)
    ) && !(num == Infinity || num == 0)) {
      globalTemps[53].max = Math.abs(num)
    }
    fillRect(i*width,cenY(-(
      num/globalTemps[53].max
    )*canvas.height*0.3),width,((
      num/globalTemps[53].max
    )*canvas.height*0.6))
  } // 53

  ,({bin,i,bins,minC})=>{ // 54
    globalTemps[54][i] = ((bin/255) + (globalTemps[54][i]||0)) % 360
    ang = (globalTemps[54][i]/360)*Math.PI*2
    radi = (minC/2)/bins
    fillCircle(cenX(
      Math.sin(ang)*radi*i
    ),cenY(
      Math.cos(ang)*radi*i
    ),((bin/255)*radi*2))
  } // 54

  ,({i,bin,bins})=>{ /// 55
    globalTemps[55].vels[i] = ((bin/255) + (globalTemps[55].vels[i] || 0)) * 0.75
    globalTemps[55].pos[i] = (globalTemps[55].vels[i] + (globalTemps[55].pos[i]||0)) % 360
    ang = (globalTemps[55].pos[i]/360)*Math.PI*2
    radi = (Math.min(canvas.width,canvas.height)/2)/bins
    fillCircle(cenX(
      Math.sin(ang)*radi*i
    ),cenY(
      Math.cos(ang)*radi*i
    ),((bin/255)*radi))
  } /// 55

  ,({bins,i,tickNum,bin})=>{ // 56
    if (globalTemps[56].vel.length < bins) {
      globalTemps[56].vel[i] = {x: 0, y: 0}
    }
    if (globalTemps[56].pos.length < bins) {
      globalTemps[56].pos[i] = {x: 0, y: 0}
    }
    if (globalTemps[56].goal.length < bins || globalTemps[56].goalCompleted[i]) {
      globalTemps[56].goal[i] = {
        x: (new alea('x'+i+tickNum)()*2)-1,
        y: (new alea('y'+i+tickNum)()*2)-1
      }
      globalTemps[56].goalCompleted[i] = false
    }
    speedMult = (bin/255)*0.4
    pos = globalTemps[56].pos[i]
    goal = globalTemps[56].goal[i]
    goal = {
      x: goal.x*canvas.width*0.5,
      y: goal.y*canvas.height*0.5
    }
    ang = Math.atan2(goal.x-pos.x,goal.y-pos.y)
    vel = globalTemps[56].vel[i]
    globalTemps[56].vel[i] = {
      x: (vel.x + (Math.sin(ang)*speedMult))*0.9,
      y: (vel.y + (Math.cos(ang)*speedMult))*0.9
    }
    pos.x += vel.x
    pos.y += vel.y

    xDif = pos.x - goal.x
    yDif = pos.y - goal.y
    if (Math.sqrt( xDif*xDif + yDif*yDif ) < styleCfg[56].goalCompleteDist) {
      globalTemps[56].goalCompleted[i] = true
    }
    fillCircle(cenX(
      pos.x
    ),cenY(
      pos.y
    ),((bin/255)*10)+1)
  } // 56

  ,({bins, i, bin,})=>{ // 57
    if (globalTemps[56].vel.length < bins) {
      globalTemps[56].vel[i] = {x: 0, y: 0}
    } else if (globalTemps[56].pos.length < bins) {
      globalTemps[56].pos[i] = {x: 0, y: 0}
    } else {

      speedMult = (bin/255)*2.5
      pos = globalTemps[56].pos[i]
      goal = {
        x: mouse.x - (canvas.width/2),
        y: (mouse.y + scrollY) - (canvas.height/2)
      }
      xDif = pos.x - goal.x
      yDif = pos.y - goal.y
      if (mouse.down || (styleCfg[57].enablePush && Math.sqrt( xDif*xDif + yDif*yDif ) < styleCfg[57].pushDist)) {
        ang = Math.atan2(pos.x-goal.x,pos.y-goal.y)
      } else {
        ang = Math.atan2(goal.x-pos.x,goal.y-pos.y)
      }
      vel = (globalTemps[56].vel[i] || {x:0,y:0})
      globalTemps[56].vel[i] = {
        x: (vel.x + (Math.sin(ang)*speedMult))*0.90,
        y: (vel.y + (Math.cos(ang)*speedMult))*0.90
      }
      pos.x += vel.x
      pos.y += vel.y

      fillCircle(cenX(
        pos.x
      ),cenY(
        pos.y
      ),((bin/255)*10)+1)
    }
  } // 57
  ,({bin,i,width})=>{ // 58
    center('y')
    for (let j = styleCfg[46].iterations; j > 1; j--) {
      if (i == 0) {
        globalTemps[46][j] = (bin/255)
      } else {
        globalTemps[46][j] = ((bin/255) + (globalTemps[46][j])*j)/(1+j)
      }
      color.setFill(color.darken(1-(j/styleCfg[46].iterations)))
      fillRect(i*width,-(globalTemps[46][j]*canvas.height*0.3),width,(globalTemps[46][j]*canvas.height*0.3*2))
    }
  } // 58

  ,({bin,i,bins,minC})=>{ // 59
    globalTemps[59][i] = ((bin*10) + (globalTemps[59][i]||0)) % 360
    ang = (globalTemps[59][i]/360)*Math.PI*2
    radi = (minC/2)/bins
    fillCircle(cenX(
      Math.sin(ang+(Math.PI*0.5))*radi*i
    ),cenY(
      Math.cos(ang+(Math.PI*0.5))*radi*i
    ),((bin+1)*radi))
    fillCircle(cenX(
      -Math.sin(ang+(Math.PI*0.5))*radi*i
    ),cenY(
      -Math.cos(ang+(Math.PI*0.5))*radi*i
    ),((bin+1)*radi))
  } // 59
  /* sixty
  ████  ████
  █     █  █
  ████  █  █
  █  █  █  █
  ████  ████
  */
  ,({bin,i,bins,minC})=>{ // 60
    if (!isNaN(globalTemps[60][i]) || !(globalTemps[60].length < bins-1)) {
      if ( globalTemps[60][i] > 0) {
        globalTemps[60][i] -= 0.05
      } else {
        globalTemps[60][i] += 0.05
      }
    } else {
      globalTemps[60][i] = 0
    }
    globalTemps[60][i] = ((bin*5) + (globalTemps[60][i]||0)) % 360
    ang = (globalTemps[60][i]/360)*Math.PI*2
    ang2 = ((globalTemps[60][i-1]||0)/360)*Math.PI*2
    radi = (minC/2)/bins
    color.setStroke()
    ctx.beginPath()
    moveTo(cenX(
        Math.sin(ang2+(Math.PI*0.5))*radi*(i-1)
      ),cenY(
        Math.cos(ang2+(Math.PI*0.5))*radi*(i-1)
    ))
    lineTo(cenX(
        Math.sin(ang+(Math.PI*0.5))*radi*i
      ),cenY(
        Math.cos(ang+(Math.PI*0.5))*radi*i
    ))
    ctx.stroke()
    color.setStroke(color.invert())
    ctx.beginPath()
    moveTo(cenX(
        -Math.sin(ang2+(Math.PI*0.5))*radi*(i-1)
      ),cenY(
        -Math.cos(ang2+(Math.PI*0.5))*radi*(i-1)
    ))
    lineTo(cenX(
        -Math.sin(ang+(Math.PI*0.5))*radi*i
      ),cenY(
        -Math.cos(ang+(Math.PI*0.5))*radi*i
    ))
    ctx.stroke()
  } // 60
]
