document.querySelector('#playlist-url-sumbit-btn').addEventListener('click', getPlaylistTime)


async function getPlaylistTime(){

    const seconds = await getSeconds()

    let playlistTime = new PlaylistTime(seconds)

    document.querySelector('#time-display-span').innerHTML = playlistTime.getTimeString()


}

function getSeconds(){
    return fetch('/.netlify/functions/api-call')
    .then( res => res.json())
    .then(data => {
        console.log(data)
        return data.totalSeconds
    })
    .catch(err => {
        console.log(`error ${err}`)
    })
}

