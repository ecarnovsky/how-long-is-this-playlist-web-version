document.querySelector('#playlist-url-sumbit-btn').addEventListener('click', getPlaylistTime)


function getPlaylistTime(){


    fetch('/.netlify/functions/api-call')
    .then(res => res.body)
    .then(data => {
        console.log(data)
    })
    .catch(err => {
        console.log(`error ${err}`)
    })


}

