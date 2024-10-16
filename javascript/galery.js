document.addEventListener("DOMContentLoaded", async (e) => {
    e.preventDefault();

    try {
        const bookurl = "http://localhost:5116/api/Book/get-all-books-with-images";

        let gallyDiv = document.getElementById('gallery');
        const bookresponse = await fetch(bookurl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const books = await bookresponse.json();
        console.log(books);
        gallyDiv.innerHTML = "";
        books.forEach(book => {
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
    } catch (error) {
        console.error(error);
        alert("Some issues occurred: " + error);
    }

    let loggedinUserData = JSON.parse(localStorage.getItem('logedInUser'));
    let displayName = document.getElementById('UserNames');
    displayName.textContent = "Welcome, " + loggedinUserData.FirstName + " " + loggedinUserData.LastName;
});

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
