export default async (req, context) => {

    const apiKey = Netlify.env.get("YOUTUBE_API_KEY");



    return {
        statusCode: 200,
        body: "hello"
    }
  }
  