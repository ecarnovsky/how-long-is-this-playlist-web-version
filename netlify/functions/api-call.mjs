export default async (req, context) => {

    console.log("Netlify Function called at " + new Date())

    // const apiKey = Netlify.env.get("YOUTUBE_API_KEY");


    
    return new Response("Hello, world!");
  };
  