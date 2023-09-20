// Function to extract the movie ID from the URL
function getMovieIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Get the movie ID from the URL
const movieId = getMovieIdFromURL();

// Fetch movie details using the OMDB API
fetch(`https://www.omdbapi.com/?apikey=3306cdc3&i=${movieId}`)
    .then(response => response.json())
    .then(data => {
        const moviePoster = document.getElementById('movie-poster');
        const movieTitle = document.getElementById('movie-title');
        const movieYear = document.getElementById('movie-year');
        const moviePlot = document.getElementById('movie-plot');
        const movieDirector = document.getElementById('movie-director');
        const movieActor = document.getElementById('movie-actor');
        const movieImdbRating = document.getElementById('movie-imdbRating');
        const movieRatings = document.getElementById('movie-ratings');
        const movieGenre = document.getElementById('movie-genre');
        document.getElementById('background').style = `background-image: url(${data.Poster})`

        // Populate the movie details
        moviePoster.src = data.Poster;
        movieTitle.textContent = data.Title;
        movieYear.innerHTML = `<b>Year:</b> ${data.Year}`;
        moviePlot.innerHTML = `<b>Plot:</b> ${data.Plot}`;
        movieDirector.innerHTML = `<b>Director:</b> ${data.Director}`;
        movieActor.innerHTML = `<b>Actors:</b> ${data.Actors}`;
        movieImdbRating.innerHTML = `<b>IMDB Rating:</b> ${data.imdbRating} (${data.imdbVotes} votes)`
        movieGenre.innerHTML = `<b>Genres:</b> ${data.Genre}`
        movieRatings.innerHTML = data.Ratings.map((rating) => `<li><b>${rating.Source}:</b> ${rating.Value}</li>`).join('')
        console.log(data)

        // Add more information as needed
    })
    .catch(error => console.error(error));
