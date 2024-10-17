document.addEventListener("DOMContentLoaded", async (e) => {
    e.preventDefault();

    let books = []; // Array to hold all books
    const gallyDiv = document.getElementById('gallery');
    const searchInput = document.getElementById('searchInput');
    const sortOptions = document.getElementById('sortOptions');

    try {
        const bookurl = "http://localhost:5116/api/Book/get-all-books-with-images";
        const bookresponse = await fetch(bookurl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        books = await bookresponse.json();
        console.log(books);
        displayBooks(books); // Display all books initially
    } catch (error) {
        console.error(error);
        alert("Some issues occurred: " + error);
    }

    // Display welcome message
    let loggedinUserData = JSON.parse(localStorage.getItem('logedInUser'));
    if (loggedinUserData) {
        let displayName = document.getElementById('UserNames');
        displayName.textContent = "Welcome, " + loggedinUserData.FirstName + " " + loggedinUserData.LastName;
    }

    // Add search functionality
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredBooks = books.filter(book => 
            book.title.toLowerCase().includes(searchTerm) || 
            book.author.toLowerCase().includes(searchTerm) || 
            book.genre.toLowerCase().includes(searchTerm)
        );
        displayBooks(filteredBooks);
    });

    // Function to display books in the gallery
    function displayBooks(booksToDisplay) {
        gallyDiv.innerHTML = ""; // Clear existing content
        booksToDisplay.forEach(book => {
            const card = document.createElement('div');
            card.classList.add('book-card');
            card.innerHTML = `
                <img src="${book.images}" alt="${book.title}">
                <h3>${book.title}</h3>
                <p>ISBN: ${book.isbn}</p>
                <p>Publisher: ${book.publisher}</p>
                <p>Genre: ${book.genre}</p>
                <p>Copies: ${book.bookCopies}</p>
                <button onclick="requestBook('${book.isbn}', '${book.title}')">Request</button>
            `;
            gallyDiv.appendChild(card);
        });
    }
});

// Request book function remains unchanged
let requestBook = async (isbn, bookName) => {
    let loggedinUserData = JSON.parse(localStorage.getItem('logedInUser'));

    if (!loggedinUserData) {
        alert("You must be logged in to request a book.");
        return;
    }

    let RequestData = {
        UserFirstName: loggedinUserData.FirstName,
        UserLastName: loggedinUserData.LastName,
        UserNicNumber: loggedinUserData.Nic,
        RequestedDate: new Date().toISOString(),  // Send in ISO format for DateTime
        Isbn: parseInt(isbn),  // Convert ISBN to integer if it isn't already
        BookName: bookName
    };

    console.log("Requesting Book:", RequestData);

    const BookRequestApiUrl = "http://localhost:5116/api/BookRequest";

    try {
        const response = await fetch(BookRequestApiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(RequestData)
        });

        if (response.ok) {
            alert("Book requested successfully");
        } else {
            const errorData = await response.json();
            console.error("Error response:", errorData);
            alert("Failed to request book: " + (errorData.message || "Unknown error"));
        }
    } catch (error) {
        console.error("Fetch error:", error);
        alert("Failed to request book. Please try again later.");
    }
};
