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

// let accessToken = 'yG5OVcn8xA75mxxHLkpfW2kEK6ajYDSyLOcvFwBt'
// let apiURL = 'https://api.genius.com'
// let lastPacket = ''
// fetch(
//   "https://metabrainz.org/api/musicbrainz/replication-info?token="+accessToken,
//   {
//     "method": "GET"
//   }
// ).then(response => {
//   console.log(response);
//   response.json().then(result => {
//       console.log(result.last_packet);
//       lastPacket = result.last_packet
//       fetch(
//         "https://metabrainz.org/api/musicbrainz/"+lastPacket+"?token="+accessToken,
//         {
//           "method": "GET"
//         }
//       ).then(getInfo)
//   })
// })
// function getInfo(response) {
//   console.log(
//     response,
//     response.text
//   );
// }
