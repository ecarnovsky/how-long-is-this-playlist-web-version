document.querySelector('#playlist-url-sumbit-btn').addEventListener('click', getPlaylistTime)


async function getPlaylistTime(){

    const url = document.querySelector('#playlist-url-input').value
    const playlistId = url.split('list=')[1]

    const seconds = await getSeconds(playlistId)

    const playlistTime = new PlaylistTime(seconds)

    document.querySelector('#time-display-span').innerHTML = playlistTime.getTimeString()


}

function getSeconds(playlistId){
    return fetch(`/.netlify/functions/api-call?id=${playlistId}`)
    .then( res => res.json())
    .then(data => {
        console.log(data)
        return data.totalSeconds
    })
    .catch(err => {
        console.log(`error ${err}`)
    })
}

