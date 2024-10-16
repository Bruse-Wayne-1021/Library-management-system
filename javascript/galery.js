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
                <button onclick="request('${book.isbn}', '${book.title}')">Request</button>
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

let request = async (isbn, bookName) => {
    let loggedinUserData = JSON.parse(localStorage.getItem('logedInUser'));
    let RequestData = {
        UserFirstName: loggedinUserData.FirstName,
        UserLastName: loggedinUserData.LastName,
        UserNicNumber: loggedinUserData.Nic,
        BookId: isbn, // Assuming ISBN is passed instead of BookId. Change accordingly if needed.
        BookName: bookName
    };

    const BookRequestApiUrl = "http://localhost:5116/api/BookRequest"; // Ensure this is the correct API URL

    const request = await fetch(BookRequestApiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(RequestData)
    });
    console.log(RequestData)

    if (request.ok) {
        alert("Book requested successfully");
    } else {
        alert("Failed to request book");
    }
};
