document.addEventListener('DOMContentLoaded', async () => {
    try {

        const LoggedInUser = JSON.parse(localStorage.getItem('logedInUser'));
        
        
        if (!LoggedInUser) {
            alert("User is not logged in");
            return;
        }

        
        const BorrowedBooksApiUrl = "http://localhost:5116/api/BorrowedBook";
        const bookApiUrl = "http://localhost:5116/api/Book/get-all-books-with-images";

        
        const BookResponse = await fetch(BorrowedBooksApiUrl);
        if (!BookResponse.ok) {
            alert("Can't fetch borrowed books data");
            return;
        }

        const BorrowedBooks = await BookResponse.json();
        console.log("Borrowed Books:", BorrowedBooks); 

        
        const booksResponse = await fetch(bookApiUrl);
        if (!booksResponse.ok) {
            alert("Can't fetch books details");
            return;
        }

        const books = await booksResponse.json();
        console.log("Books:", books); 
        console.log("Logged In User:", LoggedInUser); 

        const tableView = document.getElementById('borrowedBooksTable');
        const bookCardContainer = document.getElementById('borrowedBooksCards');

    
        BorrowedBooks.filter(b => b.userNicNumber === LoggedInUser.Nic)
.forEach(borrowedBook => {
    
    console.log("Borrowed Book:", borrowedBook);

    
    
    const bookData = books.find(book => {
        const isMatching = book.isbn === borrowedBook.bookIsbn;
        console.log(`Comparing borrowed book ISBN: '${borrowedBook.bookIsbn}' with book ISBN: '${book.isbn}' - Match: ${isMatching}`);
        return isMatching;
    });

    console.log("Book Data:", bookData); 
    
    if (bookData) {
        
        let row = document.createElement('tr');
        row.innerHTML = `
            <td>${String(borrowedBook.bookname)}</td>
            <td>${String(bookData.isbn)}</td>
            <td>${String(bookData.publisher)}</td>
            <td>${borrowedBook.borrowedDate ? new Date(borrowedBook.borrowedDate).toLocaleDateString() : 'N/A'}</td>
            <td>${borrowedBook.duedate ? new Date(borrowedBook.duedate).toLocaleDateString() : 'N/A'}</td>
        `;
        tableView.appendChild(row);
        

        
      
let card = document.createElement('div');
card.className = "col-md-4 mb-4"; 
card.innerHTML = `
    <div class="card h-100"> <!-- Use Bootstrap card classes -->
        <img src="${bookData.images}" class="card-img-top" alt="${borrowedBook.bookname}" />
        <div class="card-body">
            <h5 class="card-title">${borrowedBook.bookname}</h5>
            <p class="card-text">ISBN: ${bookData.isbn}</p>
            <p class="card-text">Publisher: ${bookData.publisher}</p>
        </div>
    </div>
`;
bookCardContainer.appendChild(card);

    } else {
        console.log(`No book data found for ISBN: ${borrowedBook.bookIsbn}`);
    }
});

    } catch (error) {
        console.log(`Error: ${error}`);
    }
});
