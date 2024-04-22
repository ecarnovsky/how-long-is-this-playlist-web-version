export default async (req, context) => {

    console.log("Netlify Function called at " + new Date())

    const platlistId = "PLvSnSObVMQdIlhVIwBcnPMfijIa_7DCl0"

    let videoIds = await getArrOfVideos(platlistId)

    console.log(videoIds)

    let totalSeconds = await getTotalSeconds(videoIds)
    
    console.log(totalSeconds)

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
  
  /**
   * This function calls the google api once for every array within the 
   * videoIds array. After each call, the duration of each video
   * is taken from the response and parsed. The total seconds for each video 
   * is then calculated and added to the variable 
   * totalSeconds which is then returned.
   * @param { [[]] } videoIds - A 2D array of the ids of the videos in the playlist. No inner array should have more than 50 elements.
   * @returns {Number} - The total number of seconds in the playlist.
   */
  async function getTotalSeconds(videoIds){

    const apiKey = Netlify.env.get("YOUTUBE_API_KEY")
    let totalSeconds = 0

    for(let i = 0; i < videoIds.length; i++){

        await fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoIds[i].join(',')}&part=contentDetails&key=${apiKey}`)
        .then(res => res.json())
        .then(data => {

            const videos = data.items

            for(let j = 0; j < videos.length; j++){

                let timeStr = videos[j].contentDetails.duration

                let hoursInTimeStr = timeStr.match(/\d+H/)
                if(hoursInTimeStr){
                    const hours = Number(hoursInTimeStr[0].replace('H', ''))
                    totalSeconds += hours * 3600
                }
                let minutesInTimeStr = timeStr.match(/\d+M/)
                if(minutesInTimeStr){
                    const minutes = Number(minutesInTimeStr[0].replace('M', ''))
                    totalSeconds += minutes * 60
                }
                let secondsInTimeStr = timeStr.match(/\d+S/)
                if(secondsInTimeStr){
                    const seconds = Number(secondsInTimeStr[0].replace('S', ''))
                    totalSeconds += seconds
                }

            }   
        })
        .catch(err => {
            console.log(`error ${err}`)
        })


    }

    return totalSeconds
  }