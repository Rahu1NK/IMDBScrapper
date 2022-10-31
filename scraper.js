const request = require("request-promise")
const cheerio = require("cheerio")

const url = "https://www.imdb.com/search/title/?groups=top_250&sort=user_rating"

const getMovies = async () => {
  const response = await request(url)
  const movies = []
  const $ = cheerio.load(response)
  const listItems = $('div[class="lister-item-content"]')
  listItems.each(function (idx, el) {
    movies.push({
      id: idx + 1,
      title: $(el).children("h3").children("a").text(),
      year: $(el).children("h3").children("span").last().text(),
      ratings: $(el).children("div").children("div").children("strong").text(),
      director: $(el).children("p").children("a").first().text()
    })
  })

  console.log(movies)
}

getMovies()
