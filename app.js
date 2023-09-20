// Define variables
const apiKey = '3306cdc3';
const searchInput = document.querySelector('#search-input');
const searchResults = document.querySelector('#search-results');
const suggestionsDropdown = document.querySelector('#suggestions-dropdown');
const favoritesList = document.querySelector('#favorites-list');

// Function to fetch and display search results
function searchMovies(query) {
    fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${query}`)
        .then(response => response.json())
        .then(data => {
            if (data.Search) {
                const movies = data.Search;
                searchResults.innerHTML = movies.map(movie => `
                    <div class="col-md-4 mb-3">
                        <div class="card">
                            <a href="movie/movie.html?id=${movie.imdbID}"><img src="${movie.Poster}" class="card-img-top" alt="${movie.Title}"></a>
                            <div class="card-body">
                                <h5 class="card-title">${movie.Title}</h5>
                                <p class="card-text">${movie.Year}</p>
                                <button class="btn btn-primary favorite-btn" data-title="${movie.Title}" data-id="${movie.imdbID}" data-poster="${movie.Poster}" data-year="${movie.Year}">Add to Favorites</button>
                            </div>
                        </div>
                    </div>
                `).join('');
            } else {
                searchResults.innerHTML = '<p>No results found</p>';
            }
        })
        .catch(error => console.error(error));
}

// Function to fetch search suggestions
function fetchSearchSuggestions(query) {
    fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${query}`)
        .then(response => response.json())
        .then(data => {
            if (data.Search) {
                const suggestions = data.Search.map(movie => movie.Title);
                displaySuggestions(suggestions);
            } else {
                clearSuggestions();
            }
        })
        .catch(error => console.error(error));
}

// Function to display search suggestions
function displaySuggestions(suggestions) {
    suggestionsDropdown.innerHTML = ''; // Clear previous suggestions
    suggestions.forEach(suggestion => {
        const suggestionItem = document.createElement('div');
        suggestionItem.classList.add('suggestion-item');
        suggestionItem.textContent = suggestion;
        suggestionItem.addEventListener('click', () => {
            searchInput.value = suggestion;
            clearSuggestions();
            searchMovies(suggestion)
        });
        suggestionsDropdown.appendChild(suggestionItem);
    });
    suggestionsDropdown.style.display = 'block';
}

// Function to clear search suggestions
function clearSuggestions() {
    suggestionsDropdown.innerHTML = '';
    suggestionsDropdown.style.display = 'none';
}

// Event listener for search input
searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim();
    if (query.length >= 3) {
        fetchSearchSuggestions(query);
        searchMovies(query)
    } else {
        clearSuggestions();
    }
});

// Close suggestions when clicking outside the input or suggestions
document.addEventListener('click', event => {
    if (event.target !== searchInput && event.target !== suggestionsDropdown) {
        clearSuggestions();
    }
});


// Function to add a movie to favorites
function addToFavorites(imdbID, Title, Poster, Year) {
    const movie = { imdbID, Title, Poster, Year }
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites.push(movie);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoritesList();
}

// Function to update the favorites list
function updateFavoritesList() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites.slice(3)
    favoritesList.innerHTML = favorites.map(movie => `
        <li class="list-group-item">
            ${movie.Title} (${movie.Year})
            <button class="btn btn-danger remove-btn float-right" data-id="${movie.imdbID}">Remove</button>
        </li>
    `).join('');
}

// Event listener for favorite buttons
searchResults.addEventListener('click', event => {
    if (event.target.classList.contains('favorite-btn')) {
        const title = event.target.getAttribute('data-title');
        const poster = event.target.getAttribute('data-poster');
        const imdbID = event.target.getAttribute('data-id');
        const year = event.target.getAttribute('data-year');
        addToFavorites(imdbID, title, poster, year);
    }
});

// Event listener for page load
window.addEventListener('load', () => {
    updateFavoritesList();
});

// Event listener for remove from favorites buttons
favoritesList.addEventListener('click', event => {
    if (event.target.classList.contains('remove-btn')) {
        const movie = event.target.dataset.id;
        removeFromFavorites(movie);
    }
});

// Function to remove a movie from favorites
function removeFromFavorites(movie) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const updatedFavorites = favorites.filter(fav => fav.imdbID !== movie);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    updateFavoritesList();
}
