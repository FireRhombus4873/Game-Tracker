export default async (req, context) => {
  // 1. Get the game name from the URL query (e.g., ?name=Batman)
  const url = new URL(req.url);
  const gameName = url.searchParams.get("name");

  if (!gameName) {
    return new Response(JSON.stringify({ error: "No game name provided" }), { status: 400 });
  }

  // 2. Prepare the HLTB request (same as your original payload)
  const hltbUrl = "https://howlongtobeat.com/api/find";
  const payload = {
    "searchType": "games",
    "searchTerms": gameName.split(" "),
    "searchPage": 1,
    "size": 5,
    "searchOptions": {
        "games": {
            "userId": 0, "platform": "", "sortCategory": "popular", "rangeCategory": "main",
            "rangeTime": { "min": null, "max": null },
            "gameplay": { "perspective": "", "flow": "", "genre": "", "difficulty": "" },
            "rangeYear": { "min": "", "max": "" }, "modifier": ""
        },
        "users": { "sortCategory": "postcount" },
        "lists": { "sortCategory": "follows" },
        "filter": "", "sort": 0, "randomizer": 0
    },
    "useCache": true,
    "ign_322b86fc": "49148ec6e170bbb7" // Remember to update this if it breaks!
  };

  try {
    const response = await fetch(hltbUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0",
        "Origin": "https://howlongtobeat.com",
        "Referer": "https://howlongtobeat.com/"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    // 3. Return the data to your GitHub Pages site
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // Allows your GitHub Page to see the result
        "Access-Control-Allow-Methods": "GET"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};