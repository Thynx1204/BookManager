const API_URL = 'https://www.googleapis.com/books/v1/volumes?q=';

async function searchBooks(query) {
    try {
        const response = await fetch(`${API_URL}${query}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.items || [];
    } catch (error) {
        console.error('Error fetching books:', error);
        throw error;
    }
}
