document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const resultsContainer = document.getElementById('results');
    const favoritesContainer = document.getElementById('favorites');

    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    const renderBooks = (books, container, isFavoriteList = false) => {
        container.innerHTML = books.map(book => {
            const bookInfo = book.volumeInfo;
            return `
                <div class="book">
                    <img src="${bookInfo.imageLinks?.thumbnail || ''}" alt="${bookInfo.title}">
                    <div class="book-info">
                        <h3>${bookInfo.title}</h3>
                        <p>${bookInfo.authors?.join(', ')}</p>
                    </div>
                    <div class="book-actions">
                        ${isFavoriteList ? 
                            `<button data-id="${book.id}" class="remove-favorite">Remove</button>` :
                            `<button data-id="${book.id}" class="add-favorite">Add to Favorites</button>`
                        }
                    </div>
                </div>
            `;
        }).join('');
    };

    const updateFavorites = () => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
        renderBooks(favorites, favoritesContainer, true);
    };

    const handleSearch = async () => {
        const query = searchInput.value.trim();
        if (query) {
            try {
                const books = await searchBooks(query);
                renderBooks(books, resultsContainer);
            } catch (error) {
                resultsContainer.innerHTML = '<p>Error fetching books. Please try again later.</p>';
            }
        }
    };

    const handleAddFavorite = (id) => {
        const book = [...resultsContainer.querySelectorAll('.book')].find(b => b.querySelector(`button[data-id="${id}"]`));
        const bookData = {
            id,
            volumeInfo: {
                title: book.querySelector('h3').textContent,
                authors: [book.querySelector('p').textContent],
                imageLinks: {
                    thumbnail: book.querySelector('img').src
                }
            }
        };
        favorites.push(bookData);
        updateFavorites();
    };

    const handleRemoveFavorite = (id) => {
        favorites = favorites.filter(book => book.id !== id);
        updateFavorites();
    };

    searchButton.addEventListener('click', handleSearch);

    resultsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-favorite')) {
            handleAddFavorite(e.target.dataset.id);
        }
    });

    favoritesContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-favorite')) {
            handleRemoveFavorite(e.target.dataset.id);
        }
    });

    updateFavorites();
});
