export default async (req, context) => {

    console.log("Netlify Function called at " + new Date())

    const platlistId = "PLvSnSObVMQdIlhVIwBcnPMfijIa_7DCl0"

    let videoIds = await getArrOfVideos(platlistId)

    console.log(videoIds)
    
    return new Response("hello")
  }
  


  /**
   * This function sends a api request to google
   * to get the ids of the videos in a playlist.
   * @param {Number} platlistId - The id of the playlist
   * @returns A 2D array of playlist ids. Each inner array holds a max of 50 ids.
   */
  async function getArrOfVideos(platlistId){

    let videoIds = []

    const apiKey = Netlify.env.get("YOUTUBE_API_KEY")

    const baseURL = `https://www.googleapis.com/youtube/v3/playlistItems?playlistId=${platlistId}&key=${apiKey}&part=contentDetails&maxResults=50`

    let numVideosInPlaylist = 5001
    let nextPageToken = ""

    while(numVideosInPlaylist - videoIds.length * 50 > 0){

        let smallVideosIdArr = []

        let url = baseURL
        if (nextPageToken != ""){
            url += `&pageToken=${nextPageToken}`
        }

        await fetch(url)
        .then(res => res.json())
        .then(data => {

            // Sets the number of videos to the correct value during the first loop
            if(numVideosInPlaylist === 5001){
                numVideosInPlaylist = Number(data.pageInfo.totalResults)
            }
    
            const videos = data.items
    
            for(let i = 0; i < videos.length; i++){
                const videoId = videos[i].contentDetails.videoId
                smallVideosIdArr.push(videoId)
            }

            if(data.nextPageToken){
                nextPageToken = data.nextPageToken
            }

            videoIds.push(smallVideosIdArr)

    
        })
        .catch(err => {
            console.log(`error ${err}`)
        })

    }

    return videoIds


  }
  