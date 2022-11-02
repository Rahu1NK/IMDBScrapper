const request = require("request-promise")
const cheerio = require("cheerio")
import * as O from "optics-ts"
const url = "https://www.imdb.com/search/title/?groups=top_250&sort=user_rating"

type Movies = {
  id: number
  title: string
  year: string
  ratings: string
  director: string
  stars: Array<string>
}
const movies: Movies[] = []

const getStars = (starsData: any, $: any) => {
  const stars: Array<string> = []
  starsData.map((index: number) => {
    if (index > 0) {
      stars.push($(starsData[index]).text())
    }
  })
  return stars
}

const getIndexOfMovie = (movieName: string) => {
  const index = movies.findIndex((movie) => {
    return movie.title.toLowerCase() === movieName.toLowerCase()
  })
  return index
}

//Get specified movie Detail using Lens's getter
const getMovieDetails = (movieName: string, valueToBeFetched: any) => {
  const index: any = getIndexOfMovie(movieName)
  if (index !== -1) {
    const movieLens = O.optic<Movies>().prop(valueToBeFetched)
    console.log(O.get(movieLens)(movies[index]))
  } else {
    console.log(movieName + " not found")
  }
}

const updateMovies = (movie: any, index: any) => {
  movies[index] = movie
}
// Updates the Movie Detail by lens's modifier
const updateMovieDetail = (movieName: string, valueToBeChanged: any, value: any) => {
  const index = getIndexOfMovie(movieName)
  if (index !== -1) {
    const movieLens = O.optic<Movies>().prop(valueToBeChanged)
    updateMovies(O.modify(movieLens)((x) => (x = value))(movies[index]), index)
    console.log("Movie details updated")
  } else {
    console.log("Movie not found")
  }
}
const getMovie = (movieName: string) => {
  const index = getIndexOfMovie(movieName)
  if (index !== -1) console.log(movies[index])
  else {
    console.log(movieName + " not Found")
  }
}
const getMovies = async () => {
  const response = await request(url)
  const $ = cheerio.load(response)
  const listItems = $('div[class="lister-item-content"]')

  listItems.each(function (idx: number, el: any) {
    const starsData = $(el).children("p").eq(2).children("a")
    movies.push({
      id: idx + 1,
      title: $(el).children("h3").children("a").text(),
      year: $(el).children("h3").children("span").last().text(),
      ratings: $(el).children("div").children("div").children("strong").text(),
      director: $(el).children("p").children("a").first().text(),
      stars: getStars(starsData, $)
    })
  })

  // Getting Movie Detail
  getMovieDetails("The Dark Knight", "ratings")

  // Modifiying Movie Detail
  updateMovieDetail("The Dark Knight", "ratings", "7.0")

  getMovie("The Dark Knight")
}

getMovies()
