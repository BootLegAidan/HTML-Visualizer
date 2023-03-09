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
