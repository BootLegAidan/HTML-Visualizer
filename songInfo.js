let songList = []
let songInfo = {}

fetch('songs.json')
.then((response) => response.json())
.then((json) => {
  songInfo = json
  songList = Object.values(songInfo)
  start()
});

function addSong(title,artist) {
  songList.push(
    {title:title,artist:artist}
  )
}
