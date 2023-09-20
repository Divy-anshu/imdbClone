// Function to get favorites from local storage
function getFavoritesFromLocalStorage() {
    return JSON.parse(localStorage.getItem('favorites')) || [];
}

// Function to remove a movie from favorites
function removeFromFavorites(movieId) {
    let favorites = getFavoritesFromLocalStorage();
    favorites = favorites.filter(movie => movie.imdbID !== movieId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoritesList();
}

// Function to update the favorites list
function updateFavoritesList() {
    const favoritesList = document.getElementById('favorites-list');
    const favorites = getFavoritesFromLocalStorage();

    if (favorites.length === 0) {
        favoritesList.innerHTML = '<p>No favorite movies added.</p>';
    } else {
        favoritesList.innerHTML = favorites.map(movie => `
            <div class="col-md-3 mb-4">
                <div class="card">
                    <img src="${movie.Poster}" class="card-img-top" alt="${movie.Title}">
                    <div class="card-body">
                        <h5 class="card-title">${movie.Title}</h5>
                        <p class="card-text">${movie.Year}</p>
                        <button class="btn btn-danger remove-btn" data-movie-id="${movie.imdbID}">Remove from Favorites</button>
                    </div>
                </div>
            </div>
        `).join('');

        // Attach event listeners to remove buttons
        const removeButtons = document.querySelectorAll('.remove-btn');
        removeButtons.forEach(button => {
            button.addEventListener('click', event => {
                const movieId = event.target.getAttribute('data-movie-id');
                removeFromFavorites(movieId);
            });
        });
    }
}

// On page load, populate the favorites list
window.addEventListener('load', () => {
    updateFavoritesList();
});
